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
  ChevronLeft,
  Menu,
  ChevronRight,
  BarChart3,
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
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { subscribeToNotifications } from '@/services/notifications-api'
import { cn } from '@/lib/utils'

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

const subItems = {
  title: 'Administração',
  icon: BarChart3,
  id: 'admin-page',
  subItems: [
    {
      title: 'Usuários',
      path: '/subtopic1/dashboard',
    },
    {
      title: 'Admin Dashboard',
      path: '/subtopic2/dashboard',
    },
    {
      title: 'Configurações',
      path: '/subtopic3/dashboard',
    },
  ],
}

const defaultAvatars: string[] = [
  'images/Profile-1',
  'images/Profile-2',
  'images/profile-3',
]

export function DashboardHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true)
  const [avatarSrc, setAvatarSrc] = useState<string>('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  )

  const toggleSubMenu = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIsMobile() // Verifica ao carregar

    window.addEventListener('resize', checkIsMobile) // Atualiza ao redimensionar
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

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

  const fetchNotifications = async () => {
    if (!user?.id) return

    try {
      setIsLoadingNotifications(true)
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

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
      setMobileOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      document.body.style.paddingLeft = collapsed ? '80px' : '256px' // 20rem = 80px, 64rem = 256px
    } else {
      document.body.style.paddingLeft = '0'
    }

    return () => {
      document.body.style.paddingLeft = '0'
    }
  }, [collapsed, isMobile])

  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
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
    <>
      {isMobile && mobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 lg:hidden'
          onClick={toggleMobileSidebar}
        />
      )}

      <button
        className='fixed top-4 left-4 z-40 lg:hidden'
        onClick={toggleMobileSidebar}
      >
        <Menu className='h-6 w-6' />
      </button>
      <div className={cn('flex', isMobile ? 'block' : '')}>
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
            collapsed ? 'w-20' : 'w-64',
            isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'
          )}
        >
          <div className='p-4 border-b flex items-center justify-between'>
            <Link href='/dashboard' className='flex-shrink-0'>
              {collapsed ? (
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/logo-avatar-white.svg'
                      : '/images/logo-color.svg'
                  }
                  alt='Logo Facilize'
                  width={20}
                  height={20}
                  className='w-10 h-10 object-cover'
                />
              ) : (
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/logo-transparente.svg'
                      : '/images/logo-2.svg'
                  }
                  alt='Logo Facilize'
                  width={150}
                  height={50}
                  className='w-[150px] h-auto'
                />
              )}
            </Link>
            {!isMobile && (
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleSidebar}
                className='h-8 w-8 ml-auto'
              >
                {collapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </Button>
            )}
          </div>

          {/* Navigation links */}
          <nav className='flex-1 overflow-y-auto py-4 px-3'>
            {user?.type === 'PROVIDER' && (
              <>
                <Link
                  href='/dashboard'
                  className={cn(
                    'flex items-center p-2 rounded-md hover:bg-accent',
                    collapsed ? 'justify-center' : ''
                  )}
                  title={collapsed ? 'Dashboard' : undefined}
                >
                  <Home className='h-5 w-5' />
                  {!collapsed && <span className='ml-3'>Dashboard</span>}
                </Link>
                <Link
                  href='/dashboard/accounting'
                  className={cn(
                    'flex items-center p-2 rounded-md hover:bg-accent',
                    collapsed ? 'justify-center' : ''
                  )}
                  title={collapsed ? 'Contabilidade' : undefined}
                >
                  <DollarSign className='h-5 w-5' />
                  {!collapsed && <span className='ml-3'>Contabilidade</span>}
                </Link>
              </>
            )}

            <Link
              href='/dashboard/providers'
              className={cn(
                'flex items-center p-2 rounded-md hover:bg-accent',
                collapsed ? 'justify-center' : ''
              )}
              title={collapsed ? 'Provedores' : undefined}
            >
              <Users className='h-5 w-5' />
              {!collapsed && <span className='ml-3'>Provedores</span>}
            </Link>

            <Link
              href='/dashboard/plans'
              className={cn(
                'flex items-center p-2 rounded-md hover:bg-accent',
                collapsed ? 'justify-center' : ''
              )}
              title={collapsed ? 'Planos' : undefined}
            >
              <CreditCard className='h-5 w-5' />
              {!collapsed && <span className='ml-3'>Planos</span>}
            </Link>

            <Link
              href='/dashboard/schedule'
              className={cn(
                'flex items-center p-2 rounded-md hover:bg-accent',
                collapsed ? 'justify-center' : ''
              )}
              title={collapsed ? 'Agenda' : undefined}
            >
              <Calendar className='h-5 w-5' />
              {!collapsed && <span className='ml-3'>Agenda</span>}
            </Link>

            <Link
              href='admin'
              className={cn(
                'flex items-center p-2 rounded-md hover:bg-accent',
                collapsed ? 'justify-center' : ''
              )}
              title={collapsed ? 'Administração' : undefined}
            >
              <BarChart3 className='h-5 w-5' />
              {!collapsed && (
                <span className='ml-3 text-yellow'>Administração</span>
              )}
            </Link>

            {user?.provider?.cnpj && (
              <Link
                href='/dashboard/invoices'
                className={cn(
                  'flex items-center p-2 rounded-md hover:bg-accent',
                  collapsed ? 'justify-center' : ''
                )}
                title={collapsed ? 'Notas Fiscais' : undefined}
              >
                <FileText className='h-5 w-5' />
                {!collapsed && <span className='ml-3'>Notas Fiscais</span>}
              </Link>
            )}
          </nav>

          {/* Footer actions */}
          <div className='border-t p-3'>
            {!collapsed ? (
              <div className='flex flex-col space-y-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={toggleTheme}
                  className='justify-start'
                >
                  {theme === 'dark' ? (
                    <Sun className='h-5 w-5' />
                  ) : (
                    <Moon className='h-5 w-5' />
                  )}
                  <span className='ml-2'>Tema</span>
                </Button>

                <Popover
                  open={notificationsOpen}
                  onOpenChange={setNotificationsOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='relative justify-start'
                    >
                      <Bell className='h-5 w-5' />
                      <span className='ml-2'>Notificações</span>
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
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={markAllAsRead}
                        >
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
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full'
                        asChild
                      >
                        <Link href='/dashboard/notifications'>
                          Ver todas as notificações
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='justify-start'>
                      <div className='flex items-center'>
                        <img
                          src={avatarSrc || '/placeholder.svg'}
                          alt='Avatar'
                          className='rounded-full w-5 h-5 mr-2 object-cover'
                          onError={setRandomDefaultAvatar}
                        />
                        <span>Perfil</span>
                      </div>
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
            ) : (
              <div className='flex flex-col items-center space-y-4'>
                <Button variant='ghost' size='icon' onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <Sun className='h-5 w-5' />
                  ) : (
                    <Moon className='h-5 w-5' />
                  )}
                </Button>

                <Popover
                  open={notificationsOpen}
                  onOpenChange={setNotificationsOpen}
                >
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
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={markAllAsRead}
                        >
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
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full'
                        asChild
                      >
                        <Link href='/dashboard/notifications'>
                          Ver todas as notificações
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Link href='/dashboard/profile'>
                  <Button variant='ghost' size='icon'>
                    <User className='h-5 w-5' />
                  </Button>
                </Link>

                <Link href='/dashboard/settings'>
                  <Button variant='ghost' size='icon'>
                    <Settings className='h-5 w-5' />
                  </Button>
                </Link>

                <Button variant='ghost' size='icon' onClick={handleLogout}>
                  <LogOut className='h-5 w-5' />
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

