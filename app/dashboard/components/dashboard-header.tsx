'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  User,
  LogOut,
  Settings,
  Calendar,
  Home,
  Users,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Image from 'next/image'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Novo agendamento',
    message: 'João Silva agendou uma consultoria para amanhã às 10:00',
    time: '5 minutos atrás',
    read: false,
  },
  {
    id: '2',
    title: 'Agendamento confirmado',
    message: 'Seu agendamento com Maria Oliveira foi confirmado',
    time: '1 hora atrás',
    read: false,
  },
  {
    id: '3',
    title: 'Lembrete',
    message: 'Você tem um agendamento com Carlos Mendes em 30 minutos',
    time: '30 minutos atrás',
    read: true,
  },
  {
    id: '4',
    title: 'Fatura disponível',
    message: 'Sua fatura do mês de Abril está disponível para pagamento',
    time: '2 horas atrás',
    read: true,
  },
]

export function DashboardHeader() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className='border-b'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/dashboard' className='flex items-center'>
          <Image
            src='/images/logo-2.svg'
            alt='Logo Facilize'
            width={50}
            height={50}
            className='w-[150px] h-auto object-cover'
          />
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          <Link
            href='/dashboard'
            className='text-sm font-medium flex items-center'
          >
            <Home className='h-4 w-4 mr-1' />
            Início
          </Link>
          <Link
            href='/dashboard/providers'
            className='text-sm font-medium flex items-center'
          >
            <Users className='h-4 w-4 mr-1' />
            Provedores
          </Link>
          <Link
            href='/dashboard/schedule'
            className='text-sm font-medium flex items-center'
          >
            <Calendar className='h-4 w-4 mr-1' />
            Agenda
          </Link>
          <Link
            href='/dashboard/plans'
            className='text-sm font-medium flex items-center'
          >
            <CreditCard className='h-4 w-4 mr-1' />
            Planos
          </Link>
        </nav>

        <div className='flex items-center space-x-4'>
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-5 w-5' />
                {unreadCount > 0 && (
                  <span className='absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white'>
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80 p-0' align='end'>
              <div className='flex items-center justify-between p-4 border-b'>
                <h3 className='font-medium'>Notificações</h3>
                {unreadCount > 0 && (
                  <Button variant='ghost' size='sm' onClick={markAllAsRead}>
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              <div className='max-h-80 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${
                        notification.read ? '' : 'bg-blue-50'
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <h4 className='font-medium text-sm'>
                          {notification.title}
                        </h4>
                        <span className='text-xs text-gray-500'>
                          {notification.time}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>
                        {notification.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className='p-4 text-center text-gray-500'>
                    Nenhuma notificação
                  </div>
                )}
              </div>
              <div className='p-2 border-t'>
                <Button variant='ghost' size='sm' className='w-full'>
                  Ver todas as notificações
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <img
                  src='/placeholder.svg?height=32&width=32'
                  alt='Avatar'
                  className='rounded-full'
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/profile'
                  className='flex items-center cursor-pointer'
                >
                  <User className='mr-2 h-4 w-4' />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/settings'
                  className='flex items-center cursor-pointer'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
