'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScheduleCalendar } from './components/schedule-calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'
import { DashboardHeader } from '../components/dashboard-header'

// Mock user data - in a real app, this would come from authentication
const mockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  type: 'provider', // or 'client'
}

export default function SchedulePage() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<'provider' | 'client'>('provider')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // In a real app, you would get the user type from authentication
    setUserType(mockUser.type as 'provider' | 'client')

    // Check for success parameter in URL
    const success = searchParams.get('success')
    if (success === 'true') {
      setShowSuccess(true)

      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

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
              <div className='text-center py-12 text-gray-500'>
                {/* <p>Funcionalidade em desenvolvimento.</p>
                <p>Em breve você poderá gerenciar sua disponibilidade aqui.</p> */}
              </div>
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

