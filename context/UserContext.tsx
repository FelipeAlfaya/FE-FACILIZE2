'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

interface Plan {
  id: number
  name: string
  price: number
  description: string
  billingInterval: string
  trialPeriodDays: number
  stripeProductId: string
  stripePriceId: string
  isActive: boolean
  serviceLimit: number
  monthlyAppointmentsLimit: number
  createdAt: string
  deletedAt: string | null
  updatedAt: string
}

interface ProviderData {
  id: number
  cpf: string | null
  cnpj: string | null
  description: string
  userId: number
  planId: number
  provider_rating: number | null
  stripeSubscriptionId: string | null
  subscriptionStatus: 'active' | 'inactive' | null
  lastPaymentDate: string | null
  nextPaymentDate: string | null
  specialty: string
  providerType: 'INDIVIDUAL' | 'TEAM'
  companyName: string | null
  tradeName: string | null
  companyType: string | null
  legalRepresentative: string | null
  legalRepresentativeDocument: string | null
  foundationDate: string | null
  companyPhone: string | null
  companyDescription: string | null
  plan: Plan
}

interface ClientData {
  id: number
  userId: number
  cpf: string
  client_rating: number | null
}

interface UserData {
  id: number
  email: string
  name: string
  avatar: string | null
  phone: string | null
  stripeCustomerId: string | null
  type: 'CLIENT' | 'PROVIDER'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  provider: ProviderData | null
  client: ClientData | null
  isEmailVerified: boolean
  isPhoneVerified: boolean
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
      // Handle both response formats (direct user object or data.user)
      const userData = data.user || data.data || data

      setState({
        user: userData,
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

