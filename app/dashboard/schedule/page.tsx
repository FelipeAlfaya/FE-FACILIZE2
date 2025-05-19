'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScheduleCalendar } from './components/schedule-calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'
import { DashboardHeader } from '../components/dashboard-header'
import { AvailabilityManager } from './components/availability-manager'
import { Skeleton } from '@/components/ui/skeleton'

export default function SchedulePage() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<'provider' | 'client'>('provider')
  const [showSuccess, setShowSuccess] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) throw new Error('Failed to fetch user')

        const userData = await response.json()
        console.log('Full userData response:', userData)
        console.log('Provider data:', userData.data?.provider)

        setUserType(userData.data.type.toLowerCase())

        if (userData.data?.provider?.id) {
          const id = userData.data.provider.id.toString()
          console.log('Setting providerId to:', id)
          setProviderId(id)
        } else {
          console.log('No provider ID found in response')
          setProviderId(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setProviderId(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const success = searchParams.get('success')
    if (success === 'true') {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-6'>
        <div className='space-y-4'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
          <Skeleton className='h-[400px] w-full' />
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader />
      <div className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2'>Minha Agenda</h1>
          <p className='text-gray-600'>
            Gerencie seus agendamentos e compromissos
          </p>
        </div>

        {showSuccess && (
          <Alert className='mb-6 bg-emerald-50 border-emerald-200'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            <AlertTitle>Agendamento realizado com sucesso!</AlertTitle>
            <AlertDescription>
              Seu agendamento foi confirmado. Você receberá um e-mail com os
              detalhes.
            </AlertDescription>
          </Alert>
        )}

        {userType === 'provider' ? (
          <Tabs defaultValue='calendar'>
            <TabsList className='mb-6'>
              <TabsTrigger value='calendar'>Calendário</TabsTrigger>
              <TabsTrigger value='availability'>Disponibilidade</TabsTrigger>
            </TabsList>
            <TabsContent value='calendar'>
              <ScheduleCalendar />
            </TabsContent>
            <TabsContent value='availability'>
              {providerId ? (
                <>
                  <AvailabilityManager providerId={providerId} />
                  {console.log('Rendering with providerId:', providerId)}
                </>
              ) : (
                <div className='text-center py-12 text-gray-500'>
                  <p>Nenhum provedor associado a esta conta</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue='calendar'>
            <TabsList className='mb-6'>
              <TabsTrigger value='calendar'>Meus Agendamentos</TabsTrigger>
              <TabsTrigger value='new'>Novo Agendamento</TabsTrigger>
            </TabsList>
            <TabsContent value='calendar'>
              <ScheduleCalendar />
            </TabsContent>
            <TabsContent value='new'>
              <div className='text-center py-12 text-gray-500'>
                <p>Funcionalidade em desenvolvimento.</p>
                <p>Em breve você poderá criar novos agendamentos aqui.</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  )
}

