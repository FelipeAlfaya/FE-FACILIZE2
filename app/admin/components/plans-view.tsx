'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { CreatePlanDialog } from '../plans/components/create-plan-dialog'
import { EditPlanDialog } from '../plans/components/edit-plan-dialog'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface Plan {
  id: number
  name: string
  price: number
  description: string
  billingInterval: string
  trialPeriodDays?: number
  isActive: boolean
  serviceLimit?: number
  monthlyAppointmentsLimit?: number
  stripeProductId: string
  stripePriceId: string
  features: { id: number; name: string }[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export function PlansView() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const { token } = useAuth()

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch plans')
      }

      const data = await response.json()
      setPlans(data)
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}plans/${planId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete plan')
      }

      await fetchPlans()
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Erro ao excluir plano')
    }
  }

  const handleRestorePlan = async (planId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${planId}/restore`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to restore plan')
      }

      await fetchPlans()
    } catch (error) {
      console.error('Error restoring plan:', error)
      alert('Erro ao restaurar plano')
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg'>Carregando planos...</div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Gerenciar Planos</h1>
          <p className='text-gray-600'>
            Gerencie os planos disponíveis para os provedores
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className='w-4 h-4 mr-2' />
          Novo Plano
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.deletedAt ? 'opacity-50' : ''}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                  {plan.name}
                  {plan.isActive ? (
                    <Badge variant='default'>
                      <CheckCircle className='w-3 h-3 mr-1' />
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant='secondary'>
                      <XCircle className='w-3 h-3 mr-1' />
                      Inativo
                    </Badge>
                  )}
                  {plan.deletedAt && (
                    <Badge variant='destructive'>Excluído</Badge>
                  )}
                </CardTitle>
              </div>
              <div className='text-2xl font-bold text-primary'>
                {formatCurrency(plan.price)}
                <span className='text-sm font-normal text-gray-600'>
                  /{plan.billingInterval === 'month' ? 'mês' : 'ano'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600 mb-4'>{plan.description}</p>

              <div className='space-y-2 mb-4'>
                {plan.trialPeriodDays && (
                  <div className='text-sm'>
                    <strong>Período de teste:</strong> {plan.trialPeriodDays}{' '}
                    dias
                  </div>
                )}
                {plan.serviceLimit && (
                  <div className='text-sm'>
                    <strong>Limite de serviços:</strong> {plan.serviceLimit}
                  </div>
                )}
                {plan.monthlyAppointmentsLimit && (
                  <div className='text-sm'>
                    <strong>Agendamentos/mês:</strong>{' '}
                    {plan.monthlyAppointmentsLimit}
                  </div>
                )}
              </div>

              {plan.features && plan.features.length > 0 && (
                <div className='mb-4'>
                  <div className='text-sm font-medium mb-2'>Recursos:</div>
                  <ul className='text-sm text-gray-600 space-y-1'>
                    {plan.features.map((feature) => (
                      <li key={feature.id} className='flex items-center gap-2'>
                        <CheckCircle className='w-3 h-3 text-green-500' />
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='flex gap-2'>
                {!plan.deletedAt ? (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setEditingPlan(plan)}
                    >
                      <Edit className='w-4 h-4 mr-1' />
                      Editar
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className='w-4 h-4 mr-1' />
                      Excluir
                    </Button>
                  </>
                ) : (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleRestorePlan(plan.id)}
                  >
                    <RotateCcw className='w-4 h-4 mr-1' />
                    Restaurar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-500 mb-4'>Nenhum plano encontrado</div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Criar Primeiro Plano
          </Button>
        </div>
      )}

      <CreatePlanDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchPlans}
      />

      {editingPlan && (
        <EditPlanDialog
          plan={editingPlan}
          open={!!editingPlan}
          onOpenChange={(open: boolean) => !open && setEditingPlan(null)}
          onSuccess={fetchPlans}
        />
      )}
    </div>
  )
}
