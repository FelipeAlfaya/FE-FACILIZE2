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
import { DeleteConfirmationModal } from '@/app/dashboard/components/delete-confirmation-modal'

interface User {
  id: number
  email: string
  name: string
  avatar: string | null
  type: 'CLIENT' | 'PROVIDER'
  isAdmin: boolean
  createdAt: string
  updatedAt: string
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        if (!token) {
          throw new Error('No access token found')
        }

        const response = await fetch(
          `http://localhost:3000/users?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

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

  const handleDeleteUser = async (user: User) => {
    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')

      if (!token) {
        throw new Error('No access token found')
      }

      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
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
        <h2 className='text-3xl font-bold tracking-tight'>Usuários</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de usuários</CardTitle>
          <CardDescription>
            Gerencie os usuários da plataforma e monitore o status de cada um
            deles.
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
                  <Input placeholder='Search users...' className='pl-8' />
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
                        <TableCell>
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
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>
                                Editar usuário
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault()
                                  setUserToDelete(user)
                                }}
                                className='text-red-600'
                              >
                                Deletar usuário
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <DeleteConfirmationModal
                  isOpen={!!userToDelete}
                  onClose={() => setUserToDelete(null)}
                  onConfirm={() =>
                    userToDelete && handleDeleteUser(userToDelete)
                  }
                  title='Você tem certeza?'
                  description={`Essa ação não pode ser desfeita. Isso vai deletar permanentemente a conta de ${
                    userToDelete?.name || ''
                  } e todos os dados associados a ela.`}
                />
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
                    Anterior
                  </Button>
                  <div className='text-sm'>
                    Página {meta.page} de {meta.last_page}
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
                    Próxima
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
