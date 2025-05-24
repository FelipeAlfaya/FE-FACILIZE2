'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { InteractiveStarRating } from './interactive-star-rating'
import { createReview, type PendingReview } from '@/services/reviews-api'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  pendingReview: PendingReview | null
  onReviewSubmitted?: () => void
}

export function ReviewModal({
  isOpen,
  onClose,
  pendingReview,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!pendingReview || rating === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma avaliação.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createReview({
        rating,
        comment: comment.trim() || undefined,
        appointmentId: pendingReview.appointment.id,
      })

      toast({
        title: 'Avaliação enviada!',
        description: 'Sua avaliação foi registrada com sucesso.',
      })

      // Reset form
      setRating(0)
      setComment('')
      onClose()
      onReviewSubmitted?.()
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua avaliação. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setComment('')
    onClose()
  }

  if (!pendingReview) return null

  const isClientReview = pendingReview.reviewType === 'CLIENT_TO_PROVIDER'
  const reviewTypeText = isClientReview
    ? 'Avaliar Prestador'
    : 'Avaliar Cliente'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='w-5 h-5' />
            {reviewTypeText}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Informações do Agendamento */}
          <div className='bg-muted p-4 rounded-lg space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-lg'>
                {pendingReview.appointment?.service?.name || 'Serviço'}
              </h3>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Concluído
              </Badge>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
              {pendingReview.appointment?.date && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  {format(
                    new Date(pendingReview.appointment.date),
                    'dd/MM/yyyy',
                    { locale: ptBR }
                  )}
                </div>
              )}
              {pendingReview.appointment?.startTime &&
                pendingReview.appointment?.endTime && (
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    {pendingReview.appointment.startTime} -{' '}
                    {pendingReview.appointment.endTime}
                  </div>
                )}
            </div>

            {pendingReview.appointment?.service?.description && (
              <p className='text-sm text-gray-600'>
                {pendingReview.appointment.service.description}
              </p>
            )}
          </div>

          {/* Informações do Usuário a ser Avaliado */}
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={pendingReview.reviewedUser?.avatar || ''} />
              <AvatarFallback>
                {pendingReview.reviewedUser?.name?.slice(0, 2).toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='font-medium'>
                {pendingReview.reviewedUser?.name || 'Usuário'}
              </p>
              <p className='text-sm text-gray-500'>
                {isClientReview ? 'Prestador do serviço' : 'Cliente'}
              </p>
            </div>
          </div>

          {/* Avaliação */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='rating'>Como foi sua experiência?</Label>
              <div className='flex flex-col items-center gap-2'>
                <InteractiveStarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size='lg'
                />
                <span className='text-sm text-gray-500'>
                  {rating > 0 && (
                    <>
                      {rating === 1 && 'Muito ruim'}
                      {rating === 2 && 'Ruim'}
                      {rating === 3 && 'Regular'}
                      {rating === 4 && 'Bom'}
                      {rating === 5 && 'Excelente'}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='comment'>Comentário (opcional)</Label>
              <Textarea
                id='comment'
                placeholder={`Conte como foi sua experiência com ${
                  pendingReview.reviewedUser?.name || 'o usuário'
                }...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className='text-xs text-gray-500 text-right'>
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className='flex gap-3 pt-4'>
            <Button
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
              className='flex-1'
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className='flex-1'
            >
              {isSubmitting && (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              )}
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
