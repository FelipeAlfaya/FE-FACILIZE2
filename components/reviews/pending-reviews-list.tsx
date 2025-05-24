'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ReviewModal } from './review-modal'
import { getPendingReviews, type PendingReview } from '@/services/reviews-api'
import {
  Loader2,
  Calendar,
  Clock,
  Star,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function PendingReviewsList() {
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const itemsPerPage = 10

  const fetchPendingReviews = async (page: number = currentPage) => {
    try {
      setIsLoading(true)
      const response = await getPendingReviews(page, itemsPerPage)
      setPendingReviews(response.data)
      setTotalPages(response.totalPages)
      setTotalReviews(response.total)
      setCurrentPage(response.currentPage)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar avaliações pendentes:', error)
      setError('Não foi possível carregar as avaliações pendentes.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingReviews()
  }, [])

  const handleOpenReviewModal = (review: PendingReview) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReview(null)
  }

  const handleReviewSubmitted = () => {
    // Atualizar a lista após envio da avaliação
    fetchPendingReviews()
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      fetchPendingReviews(page)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <div className='flex items-center gap-2'>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span>Carregando avaliações pendentes...</span>
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

  if (pendingReviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='w-5 h-5' />
            Avaliações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <Star className='w-12 h-12 mx-auto text-gray-300 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Nenhuma avaliação pendente
            </h3>
            <p className='text-gray-500'>
              Você não possui agendamentos concluídos aguardando avaliação.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='w-5 h-5' />
            Avaliações Pendentes ({totalReviews})
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {pendingReviews.map((review) => {
            const isClientReview = review.reviewType === 'CLIENT_TO_PROVIDER'

            return (
              <div
                key={review.appointment.id}
                className='border rounded-lg p-4 space-y-3 hover:bg-muted transition-colors'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Avatar className='w-10 h-10'>
                        <AvatarImage src={review.reviewedUser?.avatar || ''} />
                        <AvatarFallback>
                          {review.reviewedUser?.name
                            ?.slice(0, 2)
                            .toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>
                          {review.reviewedUser?.name || 'Usuário'}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {isClientReview ? 'Prestador' : 'Cliente'}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium'>
                          {review.appointment?.service?.name || 'Serviço'}
                        </h4>
                      </div>

                      <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                        {review.appointment?.date && (
                          <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4' />
                            {format(
                              new Date(review.appointment.date),
                              'dd/MM/yyyy',
                              { locale: ptBR }
                            )}
                          </div>
                        )}
                        {review.appointment?.startTime &&
                          review.appointment?.endTime && (
                            <div className='flex items-center gap-2'>
                              <Clock className='w-4 h-4' />
                              {review.appointment.startTime} -{' '}
                              {review.appointment.endTime}
                            </div>
                          )}
                      </div>

                      {review.appointment?.service?.description && (
                        <p className='text-sm text-gray-600 line-clamp-2'>
                          {review.appointment.service.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-3 ml-4'>
                    <Badge
                      variant='secondary'
                      className='bg-green-100 text-green-800'
                    >
                      Concluído
                    </Badge>
                    <Button
                      size='sm'
                      onClick={() => handleOpenReviewModal(review)}
                      className='whitespace-nowrap'
                    >
                      <User className='w-4 h-4 mr-2' />
                      {isClientReview ? 'Avaliar Prestador' : 'Avaliar Cliente'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <CardContent className='pt-0'>
            <div className='flex items-center justify-between border-t pt-4'>
              <div className='text-sm text-gray-600'>
                Página {currentPage} de {totalPages} - Total: {totalReviews}{' '}
                avaliações
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className='flex items-center gap-1'
                >
                  <ChevronLeft className='w-4 h-4' />
                  Anterior
                </Button>

                <div className='flex items-center gap-1'>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => handlePageChange(pageNum)}
                        className='w-8 h-8 p-0'
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className='flex items-center gap-1'
                >
                  Próxima
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pendingReview={selectedReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  )
}
