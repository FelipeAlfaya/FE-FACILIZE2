'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && (!user || !user.isAdmin)) {
      router.push('/dashboard')
    }
  }, [user, isInitialized, router])

  if (!isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (!user?.isAdmin) {
    return null // Não renderiza nada enquanto o redirecionamento ocorre
  }

  return <>{children}</>
}
