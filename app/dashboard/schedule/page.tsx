'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardHeader } from '../components/dashboard-header'
import { AvailabilityManager } from '../components/availability-manager'
import { AppointmentForm } from '../components/appointment-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'

const mockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  type: 'provider',
}

export default function SchedulePage() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<'provider' | 'client'>('client')
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
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2'>Minha Agenda</h1>
          <p className='text-gray-600'>
            Gerencie seus agendamentos e compromissos
          </p>
        </div>

        {showSuccess && (
          <Alert className='mb-6 bg-green-50 border-green-200'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertTitle>Agendamento realizado com sucesso!</AlertTitle>
            <AlertDescription>
              Seu agendamento foi confirmado. Você receberá um e-mail com os
              detalhes.
            </AlertDescription>
          </Alert>
        )}

        {userType === 'provider' ? (
          <Tabs defaultValue='availability'>
            <TabsList className='mb-6'>
              <TabsTrigger value='availability'>
                Gerenciar Disponibilidade
              </TabsTrigger>
              <TabsTrigger value='appointments'>Meus Agendamentos</TabsTrigger>
            </TabsList>
            <TabsContent value='availability'>
              <AvailabilityManager providerId={mockUser.id} />
            </TabsContent>
            <TabsContent value='appointments'>
              <div className='text-center py-12 text-gray-500'>
                <p>Funcionalidade em desenvolvimento.</p>
                <p>
                  Em breve você poderá visualizar todos os seus agendamentos
                  aqui.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue='new'>
            <TabsList className='mb-6'>
              <TabsTrigger value='new'>Novo Agendamento</TabsTrigger>
              <TabsTrigger value='history'>Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value='new'>
              <AppointmentForm providerId='provider-123' />
            </TabsContent>
            <TabsContent value='history'>
              <div className='text-center py-12 text-gray-500'>
                <p>Funcionalidade em desenvolvimento.</p>
                <p>
                  Em breve você poderá visualizar seu histórico de agendamentos
                  aqui.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
