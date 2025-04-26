'use client'

import { useState, useEffect } from 'react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Bell,
  Check,
  CheckCheck,
  ChevronLeft,
  Eye,
  Filter,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import {
  fetchNotifications,
  markAllAsRead,
  subscribeToNotifications,
} from '@/services/notifications-api'
import Loading from '../loading'

export interface Notification {
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

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'APPOINTMENT':
      return <Bell className='h-5 w-5 text-emerald-500' />
    case 'SYSTEM':
      return <Bell className='h-5 w-5 text-blue-500' />
    case 'INVOICE':
    case 'TRANSACTION':
    case 'PAYMENT':
      return <Bell className='h-5 w-5 text-purple-500' />
    case 'MESSAGE':
      return <Bell className='h-5 w-5 text-amber-500' />
    case 'TAX':
      return <Bell className='h-5 w-5 text-red-500' />
    default:
      return <Bell className='h-5 w-5' />
  }
}

const getNotificationBadge = (type: string) => {
  switch (type) {
    case 'APPOINTMENT':
      return (
        <Badge
          variant='outline'
          className='border-blue-200 text-blue-700 bg-blue-50'
        >
          Agendamento
        </Badge>
      )
    case 'SYSTEM':
      return (
        <Badge
          variant='outline'
          className='border-gray-200 text-gray-700 bg-gray-50'
        >
          Sistema
        </Badge>
      )
    case 'INVOICE':
      return (
        <Badge
          variant='outline'
          className='border-purple-200 text-purple-700 bg-purple-50'
        >
          Fatura
        </Badge>
      )
    case 'TRANSACTION':
      return (
        <Badge
          variant='outline'
          className='border-green-200 text-green-700 bg-green-50'
        >
          Transação
        </Badge>
      )
    case 'MESSAGE':
      return (
        <Badge
          variant='outline'
          className='border-amber-200 text-amber-700 bg-amber-50'
        >
          Mensagem
        </Badge>
      )
    case 'TAX':
      return (
        <Badge
          variant='outline'
          className='border-red-200 text-red-700 bg-red-50'
        >
          Imposto
        </Badge>
      )
    default:
      return <Badge variant='outline'>Notificação</Badge>
  }
}

