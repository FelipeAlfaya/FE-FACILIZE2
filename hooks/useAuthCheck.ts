'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const useAuthCheck = (requiredRole?: 'CLIENT' | 'PROVIDER') => {
  const { token, user, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) return

    if (!token) {
      router.push('/login')
    } else if (requiredRole && user?.type !== requiredRole) {
      router.push('/dashboard/unauthorized')
    }
  }, [token, user, isInitialized, requiredRole, router])
}
