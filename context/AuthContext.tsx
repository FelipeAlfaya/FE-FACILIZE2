'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
  isInitialized: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null
    user: User | null
  }>({ token: null, user: null })

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      const user =
        localStorage.getItem('user') || sessionStorage.getItem('user')

      if (token && user) {
        setAuthState({
          token,
          user: JSON.parse(user),
        })
      }
      setIsInitialized(true)
    }
  }, [])

  const login = async (token: string, user: User, remember: boolean) => {
    return new Promise<void>((resolve) => {
      const storage = remember ? localStorage : sessionStorage

      setAuthState({ token, user })

      storage.setItem('access_token', token)
      storage.setItem('user', JSON.stringify(user))

      setTimeout(() => {
        resolve()
      }, 50)
    })
  }

  const logout = () => {
    setAuthState({ token: null, user: null })
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        user: authState.user,
        login,
        logout,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

