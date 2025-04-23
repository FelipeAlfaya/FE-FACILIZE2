'use client'
import { X, Mail, Phone, Calendar, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type User = {
  id: string
  name: string
  email: string
  phone: string
  joinDate: Date
  location: string
  lastActive: string
  type: 'client' | 'provider'
  status: 'active' | 'inactive' | 'pending'
  appointments: number
}

type UserDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onEdit?: (user: User) => void
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onEdit,
}: UserDetailsModalProps) {
  if (!user) return null

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return ''
    }
  }

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'inactive':
        return 'Inativo'
      case 'pending':
        return 'Pendente'
      default:
        return ''
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
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
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center'>
              <Avatar className='h-14 w-14'>
                <AvatarImage
                  src={`/placeholder.svg?height=56&width=56`}
                  alt={user.name}
                />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className='ml-4'>
                <h3 className='text-xl font-semibold'>{user.name}</h3>
                <Badge
                  variant='outline'
                  className={getStatusColor(user.status)}
                >
                  {getStatusText(user.status)}
                </Badge>
              </div>
            </div>
            <Badge variant='outline' className='capitalize'>
              {user.type === 'client' ? 'Cliente' : 'Provedor'}
            </Badge>
          </div>

          <div className='space-y-4'>
            <div className='flex items-start'>
              <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                <Mail className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Email</p>
                <p className='font-medium'>{user.email}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                <Phone className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Telefone</p>
                <p className='font-medium'>{user.phone}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                <Calendar className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>
                  Data de Cadastro
                </p>
                <p className='font-medium'>
                  {user.joinDate.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                <MapPin className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Localização</p>
                <p className='font-medium'>{user.location}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <div className='mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                <Clock className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>
                  Última Atividade
                </p>
                <p className='font-medium'>{user.lastActive}</p>
              </div>
            </div>
          </div>

          <div className='mt-6 rounded-md bg-muted p-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Total de Agendamentos</span>
              <span className='font-medium'>{user.appointments}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          {onEdit && (
            <Button variant='outline' onClick={() => onEdit(user)}>
              Editar Usuário
            </Button>
          )}
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
