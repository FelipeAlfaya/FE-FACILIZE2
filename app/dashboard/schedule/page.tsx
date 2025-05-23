'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScheduleCalendar } from './components/schedule-calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Calendar, CheckCircle, Plus } from 'lucide-react'
import { DashboardHeader } from '../components/dashboard-header'
import { AvailabilityManager } from './components/availability-manager'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AppointmentModal } from './components/appointment-modal'
import { ServicesTab } from './components/services-tab'

export default function SchedulePage() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<'provider' | 'client'>('provider')
  const [showSuccess, setShowSuccess] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const initialProviderId = useRef<string | null>(null)

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
        const newProviderId = userData.data?.provider?.id?.toString() || null

        if (initialProviderId.current !== newProviderId) {
          initialProviderId.current = newProviderId
          setProviderId(newProviderId)
        }

        setUserType(userData.data.type.toLowerCase())

        setProviderId((prev) => (prev !== newProviderId ? newProviderId : prev))
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
        <div className='flex-row'>
          {userType === 'provider' ? (
            <>
              <Tabs defaultValue='calendar'>
                <div className='flex justify-between items-center mb-6'>
                  <TabsList>
                    <TabsTrigger value='calendar'>Calendário</TabsTrigger>
                    <TabsTrigger value='availability'>
                      Disponibilidade
                    </TabsTrigger>
                    <TabsTrigger value='services'>
                      Serviços Prestados
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className='bg-primary hover:bg-primary/90'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    <Calendar className='h-5 w-5' />
                  </Button>
                </div>
                <TabsContent value='calendar'>
                  <ScheduleCalendar />
                </TabsContent>
                <TabsContent value='services'>
                  <ServicesTab />
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
            </>
          ) : (
            <>
              <Tabs defaultValue='calendar'>
                <div className='flex justify-between items-center mb-6'>
                  <TabsList>
                    <TabsTrigger value='calendar'>
                      Meus Agendamentos
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className='bg-primary hover:bg-primary/90'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    <Calendar className='h-10 w-10' />
                  </Button>
                </div>
                <TabsContent value='calendar'>
                  <ScheduleCalendar />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
        <AppointmentModal
          open={isAppointmentModalOpen}
          onOpenChange={setIsAppointmentModalOpen}
        />
      </div>
    </>
  )
}
