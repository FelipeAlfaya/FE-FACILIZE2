'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  ArrowRight,
  LinkIcon,
  Star,
  Lock,
  ArrowLeft,
  Code,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DashboardHeader } from '@/app/dashboard/components/dashboard-header'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Importamos diretamente a lista de rotas em desenvolvimento do middleware para exibição
// Este array deve ser idêntico ao definido no middleware.ts
const DEV_ROUTES = [
  '/dashboard', // Dashboard principal
  '/dashboard/settings', // Configurações do dashboard
  '/dashboard/reports', // Relatórios
  // Adicione aqui outras rotas que devem ser restritas somente a administradores
]

// Definição dos tipos de rotas
interface RouteCategory {
  name: string
  routes: RouteInfo[]
}

interface RouteInfo {
  path: string
  description: string
  isFavorite?: boolean
  isProtected?: boolean
  inDevelopment?: boolean
}

const DevController = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteRoutes, setFavoriteRoutes] = useState<string[]>([])

  // Rotas organizadas por categorias
  const routeCategories: RouteCategory[] = [
    {
      name: 'Dashboard',
      routes: [
        {
          path: '/dashboard',
          description: 'Dashboard principal',
          inDevelopment: DEV_ROUTES.includes('/dashboard'),
        },
        {
          path: '/dashboard/schedule',
          description: 'Agenda e agendamentos',
          inDevelopment: DEV_ROUTES.includes('/dashboard/schedule'),
        },
        {
          path: '/dashboard/services',
          description: 'Gerenciamento de serviços',
          inDevelopment: DEV_ROUTES.includes('/dashboard/services'),
        },
        {
          path: '/dashboard/clients',
          description: 'Lista de clientes',
          inDevelopment: DEV_ROUTES.includes('/dashboard/clients'),
        },
        {
          path: '/dashboard/profile',
          description: 'Perfil do usuário',
          inDevelopment: DEV_ROUTES.includes('/dashboard/profile'),
        },
        {
          path: '/dashboard/settings',
          description: 'Configurações',
          inDevelopment: DEV_ROUTES.includes('/dashboard/settings'),
        },
        {
          path: '/dashboard/notifications',
          description: 'Notificações',
          inDevelopment: DEV_ROUTES.includes('/dashboard/notifications'),
        },
        {
          path: '/dashboard/reports',
          description: 'Relatórios',
          inDevelopment: DEV_ROUTES.includes('/dashboard/reports'),
        },
      ],
    },
    {
      name: 'Admin',
      routes: [
        {
          path: '/admin',
          description: 'Painel administrativo',
          isProtected: true,
        },
        {
          path: '/admin/users',
          description: 'Gerenciamento de usuários',
          isProtected: true,
        },
        {
          path: '/admin/dev-controller',
          description: 'Controlador de desenvolvimento',
          isProtected: true,
        },
      ],
    },
    {
      name: 'Autenticação',
      routes: [
        { path: '/signin', description: 'Login' },
        { path: '/signup', description: 'Cadastro' },
        { path: '/password-reset', description: 'Redefinição de senha' },
      ],
    },
    {
      name: 'Perfil e Usuários',
      routes: [
        { path: '/dashboard/providers', description: 'Lista de prestadores' },
        {
          path: '/dashboard/providers/:id',
          description: 'Detalhes do prestador (substitua :id)',
        },
        { path: '/dashboard/profile/edit', description: 'Editar perfil' },
      ],
    },
    {
      name: 'Agendamentos',
      routes: [
        { path: '/dashboard/schedule/new', description: 'Novo agendamento' },
        {
          path: '/dashboard/schedule/:id',
          description: 'Detalhes do agendamento (substitua :id)',
        },
        {
          path: '/dashboard/availability',
          description: 'Gerenciar disponibilidade',
        },
      ],
    },
    {
      name: 'Serviços',
      routes: [
        { path: '/dashboard/services/new', description: 'Novo serviço' },
        {
          path: '/dashboard/services/:id',
          description: 'Editar serviço (substitua :id)',
        },
        {
          path: '/dashboard/services-catalog',
          description: 'Catálogo de serviços',
        },
      ],
    },
  ]

  // Verificar se o usuário é admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/dashboard')
    }

    // Carregar favoritos do localStorage
    const storedFavorites = localStorage.getItem('favoriteRoutes')
    if (storedFavorites) {
      setFavoriteRoutes(JSON.parse(storedFavorites))
    }
  }, [user, router])

  // Filtrar rotas com base na pesquisa
  const filteredCategories = routeCategories
    .map((category) => {
      const filteredRoutes = category.routes.filter(
        (route) =>
          route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.description.toLowerCase().includes(searchQuery.toLowerCase())
      )

      return {
        ...category,
        routes: filteredRoutes,
      }
    })
    .filter((category) => category.routes.length > 0)

  // Gerenciar favoritos
  const toggleFavorite = (path: string) => {
    const newFavorites = favoriteRoutes.includes(path)
      ? favoriteRoutes.filter((route) => route !== path)
      : [...favoriteRoutes, path]

    setFavoriteRoutes(newFavorites)
    localStorage.setItem('favoriteRoutes', JSON.stringify(newFavorites))
  }

  // Função para navegar para uma rota
  const navigateTo = (path: string) => {
    router.push(path)
  }

  // Lista de rotas favoritas
  const favorites = routeCategories
    .flatMap((category) => category.routes)
    .filter((route) => favoriteRoutes.includes(route.path))

  // Lista de rotas em desenvolvimento
  const developmentRoutes = routeCategories
    .flatMap((category) => category.routes)
    .filter(
      (route) =>
        DEV_ROUTES.includes(route.path) ||
        DEV_ROUTES.some(
          (devRoute) =>
            route.path.startsWith(`${devRoute}/`) && devRoute !== '/'
        )
    )

  if (!user || !user.isAdmin) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Card className='w-[400px]'>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Esta página só pode ser acessada por administradores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className='w-full'
              onClick={() => router.push('/dashboard')}
            >
              Voltar para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <DashboardHeader />

      <main className='container mx-auto px-4 py-6 flex-1'>
        <div className='flex flex-col gap-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold mb-2'>
                Controlador de Desenvolvimento
              </h1>
              <p className='text-muted-foreground'>
                Navegue rapidamente para qualquer rota da aplicação durante o
                desenvolvimento
              </p>
            </div>
            <Button
              variant='outline'
              onClick={() => router.back()}
              className='gap-2'
            >
              <ArrowLeft className='h-4 w-4' /> Voltar
            </Button>
          </div>

          {/* Explicação sobre rotas em desenvolvimento */}
          <Card className='border border-yellow-600/30 bg-yellow-50/50 dark:bg-yellow-900/5'>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-yellow-600' />
                Rotas em Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <p>
                  As rotas abaixo estão marcadas como "Em Desenvolvimento" e são
                  acessíveis apenas para administradores:
                </p>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {DEV_ROUTES.map((route) => (
                    <Badge key={route} className='bg-yellow-500/80'>
                      {route}
                    </Badge>
                  ))}
                </div>
                <p className='text-sm text-muted-foreground mt-4'>
                  Para alterar as rotas em desenvolvimento, edite a constante{' '}
                  <code className='bg-muted px-1 py-0.5 rounded'>
                    DEV_ROUTES
                  </code>{' '}
                  no arquivo{' '}
                  <code className='bg-muted px-1 py-0.5 rounded'>
                    middleware.ts
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Buscar rotas...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Rotas em Desenvolvimento */}
          {developmentRoutes.length > 0 && (
            <Card className='border-2 border-yellow-500/50'>
              <CardHeader className='bg-yellow-500/10'>
                <CardTitle className='text-lg'>
                  <div className='flex items-center'>
                    <Code className='h-5 w-5 text-yellow-600 mr-2' />
                    Rotas em Desenvolvimento
                    <Badge className='ml-2 bg-yellow-500'>Apenas Admin</Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Estas rotas só podem ser acessadas por administradores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                  {developmentRoutes.map((route) => (
                    <div
                      key={route.path}
                      className='flex justify-between items-center border-2 border-yellow-500/30 rounded-md p-3 hover:bg-accent cursor-pointer'
                      onClick={() => navigateTo(route.path)}
                    >
                      <div>
                        <p className='font-medium'>{route.description}</p>
                        <p className='text-xs text-muted-foreground'>
                          {route.path}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Button variant='ghost' size='sm'>
                          <ArrowRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rotas Favoritas */}
          {favorites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  <div className='flex items-center'>
                    <Star className='h-5 w-5 text-yellow-500 mr-2' />
                    Rotas Favoritas
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                  {favorites.map((route) => (
                    <div
                      key={route.path}
                      className='flex justify-between items-center border rounded-md p-3 hover:bg-accent cursor-pointer'
                      onClick={() => navigateTo(route.path)}
                    >
                      <div>
                        <p className='font-medium'>{route.description}</p>
                        <p className='text-xs text-muted-foreground'>
                          {route.path}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(route.path)
                          }}
                        >
                          <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <ArrowRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle className='text-lg'>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rota</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className='text-right'>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.routes.map((route) => {
                      const isInDevelopment =
                        DEV_ROUTES.includes(route.path) ||
                        DEV_ROUTES.some(
                          (devRoute) =>
                            route.path.startsWith(`${devRoute}/`) &&
                            devRoute !== '/'
                        )

                      return (
                        <TableRow
                          key={route.path}
                          className={isInDevelopment ? 'bg-yellow-500/10' : ''}
                        >
                          <TableCell className='font-mono'>
                            <div className='flex items-center gap-2'>
                              {route.path}
                              {route.isProtected && (
                                <Lock className='h-3 w-3 text-muted-foreground' />
                              )}
                              {isInDevelopment && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Code className='h-3 w-3 text-yellow-600' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Em desenvolvimento (somente admin)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{route.description}</TableCell>
                          <TableCell className='text-right'>
                            <div className='flex gap-2 justify-end'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(route.path)
                                }}
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    favoriteRoutes.includes(route.path)
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : ''
                                  }`}
                                />
                              </Button>
                              <Button variant='ghost' size='sm' asChild>
                                <Link href={route.path} target='_blank'>
                                  <LinkIcon className='h-4 w-4' />
                                </Link>
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => navigateTo(route.path)}
                              >
                                <ArrowRight className='h-4 w-4' />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default DevController
