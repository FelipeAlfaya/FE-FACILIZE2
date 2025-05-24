'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StarRating } from '@/components/star-rating'
import { getReviewStats, type ReviewStats } from '@/services/reviews-api'
import { Loader2, Star, TrendingUp, Users, AlertCircle } from 'lucide-react'

interface ReviewStatsProps {
  userId: number
}

export function ReviewStatsComponent({ userId }: ReviewStatsProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const reviewStats = await getReviewStats(userId)
      setStats(reviewStats)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      setError('Não foi possível carregar as estatísticas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <div className='flex items-center gap-2'>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span>Carregando estatísticas...</span>
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

  if (!stats || stats.totalReviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5' />
            Estatísticas de Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <Star className='w-12 h-12 mx-auto text-gray-300 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Nenhuma avaliação ainda
            </h3>
            <p className='text-gray-500'>
              Este usuário ainda não recebeu avaliações.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRatingPercentage = (rating: number) => {
    return (
      (stats.ratingDistribution[
        rating as keyof typeof stats.ratingDistribution
      ] /
        stats.totalReviews) *
      100
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-500'
    if (rating >= 3) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='w-5 h-5' />
          Estatísticas de Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Resumo Geral */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(stats.averageRating)} />
            <p className='text-sm text-gray-500 mt-2'>Nota média</p>
          </div>

          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>
              {stats.totalReviews}
            </div>
            <div className='flex items-center justify-center gap-1'>
              <Users className='w-4 h-4 text-gray-500' />
              <span className='text-sm text-gray-500'>avaliações</span>
            </div>
          </div>
        </div>

        {/* Distribuição de Notas */}
        <div className='space-y-3'>
          <h4 className='font-medium mb-3'>Distribuição de Notas</h4>

          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              stats.ratingDistribution[
                rating as keyof typeof stats.ratingDistribution
              ]
            const percentage = getRatingPercentage(rating)

            return (
              <div key={rating} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 w-12'>
                  <span className='text-sm font-medium'>{rating}</span>
                  <Star className='w-3 h-3 text-yellow-400 fill-yellow-400' />
                </div>

                <div className='flex-1'>
                  <Progress
                    value={percentage}
                    className='h-2'
                    // className={`h-2 ${getRatingColor(rating)}`}
                  />
                </div>

                <div className='text-sm text-gray-500 w-16 text-right'>
                  {count} ({percentage.toFixed(0)}%)
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        <div className='bg-muted p-4 rounded-lg'>
          <h4 className='font-mediu mb-2'>Insights</h4>
          <div className='space-y-1 text-sm text-blue-800'>
            {stats.averageRating >= 4.5 && (
              <p>
                • Excelente reputação! A maioria dos clientes está muito
                satisfeita.
              </p>
            )}
            {stats.averageRating >= 4 && stats.averageRating < 4.5 && (
              <p>• Boa reputação com avaliações consistentemente positivas.</p>
            )}
            {stats.averageRating >= 3 && stats.averageRating < 4 && (
              <p>• Avaliações satisfatórias, mas há espaço para melhorias.</p>
            )}
            {stats.averageRating < 3 && (
              <p>
                • Considere revisar a qualidade do serviço para melhorar as
                avaliações.
              </p>
            )}

            {stats.totalReviews < 5 && (
              <p>
                • Ainda poucas avaliações. Mais feedbacks ajudarão a construir
                credibilidade.
              </p>
            )}

            {stats.ratingDistribution[5] > stats.totalReviews * 0.7 && (
              <p>• Mais de 70% das avaliações são 5 estrelas - parabéns!</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
