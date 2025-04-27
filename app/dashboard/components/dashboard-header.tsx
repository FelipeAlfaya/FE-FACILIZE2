'use client'

import { useEffect, useState } from 'react'
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
  Moon,
  Sun,
  FileText,
  DollarSign,
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
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { avatar1, avatar2, avatar3 } from '../common/default-avatars'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { subscribeToNotifications } from '@/services/notifications-api'

type Notification = {
  id: string
  title: string
  message: string
  type: 'APPOINTMENT' | 'SYSTEM' | 'INVOICE' | 'TRANSACTION' | 'TAX' | 'MESSAGE'
  userId: number
  read: boolean
  data?: Record<string, any>
  createdAt: string
  link?: string
  actionable?: boolean
}

const defaultAvatars: string[] = [...avatar1, ...avatar2, ...avatar3]

export function DashboardHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true)
  const [avatarSrc, setAvatarSrc] = useState<string>('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const router = useRouter()

  const formatNotificationTime = (isoString: string) => {
    const now = new Date()
    const notificationDate = new Date(isoString)
    const seconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000
    )

    if (seconds < 60) {
      return 'agora mesmo'
    }

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
      return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
      return `há ${hours} hora${hours !== 1 ? 's' : ''}`
    }

    const days = Math.floor(hours / 24)
    if (days < 7) {
      return `há ${days} dia${days !== 1 ? 's' : ''}`
    }

    const weeks = Math.floor(days / 7)
    if (weeks < 4) {
      return `há ${weeks} semana${weeks !== 1 ? 's' : ''}`
    }

    const months = Math.floor(days / 30)
    if (months < 12) {
      return `há ${months} mês${months !== 1 ? 'es' : ''}`
    }

    const years = Math.floor(days / 365)
    return `há ${years} ano${years !== 1 ? 's' : ''}`
  }

  // Função para carregar notificações
  const fetchNotifications = async () => {
    if (!user?.id) return

    try {
      setIsLoadingNotifications(true)
      console.log('teste')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}notifications?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('access_token') ||
              sessionStorage.getItem('access_token')
            }`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch notifications')

      const data = await response.json()
      const formattedNotifications = data.map((notification: any) => ({
        ...notification,
        time: formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
          locale: ptBR,
        }),
      }))

      setNotifications(formattedNotifications)
      setUnreadCount(data.filter((n: any) => !n.read).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  // Função para marcar todas como lidas
  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      console.log('marcando tudo como lida')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}notifications/mark-all-read?userId=${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              localStorage.getItem('access_token') ||
              sessionStorage.getItem('access_token')
            }`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      )

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  useEffect(() => {
    if (!user?.id) return

    const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
      const formattedNotification = {
        ...newNotification,
        time: formatDistanceToNow(new Date(newNotification.createdAt), {
          addSuffix: true,
          locale: ptBR,
        }),
      }

      setNotifications((prev) => [formattedNotification, ...prev])

      if (!newNotification.read) {
        setUnreadCount((prev) => prev + 1)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user?.id])

  useEffect(() => {
    fetchNotifications()
  }, [notificationsOpen, user?.id])

  useEffect(() => {
    if (user) {
      if (user.avatar) {
        if (user.avatar.startsWith('data:')) {
          setAvatarSrc(user.avatar)
        } else {
          fetchAvatar(user.avatar)
        }
      } else {
        const randomIndex = Math.floor(Math.random() * defaultAvatars.length)
        setAvatarSrc(defaultAvatars[randomIndex])
      }
    }
  }, [user])

  const fetchAvatar = async (avatarUrl: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${avatarUrl.replace(/^\/+/, '')}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarSrc(reader.result as string)
        }
        reader.readAsDataURL(blob)
      } else {
        setRandomDefaultAvatar()
      }
    } catch (error) {
      console.error('Error fetching avatar:', error)
      setRandomDefaultAvatar()
    }
  }

  const setRandomDefaultAvatar = () => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length)
    setAvatarSrc(defaultAvatars[randomIndex])
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    router.push('/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className='border-b'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <Link href='/dashboard' className='flex items-center'>
          <Image
            src={
              theme === 'dark'
                ? '/images/logo-transparente.svg'
                : '/images/logo-2.svg'
            }
            alt='Logo Facilize'
            width={50}
            height={50}
            className='w-[150px] h-auto object-cover'
          />
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          {user?.type === 'PROVIDER' && (
            <>
              <Link
                href='/dashboard'
                className='text-sm font-medium flex items-center'
              >
                <Home className='h-4 w-4 mr-1' />
                Dashboard
              </Link>
              <Link
                href='/dashboard/accounting'
                className='text-sm font-medium flex items-center'
              >
                <DollarSign className='h-4 w-4 mr-1' />
                Contabilidade
              </Link>
            </>
          )}

          <Link
            href='/dashboard/providers'
            className='text-sm font-medium flex items-center'
          >
            <Users className='h-4 w-4 mr-1' />
            Provedores
          </Link>

          <Link
            href='/dashboard/plans'
            className='text-sm font-medium flex items-center'
          >
            <CreditCard className='h-4 w-4 mr-1' />
            Planos
          </Link>

          <Link
            href='/dashboard/schedule'
            className='text-sm font-medium flex items-center'
          >
            <Calendar className='h-4 w-4 mr-1' />
            Agenda
          </Link>

          {user?.provider?.cnpj && (
            <Link
              href='/dashboard/invoices'
              className='text-sm font-medium flex items-center'
            >
              <FileText className='h-4 w-4 mr-1' />
              Notas Fiscais
            </Link>
          )}
        </nav>

        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleTheme}
            className='relative'
          >
            {theme === 'dark' ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>

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
                {isLoadingNotifications ? (
                  <div className='p-4 text-center text-muted-foreground'>
                    Carregando notificações...
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${
                        notification.read
                          ? ''
                          : 'bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <h4 className='font-medium text-sm'>
                          {notification.title}
                        </h4>
                        <span className='text-xs text-muted-foreground'>
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {notification.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className='p-4 text-center text-muted-foreground'>
                    Nenhuma notificação
                  </div>
                )}
              </div>
              <div className='p-2 border-t'>
                <Button variant='ghost' size='sm' className='w-full' asChild>
                  <Link href='/dashboard/notifications'>
                    Ver todas as notificações
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <img
                  src={avatarSrc || '/placeholder.svg?height=32&width=32'}
                  alt='Avatar'
                  className='rounded-full w-8 h-8 object-cover'
                  onError={() => setRandomDefaultAvatar()}
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
              <DropdownMenuItem onClick={handleLogout}>
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
