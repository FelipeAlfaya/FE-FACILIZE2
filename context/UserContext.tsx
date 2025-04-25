'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

interface UserData {
  id: number
  email: string
  name: string
  avatar: string | null
  phone: string | null
  type: string
  provider?: {
    id: number
    cpf: string
    cnpj: string | null
    description: string
    planId: number
    specialty: string
  }
  client?: {
    id: number
    cpf: string
  }
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

interface UserContextType {
  user: UserData | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<{
    user: UserData | null
    loading: boolean
    error: string | null
  }>({
    user: null,
    loading: true,
    error: null,
  })

  const handleTokenExpired = () => {
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
    router.push('/login')
  }

  const fetchUserData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!response) {
        throw new Error('Erro ao conectar com o servidor')
      }

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.message === 'jwt expired') {
          handleTokenExpired()
          return
        }
        throw new Error(
          errorData.message || 'Falha ao carregar dados do usuário'
        )
      }

      const data = await response.json()
      setState({
        user: data.data,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState({
        user: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      })
      console.error('Erro ao carregar usuário:', err)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        refreshUser: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}
