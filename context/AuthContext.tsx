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

// Função utilitária para obter token
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null

  // Verificar primeiro nos storages
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')

  // Se não encontrar nos storages, verificar nos cookies
  if (!token) {
    return Cookies.get(COOKIE_TOKEN_NAME) || null
  }

  return token
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

  // Se não encontrar nos storages, verificar nos cookies
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

    // Sincronizar token
    const token = getToken()
    if (token) {
      localStorage.setItem('access_token', token)
      Cookies.set(COOKIE_TOKEN_NAME, token, COOKIE_OPTIONS)
    }

    // Sincronizar dados do usuário
    const userData = getUserData()
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
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

      // Armazenar no storage (mantendo compatibilidade)
      storage.setItem('access_token', token)
      storage.setItem('user', JSON.stringify(user))

      // Armazenar também nos cookies
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

  const logout = () => {
    // Limpar todos os storages
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')

    // Limpar rotas em desenvolvimento (apenas para segurança)
    localStorage.removeItem('devRoutes')
    sessionStorage.removeItem('devRoutes')

    // Limpar favoritos (opcional, mas para limpeza completa)
    localStorage.removeItem('favoriteRoutes')
    sessionStorage.removeItem('favoriteRoutes')

    // Limpar todos os cookies relacionados à autenticação
    Cookies.remove('access_token', { path: '/' })
    Cookies.remove('user_data', { path: '/' })
    Cookies.remove('devRoutes', { path: '/' })

    // Detectar e limpar cookies potencialmente relacionados à autenticação
    const allCookies = Cookies.get()
    Object.keys(allCookies).forEach((cookieName) => {
      if (
        cookieName.includes('token') ||
        cookieName.includes('auth') ||
        cookieName.includes('user') ||
        cookieName.includes('session') ||
        cookieName.includes('dev')
      ) {
        Cookies.remove(cookieName, { path: '/' })
      }
    })

    console.log(
      'Logout completo - Todos os dados de autenticação foram removidos'
    )

    // Atualizar o estado
    setAuthState({ token: null, user: null })
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
