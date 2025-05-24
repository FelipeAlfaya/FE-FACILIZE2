'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReviewModal } from './review-modal'
import {
  canReviewAppointment,
  getPendingReviews,
  type PendingReview,
} from '@/services/reviews-api'
import { Star, X, User, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ReviewNotificationProps {
  /** ID específico do agendamento para mostrar notificação direcionada */
  appointmentId?: number
  /** Callback executado quando a notificação é fechada */
  onClose?: () => void
  /** Classes CSS adicionais */
  className?: string
}

/**
 * Componente de notificação para avaliações pendentes
 *
 * Funcionalidades:
 * - Mostra notificação quando há agendamentos concluídos aguardando avaliação
 * - Pode ser usado para um agendamento específico ou buscar automaticamente
 * - Estados de carregamento e erro incluídos
 * - Modal integrado para submissão da avaliação
 * - Auto-refresh após submissão de avaliação
 */

export function ReviewNotification({
  appointmentId,
  onClose,
  className = '',
}: ReviewNotificationProps) {
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('📌 useEffect disparado, appointmentId:', appointmentId)
    if (appointmentId) {
      checkCanReview()
    } else {
      checkPendingReviews()
    }
  }, [appointmentId])

  const checkCanReview = async () => {
    if (!appointmentId) return

    console.log('🔍 Verificando se pode avaliar appointmentId:', appointmentId)
    setIsLoading(true)
    setError(null)

    try {
      const result = await canReviewAppointment(appointmentId)
      console.log('📝 Resultado da verificação canReview:', result)

      // Verificar dados adicionais se não pode avaliar
      if (!result.canReview) {
        console.log('🔍 Investigando por que não pode avaliar...')

        // Verificar o agendamento atual
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')
        const appointmentResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}appointments/${appointmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (appointmentResponse.ok) {
          const appointmentData = await appointmentResponse.json()
          console.log('📋 Dados do agendamento:', {
            id: appointmentData.id,
            status: appointmentData.status,
            completedAt: appointmentData.completedAt,
          })
        }
      }

      if (result.canReview) {
        console.log('✅ Pode avaliar, buscando dados completos...')
        // Buscar dados completos do agendamento pendente
        const response = await getPendingReviews()
        console.log(
          '📋 Avaliações pendentes encontradas:',
          response.data.length
        )

        const targetReview = response.data.find(
          (review: PendingReview) => review.appointment.id === appointmentId
        )
        console.log('🎯 Review específica encontrada:', targetReview)

        if (targetReview) {
          setPendingReview(targetReview)
          setCanReview(true)
          setIsVisible(true)
          console.log('🎉 Notificação de review exibida!')
        } else {
          console.log('❌ Review específica não encontrada na lista')
        }
      } else {
        console.log('❌ Não pode avaliar este agendamento')
      }
    } catch (error) {
      console.error('❌ Erro ao verificar se pode avaliar:', error)
      setError('Erro ao carregar dados da avaliação')
    } finally {
      setIsLoading(false)
    }
  }

  const checkPendingReviews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getPendingReviews()
      if (response.data.length > 0) {
        // Pegar a primeira avaliação pendente
        setPendingReview(response.data[0])
        setCanReview(true)
        setIsVisible(true)
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações pendentes:', error)
      setError('Erro ao carregar avaliações pendentes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleReviewSubmitted = () => {
    setIsVisible(false)
    setPendingReview(null)
    setCanReview(false)
    onClose?.()

    // Verificar se há mais avaliações pendentes após esta
    setTimeout(() => {
      if (!appointmentId) {
        checkPendingReviews()
      }
    }, 1000)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (
    !isVisible ||
    (!canReview && !isLoading) ||
    (!pendingReview && !isLoading && !error)
  ) {
    return null
  }

  // Estado de carregamento
  if (isLoading) {
    return (
      <Card className={`border-blue-200 bg-blue-50 ${className}`}>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-100 p-2 rounded-full'>
              <Star className='w-5 h-5 text-blue-600 animate-spin' />
            </div>
            <p className='text-blue-700'>Verificando avaliações pendentes...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Estado de erro
  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-red-100 p-2 rounded-full'>
                <X className='w-5 h-5 text-red-600' />
              </div>
              <p className='text-red-700'>{error}</p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleDismiss}
              className='text-red-600 hover:text-red-800 hover:bg-red-100 p-1'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!pendingReview) {
    return null
  }

  const isClientReview = pendingReview.reviewType === 'CLIENT_TO_PROVIDER'

  return (
    <>
      <Card className={`border-blue-200 bg-blue-50 ${className}`}>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <div className='bg-blue-100 p-2 rounded-full'>
              <Star className='w-5 h-5 text-blue-600' />
            </div>

            <div className='flex-1 space-y-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <h4 className='font-medium text-blue-900'>
                    Agendamento concluído! 🎉
                  </h4>
                  <p className='text-sm text-blue-700'>
                    Que tal avaliar{' '}
                    {isClientReview ? 'o prestador' : 'o cliente'}?
                  </p>
                </div>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleDismiss}
                  className='text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1'
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>

              <div className='flex items-center gap-3 p-3 bg-white rounded-lg border'>
                <Avatar className='w-10 h-10'>
                  <AvatarImage src={pendingReview.reviewedUser?.avatar || ''} />
                  <AvatarFallback>
                    {pendingReview.reviewedUser?.name
                      ?.slice(0, 2)
                      .toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className='flex-1'>
                  <p className='font-medium text-gray-900'>
                    {pendingReview.reviewedUser?.name || 'Usuário'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {pendingReview.appointment?.service?.name || 'Serviço'}
                  </p>
                  <div className='flex items-center gap-4 text-xs text-gray-500 mt-1'>
                    {pendingReview.appointment?.date && (
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {format(
                          new Date(pendingReview.appointment.date),
                          'dd/MM',
                          { locale: ptBR }
                        )}
                      </div>
                    )}
                    {pendingReview.appointment?.startTime && (
                      <div className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {pendingReview.appointment.startTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={handleOpenModal}
                  className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
                >
                  <User className='w-4 h-4' />
                  Avaliar Agora
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDismiss}
                  className='border-blue-200 text-blue-700 hover:bg-blue-50'
                >
                  Mais Tarde
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pendingReview={pendingReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  )
}

// Hook para usar a notificação facilmente
export function useReviewNotification() {
  const [notification, setNotification] = useState<{
    appointmentId?: number
    show: boolean
  }>({ show: false })

  const showNotification = (appointmentId?: number) => {
    console.log('🔔 showNotification chamado com appointmentId:', appointmentId)
    setNotification({ appointmentId, show: true })
  }

  const hideNotification = () => {
    setNotification({ show: false })
  }

  // Verificar automaticamente avaliações pendentes
  const checkForPendingReviews = () => {
    if (!notification.show) {
      setNotification({ show: true })
    }
  }

  const NotificationComponent = () =>
    notification.show ? (
      <ReviewNotification
        appointmentId={notification.appointmentId}
        onClose={hideNotification}
        className='fixed bottom-4 right-4 z-50 w-96 shadow-lg animate-in slide-in-from-bottom-2 duration-300'
      />
    ) : null

  return {
    showNotification,
    hideNotification,
    checkForPendingReviews,
    NotificationComponent,
    isVisible: notification.show,
  }
}
