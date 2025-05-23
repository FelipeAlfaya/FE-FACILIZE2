'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Eye,
  User,
  Calendar,
  Shield,
  CreditCard,
  UserCheck,
  Edit,
  Save,
  X,
} from 'lucide-react'

interface UserClient {
  id?: number | null
  userId?: number | null
  cpf?: string | null
  client_rating?: number | null
}

interface UserProvider {
  id?: number | null
  userId?: number | null
  // Adicione outros campos se necessário, todos opcionais/null
}

interface UserType {
  id?: number | null
  email?: string | null
  name?: string | null
  avatar?: string | null
  phone?: string | null
  stripeCustomerId?: string | null
  isAdmin?: boolean | null
  isEmailVerified?: boolean | null
  isPhoneVerified?: boolean | null
  type?: 'CLIENT' | 'PROVIDER' | null
  createdAt?: string | null
  updatedAt?: string | null
  client?: UserClient | null
  provider?: UserProvider | null
}

interface UserDetailsModalProps {
  user: UserType
  trigger?: React.ReactNode
  onSave?: (user: UserType) => void
}

export function UserDetailsModal({
  user: initialUser,
  trigger,
  onSave,
}: UserDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<UserType>(initialUser)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(user)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setUser(initialUser)
    setIsEditing(false)
  }

  const updateUser = (field: string, value: any) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateClientField = (field: string, value: any) => {
    if (!user.client) return

    setUser((prev) => ({
      ...prev,
      client: {
        ...prev.client!,
        [field]: value,
      },
    }))
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button variant='ghost' size='icon' onClick={() => setOpen(true)}>
          <Eye className='h-4 w-4' />
          <span className='sr-only'>Ver detalhes</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='flex flex-row items-center justify-between'>
            <div>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                Informações completas do usuário ID: {user.id}
              </DialogDescription>
            </div>
            <Button
              variant={isEditing ? 'destructive' : 'outline'}
              size='icon'
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            >
              {isEditing ? (
                <X className='h-4 w-4' />
              ) : (
                <Edit className='h-4 w-4' />
              )}
            </Button>
          </DialogHeader>

          <div className='flex flex-col md:flex-row gap-6 items-start md:items-center py-4 border-b'>
            <Avatar className='h-20 w-20'>
              <AvatarImage
                src={user.avatar || '/placeholder.svg?height=80&width=80'}
                alt={user.name || ''}
              />
              <AvatarFallback>{getInitials(user.name || '')}</AvatarFallback>
            </Avatar>
            <div className='space-y-1.5 flex-1'>
              {isEditing ? (
                <Input
                  value={user.name || ''}
                  onChange={(e) => updateUser('name', e.target.value)}
                  className='text-xl font-semibold'
                />
              ) : (
                <h3 className='text-2xl font-semibold'>{user.name || ''}</h3>
              )}
              <div className='flex items-center gap-2 flex-wrap'>
                {isEditing ? (
                  <Input
                    value={user.email || ''}
                    onChange={(e) => updateUser('email', e.target.value)}
                    className='w-full md:w-auto'
                  />
                ) : (
                  <p className='text-muted-foreground'>{user.email || ''}</p>
                )}
                <Badge
                  variant={
                    user.isEmailVerified === true ? 'default' : 'outline'
                  }
                  className={
                    user.isEmailVerified === true ? 'bg-green-500' : ''
                  }
                >
                  {user.isEmailVerified === true
                    ? 'Email Verificado'
                    : 'Email Não Verificado'}
                </Badge>
                <Badge
                  variant={user.type === 'CLIENT' ? 'default' : 'secondary'}
                >
                  {user.type === 'CLIENT'
                    ? 'Cliente'
                    : user.type === 'PROVIDER'
                    ? 'Fornecedor'
                    : 'Administrador'}
                </Badge>
                {user.isAdmin === true && (
                  <Badge variant='destructive'>Administrador</Badge>
                )}
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid grid-cols-3 mb-4'>
              <TabsTrigger value='personal'>Informações Pessoais</TabsTrigger>
              <TabsTrigger value='account'>Conta</TabsTrigger>
              <TabsTrigger value='details'>Detalhes Específicos</TabsTrigger>
            </TabsList>

            <TabsContent value='personal' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Nome</Label>
                      {isEditing ? (
                        <Input
                          id='name'
                          value={user.name || ''}
                          onChange={(e) => updateUser('name', e.target.value)}
                        />
                      ) : (
                        <p className='font-medium'>{user.name || ''}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      {isEditing ? (
                        <Input
                          id='email'
                          value={user.email || ''}
                          onChange={(e) => updateUser('email', e.target.value)}
                        />
                      ) : (
                        <p className='font-medium'>{user.email || ''}</p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Telefone</Label>
                      {isEditing && user.phone ? (
                        <Input
                          id='phone'
                          value={user.phone || ''}
                          onChange={(e) => updateUser('phone', e.target.value)}
                        />
                      ) : (
                        <p className='font-medium'>
                          {user.phone || 'Não informado'}
                        </p>
                      )}
                    </div>
                    {user.client && (
                      <div className='space-y-2'>
                        <Label htmlFor='cpf'>CPF</Label>
                        {isEditing ? (
                          <Input
                            id='cpf'
                            value={user.client.cpf || ''}
                            onChange={(e) =>
                              updateClientField('cpf', e.target.value)
                            }
                          />
                        ) : (
                          <p className='font-medium'>{user.client.cpf || ''}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <UserCheck className='h-5 w-5' />
                    Status de Verificação
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='emailVerified'>Email Verificado</Label>
                      {isEditing ? (
                        <div className='flex items-center space-x-2'>
                          <Switch
                            id='emailVerified'
                            checked={user.isEmailVerified === true}
                            onCheckedChange={(checked) =>
                              updateUser('isEmailVerified', checked)
                            }
                          />
                          <span>
                            {user.isEmailVerified === true ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      ) : (
                        <Badge
                          variant={
                            user.isEmailVerified === true
                              ? 'default'
                              : 'outline'
                          }
                          className={
                            user.isEmailVerified === true ? 'bg-green-500' : ''
                          }
                        >
                          {user.isEmailVerified === true ? 'Sim' : 'Não'}
                        </Badge>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='phoneVerified'>Telefone Verificado</Label>
                      {isEditing ? (
                        <div className='flex items-center space-x-2'>
                          <Switch
                            id='phoneVerified'
                            checked={user.isPhoneVerified === true}
                            onCheckedChange={(checked) =>
                              updateUser('isPhoneVerified', checked)
                            }
                          />
                          <span>
                            {user.isPhoneVerified === true ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      ) : (
                        <Badge
                          variant={
                            user.isPhoneVerified === true
                              ? 'default'
                              : 'outline'
                          }
                          className={
                            user.isPhoneVerified === true ? 'bg-green-500' : ''
                          }
                        >
                          {user.isPhoneVerified === true ? 'Sim' : 'Não'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='account' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5' />
                    Informações da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='id'>ID do Usuário</Label>
                      <p className='font-medium'>{user.id || ''}</p>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='userType'>Tipo de Usuário</Label>
                      {isEditing ? (
                        <Select
                          value={user.type || ''}
                          onValueChange={(value) =>
                            updateUser(
                              'type',
                              value as 'CLIENT' | 'PROVIDER' | null
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o tipo' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='CLIENT'>Cliente</SelectItem>
                            <SelectItem value='PROVIDER'>Fornecedor</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className='font-medium'>
                          {user.type === 'CLIENT'
                            ? 'Cliente'
                            : user.type === 'PROVIDER'
                            ? 'Fornecedor'
                            : 'Administrador'}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='isAdmin'>Administrador</Label>
                      {isEditing ? (
                        <div className='flex items-center space-x-2'>
                          <Switch
                            id='isAdmin'
                            checked={user.isAdmin === true}
                            onCheckedChange={(checked) =>
                              updateUser('isAdmin', checked)
                            }
                          />
                          <span>{user.isAdmin === true ? 'Sim' : 'Não'}</span>
                        </div>
                      ) : (
                        <p className='font-medium'>
                          {user.isAdmin === true ? 'Sim' : 'Não'}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='notificationId'>
                        ID de Configurações de Notificação
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5' />
                    Datas
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Data de Criação
                      </p>
                      <p className='font-medium'>
                        {formatDate(user.createdAt || '')}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Última Atualização
                      </p>
                      <p className='font-medium'>
                        {formatDate(user.updatedAt || '')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CreditCard className='h-5 w-5' />
                    Informações de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <Label htmlFor='stripeId'>ID do Cliente no Stripe</Label>
                    {isEditing ? (
                      <Input
                        id='stripeId'
                        value={user.stripeCustomerId || ''}
                        onChange={(e) =>
                          updateUser('stripeCustomerId', e.target.value || null)
                        }
                        placeholder='Não configurado'
                      />
                    ) : (
                      <p className='font-medium'>
                        {user.stripeCustomerId || 'Não configurado'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='details' className='space-y-4'>
              {user.client && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes do Cliente</CardTitle>
                    <CardDescription>
                      Informações específicas do cliente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          ID do Cliente
                        </p>
                        <p className='font-medium'>{user.client.id || ''}</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          ID do Usuário
                        </p>
                        <p className='font-medium'>
                          {user.client.userId || ''}
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='cpf'>CPF</Label>
                        {isEditing ? (
                          <Input
                            id='cpf'
                            value={user.client.cpf || ''}
                            onChange={(e) =>
                              updateClientField('cpf', e.target.value)
                            }
                          />
                        ) : (
                          <p className='font-medium'>{user.client.cpf || ''}</p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='clientRating'>
                          Avaliação do Cliente
                        </Label>
                        {isEditing ? (
                          <Input
                            id='clientRating'
                            type='number'
                            min='0'
                            max='5'
                            step='0.1'
                            value={
                              user.client.client_rating !== null
                                ? user.client.client_rating
                                : ''
                            }
                            onChange={(e) =>
                              updateClientField(
                                'client_rating',
                                e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null
                              )
                            }
                            placeholder='Sem avaliação'
                          />
                        ) : (
                          <p className='font-medium'>
                            {user.client.client_rating !== null
                              ? user.client.client_rating
                              : 'Sem avaliação'}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {user.provider && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes do Fornecedor</CardTitle>
                    <CardDescription>
                      Informações específicas do fornecedor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          ID do Fornecedor
                        </p>
                        <p className='font-medium'>{user.provider.id || ''}</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          ID do Usuário
                        </p>
                        <p className='font-medium'>
                          {user.provider.userId || ''}
                        </p>
                      </div>
                      {/* Add more provider-specific fields here */}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!user.client && !user.provider && (
                <Card>
                  <CardContent className='py-10'>
                    <div className='text-center text-muted-foreground'>
                      <p>
                        Não há detalhes específicos disponíveis para este
                        usuário.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>JSON Completo</CardTitle>
                  <CardDescription>Dados brutos do usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className='bg-muted p-4 rounded-md overflow-x-auto text-xs'>
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            {isEditing ? (
              <div className='flex space-x-2'>
                <Button variant='outline' onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className='flex items-center gap-2'
                >
                  <Save className='h-4 w-4' />
                  Salvar Alterações
                </Button>
              </div>
            ) : (
              <Button onClick={() => setOpen(false)}>Fechar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
