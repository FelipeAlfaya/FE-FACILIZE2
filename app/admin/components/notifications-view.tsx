'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Bell,
  CheckCircle,
  Clock,
  MessageSquare,
  MoreHorizontal,
  RefreshCcw,
  Trash2,
  CreditCard,
  FileText,
  Send,
  AlertCircle,
  PlusCircle,
  Users as UsersIcon,
  User as UserIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

// Tipos de notificação
type NotificationType =
  | 'APPOINTMENT'
  | 'SYSTEM'
  | 'INVOICE'
  | 'TRANSACTION'
  | 'TAX'
  | 'MESSAGE'

type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  userId: number
  read: boolean
  createdAt: string
  data?: Record<string, any>
  link?: string
}

// Interface para o formulário de criação de notificação
interface NotificationFormData {
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  recipientType: 'all' | 'specific'
  userId?: number
  sendEmail: boolean
}

export function NotificationsView() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<
    NotificationType | 'ALL'
  >('ALL')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estado para o formulário de nova notificação
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    type: 'SYSTEM',
    priority: 'MEDIUM',
    recipientType: 'specific',
    userId: undefined,
    sendEmail: true,
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Garantir que data seja um array
        if (Array.isArray(data)) {
          setUsers(data)
        } else if (
          data &&
          typeof data === 'object' &&
          data.data &&
          Array.isArray(data.data)
        ) {
          // Caso a API retorne { data: [...] }
          setUsers(data.data)
        } else {
          console.error('Formato de dados de usuários inválido:', data)
          setUsers([]) // Define como array vazio para evitar erros
        }
      } else {
        console.error('Erro ao buscar usuários')
        setUsers([])
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setUsers([])
    }
  }

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3000/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      } else {
        toast.error('Erro ao carregar notificações')
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
      toast.error('Falha na conexão com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilteredNotifications = async (type: NotificationType) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3000/notifications/filter?type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        toast.success(`Notificações filtradas por tipo: ${type}`)
      } else {
        toast.error('Erro ao carregar notificações filtradas')
      }
    } catch (error) {
      console.error('Erro ao buscar notificações filtradas:', error)
      toast.error('Falha na conexão com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (filter: NotificationType | 'ALL') => {
    setSelectedTypeFilter(filter)
    if (filter === 'ALL') {
      fetchNotifications()
      toast.success('Mostrando todas as notificações')
    } else {
      fetchFilteredNotifications(filter)
    }
  }

  useEffect(() => {
    if (token) {
      fetchNotifications()
      fetchUsers() // Buscar usuários para o select de destinatários específicos
    }
  }, [token])

  const handleRefresh = () => {
    if (selectedTypeFilter === 'ALL') {
      fetchNotifications()
    } else {
      fetchFilteredNotifications(selectedTypeFilter)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/notifications/${id}/mark-read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        )
        toast.success('Notificação marcada como lida')
      }
    } catch (error) {
      toast.error('Erro ao atualizar notificação')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/notifications/mark-all-read',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        setNotifications(
          notifications.map((notif) => ({ ...notif, read: true }))
        )
        toast.success('Todas as notificações marcadas como lidas')
      }
    } catch (error) {
      toast.error('Erro ao atualizar notificações')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/notifications/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        setNotifications(notifications.filter((notif) => notif.id !== id))
        toast.success('Notificação excluída')
      }
    } catch (error) {
      toast.error('Erro ao excluir notificação')
    }
  }

  // Gerenciador de mudança no formulário
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Gerenciador para campos de select usando componente Select do shadcn/ui
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Enviar notificação para um usuário específico
  const createNotificationForUser = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:3000/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          priority: formData.priority,
        }),
      })

      if (response.ok) {
        toast.success(`Notificação enviada para o usuário ID: ${userId}`)
        return true
      } else {
        const error = await response.json()
        toast.error(
          `Erro ao enviar notificação: ${error.message || 'Erro desconhecido'}`
        )
        return false
      }
    } catch (error) {
      toast.error('Falha ao enviar notificação')
      return false
    }
  }

  // Enviar notificações para todos os usuários usando o endpoint bulk
  // Este endpoint é otimizado e faz toda a criação de notificações de uma vez no backend
  const createNotificationForAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/notifications/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          type: formData.type,
          priority: formData.priority,
          sendEmail: formData.sendEmail,
        }),
      })

      if (response.ok) {
        const result = await response.json()

        if (result.success) {
          toast.success(
            `Notificações enviadas com sucesso para ${result.sent} de ${
              result.total
            } usuários${result.emailsSent ? ' (emails incluídos)' : ''}`
          )
          return true
        } else {
          toast.error(
            `Erro ao enviar notificações: ${
              result.message || 'Erro desconhecido'
            }`
          )
          return false
        }
      } else {
        const error = await response.json()
        toast.error(
          `Erro ao enviar notificações: ${error.message || 'Erro no servidor'}`
        )
        return false
      }
    } catch (error) {
      console.error('Erro ao enviar notificações em massa:', error)
      toast.error('Falha na conexão com o servidor')
      return false
    }
  }

  // Gerenciador de submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success = false

    if (formData.recipientType === 'specific' && formData.userId) {
      success = await createNotificationForUser(formData.userId)
    } else if (formData.recipientType === 'all') {
      success = await createNotificationForAllUsers()
    } else {
      toast.error('Selecione um destinatário válido')
      return
    }

    if (success) {
      // Resetar o formulário e fechar o diálogo
      setFormData({
        title: '',
        message: '',
        type: 'SYSTEM',
        priority: 'MEDIUM',
        recipientType: 'specific',
        userId: undefined,
        sendEmail: true,
      })
      setIsDialogOpen(false)

      // Atualizar a lista de notificações
      setTimeout(() => {
        fetchNotifications()
      }, 1000)
    }
  }

  // Filtra as notificações baseado na tab selecionada
  const filteredNotifications =
    selectedTab === 'unread'
      ? notifications.filter((notif) => !notif.read)
      : notifications

  // Retorna um ícone baseado no tipo de notificação
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'APPOINTMENT':
        return <Clock className='h-4 w-4' />
      case 'MESSAGE':
        return <MessageSquare className='h-4 w-4' />
      case 'INVOICE':
        return <FileText className='h-4 w-4' />
      case 'TRANSACTION':
        return <CreditCard className='h-4 w-4' />
      case 'TAX':
        return <AlertCircle className='h-4 w-4' />
      case 'SYSTEM':
      default:
        return <Bell className='h-4 w-4' />
    }
  }

  // Retorna uma cor para o badge de prioridade
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-500'
      case 'MEDIUM':
        return 'bg-blue-500'
      case 'HIGH':
        return 'bg-amber-500'
      case 'URGENT':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>Notificações do Sistema</h2>
        <div className='flex gap-2'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='default'>
                <PlusCircle className='h-4 w-4 mr-2' />
                Nova Notificação
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Criar Nova Notificação</DialogTitle>
                <DialogDescription>
                  Envie uma notificação para um usuário específico ou para todos
                  os usuários.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className='space-y-4 pt-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Título</Label>
                  <Input
                    id='title'
                    name='title'
                    placeholder='Digite o título da notificação'
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>Mensagem</Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Digite o conteúdo da notificação'
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='type'>Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange('type', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o tipo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='SYSTEM'>Sistema</SelectItem>
                        <SelectItem value='MESSAGE'>Mensagem</SelectItem>
                        <SelectItem value='APPOINTMENT'>Agendamento</SelectItem>
                        <SelectItem value='INVOICE'>Fatura</SelectItem>
                        <SelectItem value='TRANSACTION'>Transação</SelectItem>
                        <SelectItem value='TAX'>Imposto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='priority'>Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        handleSelectChange(
                          'priority',
                          value as NotificationPriority
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a prioridade' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='LOW'>Baixa</SelectItem>
                        <SelectItem value='MEDIUM'>Média</SelectItem>
                        <SelectItem value='HIGH'>Alta</SelectItem>
                        <SelectItem value='URGENT'>Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Destinatário</Label>
                  <div className='flex gap-4 items-center'>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        id='specific'
                        name='recipientType'
                        value='specific'
                        checked={formData.recipientType === 'specific'}
                        onChange={handleFormChange}
                        className='form-radio'
                      />
                      <Label
                        htmlFor='specific'
                        className='cursor-pointer flex items-center'
                      >
                        <UserIcon className='h-4 w-4 mr-1' />
                        Usuário específico
                      </Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        id='all'
                        name='recipientType'
                        value='all'
                        checked={formData.recipientType === 'all'}
                        onChange={handleFormChange}
                        className='form-radio'
                      />
                      <Label
                        htmlFor='all'
                        className='cursor-pointer flex items-center'
                      >
                        <UsersIcon className='h-4 w-4 mr-1' />
                        Todos os usuários
                      </Label>
                    </div>
                  </div>
                </div>

                {formData.recipientType === 'specific' && (
                  <div className='space-y-2'>
                    <Label htmlFor='userId'>Selecione o Usuário</Label>
                    <Select
                      value={formData.userId?.toString() || ''}
                      onValueChange={(value) =>
                        handleSelectChange('userId', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um usuário' />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='sendEmail'
                      name='sendEmail'
                      checked={formData.sendEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sendEmail: e.target.checked,
                        })
                      }
                      className='form-checkbox'
                    />
                    <Label
                      htmlFor='sendEmail'
                      className='cursor-pointer text-sm'
                    >
                      Enviar notificação por email também
                    </Label>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {formData.recipientType === 'all'
                      ? 'Emails serão enviados para todos os usuários que têm notificações por email habilitadas'
                      : 'Email será enviado para o usuário selecionado se ele tiver notificações por email habilitadas'}
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit'>
                    <Send className='h-4 w-4 mr-2' />
                    Enviar Notificação
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant='outline'
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className='h-4 w-4 mr-2' />
            Atualizar
          </Button>
          <Button
            variant='default'
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some((n) => !n.read)}
          >
            <CheckCircle className='h-4 w-4 mr-2' />
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      <div className='flex gap-2 mb-4'>
        <Button
          variant={selectedTab === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('all')}
        >
          Todas ({notifications.length})
        </Button>
        <Button
          variant={selectedTab === 'unread' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('unread')}
        >
          Não lidas ({notifications.filter((n) => !n.read).length})
        </Button>
      </div>

      {/* Filtros por Tipo */}
      <div className='flex gap-2 mb-4 p-4 bg-muted/30 rounded-lg'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-sm font-medium'>Filtrar por tipo:</span>
          <Button
            variant={selectedTypeFilter === 'ALL' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleFilterChange('ALL')}
          >
            Todas
          </Button>
          <Button
            variant={selectedTypeFilter === 'SYSTEM' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleFilterChange('SYSTEM')}
          >
            Sistema
          </Button>
          <Button
            variant={selectedTypeFilter === 'MESSAGE' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleFilterChange('MESSAGE')}
          >
            Mensagens
          </Button>
          <Button
            variant={
              selectedTypeFilter === 'APPOINTMENT' ? 'default' : 'outline'
            }
            size='sm'
            onClick={() => handleFilterChange('APPOINTMENT')}
          >
            Agendamentos
          </Button>
          <Button
            variant={selectedTypeFilter === 'INVOICE' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleFilterChange('INVOICE')}
          >
            Faturas
          </Button>
          <Button
            variant={
              selectedTypeFilter === 'TRANSACTION' ? 'default' : 'outline'
            }
            size='sm'
            onClick={() => handleFilterChange('TRANSACTION')}
          >
            Transações
          </Button>
          <Button
            variant={selectedTypeFilter === 'TAX' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleFilterChange('TAX')}
          >
            Impostos
          </Button>

          {selectedTypeFilter !== 'ALL' && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleFilterChange('ALL')}
              className='ml-4 text-red-600 hover:text-red-700'
            >
              ✕ Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Notificações
            {selectedTypeFilter !== 'ALL' && (
              <span className='text-sm font-normal text-muted-foreground ml-2'>
                (Filtradas por: {selectedTypeFilter})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center p-4'>
              Carregando notificações...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              Nenhuma notificação encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    className={notification.read ? '' : 'bg-muted/30'}
                  >
                    <TableCell>
                      {notification.read ? (
                        <span className='text-green-500'>•</span>
                      ) : (
                        <span className='text-blue-500 font-bold'>•</span>
                      )}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {notification.title}
                      <p className='text-sm text-muted-foreground truncate max-w-[300px]'>
                        {notification.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        {getNotificationIcon(notification.type)}
                        <span>{notification.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPriorityColor(notification.priority)}
                      >
                        {notification.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(notification.createdAt),
                        'dd/MM/yyyy HH:mm',
                        { locale: ptBR }
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Abrir menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          {!notification.read && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className='mr-2 h-4 w-4' />
                              <span>Marcar como lida</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
