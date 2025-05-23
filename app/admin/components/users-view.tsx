'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog'
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { UserDetailsModal } from './user-details-modal'

interface User {
  id: number
  email: string
  name: string
  avatar: string | null
  type: 'CLIENT' | 'PROVIDER'
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  phone?: string | null
  stripeCustomerId: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  deletedAt: string | null
  settings?: Record<string, any>
  client?: {
    id: number
    cpf: string
    client_rating: number | null
  } | null
  provider?: {
    id: number
    description: string
    provider_rating: number | null
    plan: {
      name: string
    }
  } | null
}

interface PaginatedResponse {
  data: User[]
  meta: {
    total: number
    page: number
    limit: number
    last_page: number
  }
}

export function UsersView() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<PaginatedResponse['meta'] | null>(null)
  const { toast } = useToast()
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const baseApi = `${process.env.NEXT_PUBLIC_API_URL}`

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        if (!token) {
          throw new Error('No access token found')
        }

        const response = await fetch(`${baseApi}users?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data: PaginatedResponse = await response.json()
        setUsers(data.data)
        setMeta(data.meta)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage])

  const handleUserUpdate = () => {
    console.log('tesdte')
  }

  const handleDeleteUser = async (user: User) => {
    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')

      if (!token) {
        throw new Error('No access token found')
      }

      const response = await fetch(`${baseApi}users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      setUsers(users.filter((u) => u.id !== user.id))
      setUserToDelete(null)

      toast({
        title: 'User deleted',
        description: `${user.name} has been successfully deleted.`,
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const getStatusFromUser = (user: User) => {
    if (
      user.provider?.provider_rating === null &&
      user.client?.client_rating === null
    ) {
      return 'Pending'
    }
    return 'Active'
  }

  const getNameInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Usuário</h2>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de usuários</CardTitle>
          <CardDescription>
            Gerencie os usuários, seus tipos, etc...
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <>
              <div className='flex items-center justify-between mb-4'>
                <div className='relative w-64'>
                  <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input placeholder='Procure usuários...' className='pl-8' />
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline'>Exportar</Button>
                  <Button variant='outline'>Filtrar</Button>
                </div>
              </div>

              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <Avatar>
                              <AvatarImage
                                src={user.avatar || undefined}
                                alt={user.name}
                              />
                              <AvatarFallback>
                                {getNameInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='font-medium'>{user.name}</p>
                              <p className='text-sm text-muted-foreground'>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='capitalize'>
                          {user.type.toLowerCase()}
                        </TableCell>
                        <TableCell className='select-none'>
                          <Badge
                            variant={
                              getStatusFromUser(user) === 'Active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {getStatusFromUser(user)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <MoreHorizontal className='h-4 w-4' />
                                <span className='sr-only'>Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <UserDetailsModal
                                user={{
                                  ...user,
                                  phone: user.phone ?? null,
                                  client: user.client ?? null,
                                  provider: user.provider ?? null,
                                }}
                                onSave={handleUserUpdate}
                                trigger={
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault()
                                    }}
                                  >
                                    Ver detalhes
                                  </DropdownMenuItem>
                                }
                              />
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      setUserToDelete(user)
                                    }}
                                    className='text-red-600'
                                  >
                                    Deletar usuário
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Você tem certeza?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Essa ação não pode ser desfeita. Isso vai
                                      deletar permanentemente a conta de{' '}
                                      {user.name}e remover seus dados dos nossos
                                      bancos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => setUserToDelete(null)}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        user && handleDeleteUser(user)
                                      }
                                      className='bg-red-600 rounded-4xl text-sm hover:bg-red-700'
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {meta && (
                <div className='flex items-center justify-end space-x-2 py-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className='text-sm'>
                    Page {meta.page} of {meta.last_page}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(meta.last_page, prev + 1)
                      )
                    }
                    disabled={currentPage === meta.last_page}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