const formatNotificationDate = (dateString: string) => {
  const date = parseISO(dateString)

  if (isToday(date)) {
    return `Hoje, ${format(date, 'HH:mm', { locale: ptBR })}`
  } else if (isYesterday(date)) {
    return `Ontem, ${format(date, 'HH:mm', { locale: ptBR })}`
  } else {
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
  }
}

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {}

  notifications.forEach((notification) => {
    const date = parseISO(notification.createdAt) // Alterado para usar createdAt
    let groupKey: string

    if (isToday(date)) {
      groupKey = 'Hoje'
    } else if (isYesterday(date)) {
      groupKey = 'Ontem'
    } else {
      groupKey = format(date, "dd 'de' MMMM", { locale: ptBR })
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }

    groups[groupKey].push(notification)
  })

  return Object.entries(groups).map(([date, notifications]) => ({
    date,
    notifications,
  }))
}

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  )
  const [selectMode, setSelectMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const { user, loading: userLoading } = useUser()

  const router = useRouter()

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) return

      try {
        const apiNotifications = await fetchNotifications(user.id)
        setNotifications(apiNotifications)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }

    loadNotifications()

    if (user?.id) {
      const unsubscribe = subscribeToNotifications(
        user.id,
        (newNotification) => {
          console.log('Nova notificação recebida:', newNotification)
          setNotifications((prev) => [newNotification, ...prev])
        }
      )

      return () => {
        unsubscribe()
        console.log('Socket desconectado')
      }
    }
  }, [user?.id])

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.read
    if (activeTab === 'read') return notification.read
    return true
  })

  const groupedNotifications = groupNotificationsByDate(filteredNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const handleMarkAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: false } : notification
      )
    )
  }

  const handleDeleteNotification = (id: string) => {
    setNotificationToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (notificationToDelete) {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationToDelete)
      )
    }
    setDeleteDialogOpen(false)
    setNotificationToDelete(null)
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return
    try {
      await markAllAsRead(user.id) // Passe o user.id
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications((prev) =>
        prev.filter((notifId) => notifId !== id)
      )
    } else {
      setSelectedNotifications((prev) => [...prev, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  const handleDeleteSelected = () => {
    setNotifications((prev) =>
      prev.filter(
        (notification) => !selectedNotifications.includes(notification.id)
      )
    )
    setSelectedNotifications([])
    setSelectMode(false)
  }

  const handleMarkSelectedAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        selectedNotifications.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      )
    )
    setSelectedNotifications([])
    setSelectMode(false)
  }

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setDetailsDialogOpen(true)

    // Mark as read when viewed
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
  }

  const handleNavigateToLink = (link?: string) => {
    if (link) {
      router.push(link)
    }
    setDetailsDialogOpen(false)
  }

  if (userLoading) {
    return <Loading />
  }

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p>Você precisa estar logado para ver as notificações</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center mb-6'>
        <Button
          variant='ghost'
          size='sm'
          className='mr-2'
          onClick={() => router.back()}
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          Voltar
        </Button>
        <h1 className='text-2xl font-bold'>Notificações</h1>
        {unreadCount > 0 && (
          <Badge variant='secondary' className='ml-2'>
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
          </Badge>
        )}
      </div>

      <Tabs
        defaultValue='all'
        value={activeTab}
        onValueChange={setActiveTab}
        className='mb-6'
      >
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4'>
          <TabsList>
            <TabsTrigger value='all'>Todas</TabsTrigger>
            <TabsTrigger value='unread'>Não lidas</TabsTrigger>
            <TabsTrigger value='read'>Lidas</TabsTrigger>
          </TabsList>

          <div className='flex gap-2'>
            {selectMode ? (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectMode(false)}
                >
                  Cancelar
                </Button>
                <Button variant='outline' size='sm' onClick={handleSelectAll}>
                  {selectedNotifications.length === filteredNotifications.length
                    ? 'Desmarcar todos'
                    : 'Selecionar todos'}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleMarkSelectedAsRead}
                  disabled={selectedNotifications.length === 0}
                >
                  <Check className='h-4 w-4 mr-1' />
                  Marcar como lidas
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={handleDeleteSelected}
                  disabled={selectedNotifications.length === 0}
                >
                  <Trash2 className='h-4 w-4 mr-1' />
                  Excluir
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectMode(true)}
                >
                  Selecionar
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCheck className='h-4 w-4 mr-1' />
                    Marcar todas como lidas
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <Filter className='h-4 w-4 mr-1' />
                      Filtrar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => setActiveTab('all')}>
                      Todas as notificações
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab('appointment')}
                    >
                      Agendamentos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('payment')}>
                      Pagamentos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('system')}>
                      Sistema
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('message')}>
                      Mensagens
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        <TabsContent value='all' className='mt-0'>
          {renderNotificationGroups()}
        </TabsContent>
        <TabsContent value='unread' className='mt-0'>
          {renderNotificationGroups()}
        </TabsContent>
        <TabsContent value='read' className='mt-0'>
          {renderNotificationGroups()}
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir notificação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta notificação? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription className='flex items-center justify-between'>
              <span>
                {selectedNotification &&
                  formatNotificationDate(selectedNotification.createdAt)}
              </span>
              {selectedNotification &&
                getNotificationBadge(selectedNotification.type)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='max-h-[300px]'>
            <div className='p-4'>
              <p className='text-sm'>{selectedNotification?.message}</p>
              {selectedNotification?.actionable && (
                <div className='mt-4 p-3 bg-muted rounded-md'>
                  <p className='text-sm font-medium'>
                    Esta notificação requer sua atenção
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className='flex flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              onClick={() => setDetailsDialogOpen(false)}
              className='sm:order-1'
            >
              Fechar
            </Button>
            {selectedNotification?.link && (
              <Button
                onClick={() => handleNavigateToLink(selectedNotification?.link)}
                className='sm:order-2'
              >
                Ver detalhes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderNotificationGroups() {
    if (filteredNotifications.length === 0) {
      return (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Bell className='h-12 w-12 text-muted-foreground mb-4' />
            <CardTitle className='text-xl mb-2'>Nenhuma notificação</CardTitle>
            <CardDescription>
              {activeTab === 'all'
                ? 'Você não tem notificações no momento.'
                : activeTab === 'unread'
                ? 'Você não tem notificações não lidas.'
                : 'Você não tem notificações lidas.'}
            </CardDescription>
          </CardContent>
        </Card>
      )
    }

    return groupedNotifications.map((group) => (
      <div key={group.date} className='mb-6'>
        <h2 className='text-sm font-medium text-muted-foreground mb-2'>
          {group.date}
        </h2>
        <div className='space-y-3'>
          {group.notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read
                  ? 'bg-blue-100 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  : ''
              }`}
            >
              <CardContent className='p-4'>
                <div className='flex items-start'>
                  {selectMode && (
                    <div className='mr-3 pt-1'>
                      <Checkbox
                        checked={selectedNotifications.includes(
                          notification.id
                        )}
                        onCheckedChange={() =>
                          handleSelectNotification(notification.id)
                        }
                      />
                    </div>
                  )}
                  <div className='mr-3 pt-1'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-1'>
                      <div className='flex items-center'>
                        <h3 className='font-medium text-sm'>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className='ml-2 h-2 w-2 rounded-full bg-blue-500/70'></span>
                        )}
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {formatNotificationDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>
                      {notification.message}
                    </p>
                    <div className='flex items-center justify-between mt-2'>
                      <div className='flex items-center gap-2'>
                        {getNotificationBadge(notification.type)}
                        {notification.actionable && (
                          <Badge
                            variant='outline'
                            className='border-red-200 text-red-700 bg-red-50'
                          >
                            Ação necessária
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleViewDetails(notification)}
                        >
                          <Eye className='h-4 w-4 mr-1' />
                          Detalhes
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            {notification.read ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleMarkAsUnread(notification.id)
                                }
                              >
                                Marcar como não lida
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                Marcar como lida
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))
  }
}
