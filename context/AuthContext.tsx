'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

type User = {
  id: number
  email: string
  name: string
  type: 'CLIENT' | 'PROVIDER'
  description?: string
  createdAt: string
  updatedAt: string
  avatar?: string
  phone?: string
  isAdmin?: boolean
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  client?: {
    id: number
    userId: number
    cpf: string
  }
  provider?: {
    id: number
    userId: number
    cnpj: string
    description: string
  }
}

type AuthContextType = {
  token: string | null
  user: User | null
  login: (token: string, user: User, remember: boolean) => Promise<void>
  logout: () => void
  isInitialized: boolean
  isAdmin: () => boolean
  syncCookiesWithLocalStorage: () => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
  isInitialized: false,
  isAdmin: () => false,
  syncCookiesWithLocalStorage: () => {},
})

// Configurações para os cookies
const COOKIE_TOKEN_NAME = 'access_token'
const COOKIE_USER_NAME = 'user_data'
const COOKIE_OPTIONS = {
  expires: 30, // 30 dias
  path: '/',
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
}

// Função utilitária para obter token - apenas localStorage/sessionStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null

  // Verificar apenas nos storages locais, não nos cookies
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    null
  )
}

// Função específica para obter token dos cookies (para middleware apenas)
const getTokenFromCookie = (): string | null => {
  if (typeof window === 'undefined') return null
  return Cookies.get(COOKIE_TOKEN_NAME) || null
}

// Função utilitária para obter dados do usuário
const getUserData = (): User | null => {
  if (typeof window === 'undefined') return null

  // Verificar primeiro nos storages
  const userString =
    localStorage.getItem('user') || sessionStorage.getItem('user')

  if (userString) {
    try {
      return JSON.parse(userString)
    } catch {
      return null
    }
  }

  // Se não encontrar nos storages, verificar nos cookies (para middleware)
  const cookieUserString = Cookies.get(COOKIE_USER_NAME)
  if (cookieUserString) {
    try {
      return JSON.parse(cookieUserString)
    } catch {
      return null
    }
  }

  return null
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null
    user: User | null
  }>({ token: null, user: null })

  const [isInitialized, setIsInitialized] = useState(false)

  // Função para verificar se o usuário é admin
  const isAdmin = () => {
    return authState.user?.isAdmin === true
  }

  // Função para sincronizar cookies com localStorage
  const syncCookiesWithLocalStorage = () => {
    if (typeof window === 'undefined') return

    // Sincronizar token - um sentido apenas: localStorage -> cookie
    const token = getToken()
    if (token) {
      // Definir apenas o cookie para o middleware
      Cookies.set(COOKIE_TOKEN_NAME, token, COOKIE_OPTIONS)
    }

    // Sincronizar dados do usuário
    const userData = getUserData()
    if (userData) {
      Cookies.set(COOKIE_USER_NAME, JSON.stringify(userData), COOKIE_OPTIONS)
    }

    // Sincronizar devRoutes
    const devRoutes = localStorage.getItem('devRoutes')
    if (devRoutes) {
      Cookies.set('devRoutes', devRoutes, COOKIE_OPTIONS)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getToken()
      const user = getUserData()

      if (token && user) {
        setAuthState({
          token,
          user,
        })
      }

      // Sincronizar cookies com localStorage
      syncCookiesWithLocalStorage()

      setIsInitialized(true)
    }
  }, [])

  const login = async (token: string, user: User, remember: boolean) => {
    return new Promise<void>((resolve) => {
      const storage = remember ? localStorage : sessionStorage

      // Armazenar no storage (principal)
      storage.setItem('access_token', token)
      storage.setItem('user', JSON.stringify(user))

      // Armazenar também nos cookies (para middleware)
      Cookies.set(COOKIE_TOKEN_NAME, token, {
        ...COOKIE_OPTIONS,
        // Para o sessionStorage, use expires: undefined para fazer o cookie expirar com a sessão
        expires: remember ? COOKIE_OPTIONS.expires : undefined,
      })
      Cookies.set(COOKIE_USER_NAME, JSON.stringify(user), {
        ...COOKIE_OPTIONS,
        expires: remember ? COOKIE_OPTIONS.expires : undefined,
      })

      setAuthState({ token, user })

      setTimeout(() => {
        resolve()
      }, 50)
    })
  }

  const logout = async () => {
    try {
      const token = getToken()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      if (token) {
        try {
          const response = await fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })

          console.log('Resposta do logout:', response.status)
        } catch (err) {
          console.error('Erro na chamada de logout:', err)
        }
      }
    } finally {
      localStorage.clear()
      sessionStorage.clear()

      const removalOptions = {
        path: '/',
        sameSite: 'strict' as const,
        secure: process.env.NODE_ENV === 'production',
      }

      const possibleCookies = [
        COOKIE_TOKEN_NAME,
        COOKIE_USER_NAME,
        'devRoutes',
        'access_token',
        'user_data',
        'session',
        'auth',
        'session_token',
      ]

      possibleCookies.forEach((cookie) => {
        Cookies.remove(cookie, removalOptions)

        if (cookie === 'session_token') {
          document.cookie = `session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          document.cookie = `session_token=; max-age=0; path=/;`

          const domain = window.location.hostname
          document.cookie = `session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
        }
      })

      console.log('Cookies após logout:', Cookies.get())

      setAuthState({ token: null, user: null })

      window.location.href = '/login?logout=true'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        user: authState.user,
        login,
        logout,
        isInitialized,
        isAdmin,
        syncCookiesWithLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
