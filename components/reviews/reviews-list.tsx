'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StarRating } from '@/components/star-rating'
import { getMyReviews, type Review } from '@/services/reviews-api'
import {
  Loader2,
  MessageSquare,
  Calendar,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ReviewsList() {
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const [given, received] = await Promise.all([
        getMyReviews('given'),
        getMyReviews('received'),
      ])
      setGivenReviews(given)
      setReceivedReviews(received)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error)
      setError('Não foi possível carregar as avaliações.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const ReviewCard = ({
    review,
    isGiven,
  }: {
    review: Review
    isGiven: boolean
  }) => {
    const otherUser = isGiven ? review.reviewed : review.reviewer
    const isClientReview = review.type === 'CLIENT_TO_PROVIDER'

    // Verificar se otherUser existe
    if (!otherUser) {
      return (
        <div className='border rounded-lg p-4 text-center text-gray-500'>
          Usuário não encontrado
        </div>
      )
    }

    return (
      <div className='border rounded-lg p-4 space-y-3'>
        <div className='flex items-start gap-3'>
          <Avatar className='w-10 h-10'>
            <AvatarImage src={otherUser.avatar || ''} />
            <AvatarFallback>
              {otherUser.name?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1'>
            <div className='flex items-center justify-between mb-1'>
              <div>
                <p className='font-medium'>{otherUser.name || 'Usuário'}</p>
                <p className='text-sm text-gray-500'>
                  {isGiven
                    ? isClientReview
                      ? 'Prestador avaliado'
                      : 'Cliente avaliado'
                    : isClientReview
                    ? 'Prestador que avaliou'
                    : 'Cliente que avaliou'}
                </p>
              </div>
              <div className='text-right'>
                <StarRating rating={review.rating} />
                <p className='text-xs text-gray-500 mt-1'>
                  {format(new Date(review.createdAt), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              {review.appointment?.service?.name && (
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='font-medium'>Serviço:</span>
                  {review.appointment.service.name}
                </div>
              )}

              {review.appointment?.date && (
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    {format(new Date(review.appointment.date), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </div>
                </div>
              )}

              {review.comment && (
                <div className='p-3 rounded-md'>
                  <div className='flex items-start gap-2'>
                    <MessageSquare className='w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0' />
                    <p className='text-sm text-gray-700'>{review.comment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <div className='flex items-center gap-2'>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span>Carregando avaliações...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <div className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='w-4 h-4' />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' />
          Minhas Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='received' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='received' className='flex items-center gap-2'>
              <ThumbsUp className='w-4 h-4' />
              Recebidas ({receivedReviews.length})
            </TabsTrigger>
            <TabsTrigger value='given' className='flex items-center gap-2'>
              <ThumbsDown className='w-4 h-4' />
              Feitas ({givenReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='received' className='mt-4'>
            {receivedReviews.length === 0 ? (
              <div className='text-center py-8'>
                <ThumbsUp className='w-12 h-12 mx-auto text-gray-300 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Nenhuma avaliação recebida
                </h3>
                <p className='text-gray-500'>
                  Você ainda não recebeu avaliações de outros usuários.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {receivedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} isGiven={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='given' className='mt-4'>
            {givenReviews.length === 0 ? (
              <div className='text-center py-8'>
                <ThumbsDown className='w-12 h-12 mx-auto text-gray-300 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Nenhuma avaliação feita
                </h3>
                <p className='text-gray-500'>
                  Você ainda não fez avaliações para outros usuários.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {givenReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} isGiven={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
