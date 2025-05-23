'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

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
  features: { id: number; name: string }[]
}

interface EditPlanDialogProps {
  plan: Plan
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditPlanDialog({
  plan,
  open,
  onOpenChange,
  onSuccess,
}: EditPlanDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    billingInterval: 'month',
    trialPeriodDays: '',
    serviceLimit: '',
    monthlyAppointmentsLimit: '',
    isActive: true,
    features: [''] as string[],
  })
  const { token } = useAuth()

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        description: plan.description,
        billingInterval: plan.billingInterval,
        trialPeriodDays: plan.trialPeriodDays?.toString() || '',
        serviceLimit: plan.serviceLimit?.toString() || '',
        monthlyAppointmentsLimit:
          plan.monthlyAppointmentsLimit?.toString() || '',
        isActive: plan.isActive,
        features:
          plan.features.length > 0 ? plan.features.map((f) => f.name) : [''],
      })
    }
  }, [plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        billingInterval: formData.billingInterval,
        trialPeriodDays: formData.trialPeriodDays
          ? parseInt(formData.trialPeriodDays)
          : undefined,
        serviceLimit: formData.serviceLimit
          ? parseInt(formData.serviceLimit)
          : undefined,
        monthlyAppointmentsLimit: formData.monthlyAppointmentsLimit
          ? parseInt(formData.monthlyAppointmentsLimit)
          : undefined,
        isActive: formData.isActive,
        features: formData.features.filter((f) => f.trim() !== ''),
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${plan.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update plan')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Erro ao atualizar plano')
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar Plano: {plan?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='name'>Nome do Plano</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor='price'>Preço (R$)</Label>
              <Input
                id='price'
                type='number'
                step='0.01'
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='billingInterval'>Intervalo de Cobrança</Label>
              <Select
                value={formData.billingInterval}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, billingInterval: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='month'>Mensal</SelectItem>
                  <SelectItem value='year'>Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='trialPeriodDays'>Período de Teste (dias)</Label>
              <Input
                id='trialPeriodDays'
                type='number'
                value={formData.trialPeriodDays}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trialPeriodDays: e.target.value,
                  }))
                }
                placeholder='Opcional'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='serviceLimit'>Limite de Serviços</Label>
              <Input
                id='serviceLimit'
                type='number'
                value={formData.serviceLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceLimit: e.target.value,
                  }))
                }
                placeholder='Ilimitado'
              />
            </div>
            <div>
              <Label htmlFor='monthlyAppointmentsLimit'>Agendamentos/Mês</Label>
              <Input
                id='monthlyAppointmentsLimit'
                type='number'
                value={formData.monthlyAppointmentsLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monthlyAppointmentsLimit: e.target.value,
                  }))
                }
                placeholder='Ilimitado'
              />
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isActive'
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: !!checked }))
              }
            />
            <Label htmlFor='isActive'>Plano ativo</Label>
          </div>

          <div>
            <div className='flex items-center justify-between mb-2'>
              <Label>Recursos do Plano</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addFeature}
              >
                <Plus className='w-4 h-4 mr-1' />
                Adicionar
              </Button>
            </div>
            <div className='space-y-2'>
              {formData.features.map((feature, index) => (
                <div key={index} className='flex gap-2'>
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder='Ex: Suporte 24/7'
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeFeature(index)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar Plano'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
