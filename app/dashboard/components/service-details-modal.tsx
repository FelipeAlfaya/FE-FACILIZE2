'use client'
import { X, Clock, DollarSign, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  availability: string[]
  bookings: number
  rating: number
}

type ServiceDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  service: Service | null
  onEdit?: (service: Service) => void
}

export function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  onEdit,
}: ServiceDetailsModalProps) {
  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detalhes do Serviço</DialogTitle>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>

        <div className='py-4'>
          <div className='mb-6'>
            <h3 className='text-xl font-semibold'>{service.name}</h3>
            <Badge variant='outline' className='mt-1'>
              {service.category}
            </Badge>
          </div>

          <div className='space-y-4'>
            <p className='text-muted-foreground'>{service.description}</p>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                  <Clock className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Duração</p>
                  <p className='font-medium'>{service.duration} min</p>
                </div>
              </div>

              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                  <DollarSign className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Preço</p>
                  <p className='font-medium'>R$ {service.price.toFixed(2)}</p>
                </div>
              </div>

              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                  <Users className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Agendamentos</p>
                  <p className='font-medium'>{service.bookings}</p>
                </div>
              </div>

              <div className='flex items-center'>
                <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                  <Star className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Avaliação</p>
                  <p className='font-medium'>{service.rating.toFixed(1)}/5</p>
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <h4 className='mb-2 text-sm font-medium'>Disponibilidade</h4>
              <div className='flex flex-wrap gap-2'>
                {service.availability.map((day) => (
                  <Badge key={day} variant='secondary'>
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          {onEdit && (
            <Button variant='outline' onClick={() => onEdit(service)}>
              Editar Serviço
            </Button>
          )}
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
