'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/app/dashboard/components/dashboard-header'
import { PendingReviewsList } from '@/components/reviews/pending-reviews-list'
import { ReviewsList } from '@/components/reviews/reviews-list'
import { ReviewStatsComponent } from '@/components/reviews/review-stats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, MessageSquare, TrendingUp, Clock, Loader2 } from 'lucide-react'
import {
  getReviewStats,
  getPendingReviews,
  type ReviewStats,
  type PendingReview,
} from '@/services/reviews-api'

interface User {
  id: number
  name: string
  email: string
  type: 'CLIENT' | 'PROVIDER'
}

export default function ReviewsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    // Recuperar dados do usuário do localStorage/sessionStorage
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchStats()
    }
  }, [user?.id])

  const fetchStats = async () => {
    if (!user?.id) return

    try {
      setIsLoadingStats(true)
      const [reviewStats, pendingData] = await Promise.all([
        getReviewStats(user.id),
        getPendingReviews(1, 1), // Só para obter o total
      ])

      setStats(reviewStats)
      setPendingReviewsCount(pendingData.total)
      setStatsError(null)
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error)
      setStatsError('Erro ao carregar dados')
    } finally {
      setIsLoadingStats(false)
    }
  }

  if (!user) {
    return (
      <div className='container mx-auto py-6'>
        <Card>
          <CardContent className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <p className='text-gray-500'>Carregando dados do usuário...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader />
      <div className='container mx-auto py-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Sistema de Avaliações
            </h1>
            <p className='text-gray-500'>
              Gerencie suas avaliações e acompanhe seu desempenho
            </p>
          </div>
        </div>

        <Tabs defaultValue='pending' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='pending' className='flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              Pendentes
            </TabsTrigger>
            <TabsTrigger value='history' className='flex items-center gap-2'>
              <MessageSquare className='w-4 h-4' />
              Histórico
            </TabsTrigger>
            <TabsTrigger value='stats' className='flex items-center gap-2'>
              <TrendingUp className='w-4 h-4' />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value='pending' className='space-y-6'>
            <div className='grid gap-6'>
              <div>
                <h2 className='text-xl font-semibold mb-4'>
                  Agendamentos Aguardando Avaliação
                </h2>
                <PendingReviewsList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='history' className='space-y-6'>
            <div className='grid gap-6'>
              <div>
                <h2 className='text-xl font-semibold mb-4'>
                  Histórico de Avaliações
                </h2>
                <ReviewsList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='stats' className='space-y-6'>
            <div className='grid gap-6'>
              <div>
                <h2 className='text-xl font-semibold mb-4'>
                  Suas Estatísticas de Avaliação
                </h2>
                <ReviewStatsComponent userId={user.id} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Cards de resumo rápido */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total de Avaliações
              </CardTitle>
              <Star className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingStats ? (
                  <Loader2 className='h-6 w-6 animate-spin' />
                ) : statsError ? (
                  <span className='text-red-500'>Erro</span>
                ) : (
                  stats?.totalReviews || 0
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                Avaliações recebidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Nota Média</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingStats ? (
                  <Loader2 className='h-6 w-6 animate-spin' />
                ) : statsError ? (
                  <span className='text-red-500'>Erro</span>
                ) : stats?.averageRating ? (
                  stats.averageRating.toFixed(1)
                ) : (
                  '0.0'
                )}
              </div>
              <p className='text-xs text-muted-foreground'>De 5 estrelas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pendentes</CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingStats ? (
                  <Loader2 className='h-6 w-6 animate-spin' />
                ) : statsError ? (
                  <span className='text-red-500'>Erro</span>
                ) : (
                  pendingReviewsCount
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                Aguardando avaliação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mensagem de status se houver erro */}
        {statsError && (
          <Card className='border-red-200 bg-red-50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-red-600'>
                <Star className='h-4 w-4' />
                <p className='text-sm'>
                  Não foi possível carregar as estatísticas. Verifique se o
                  backend está rodando e tente novamente.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
