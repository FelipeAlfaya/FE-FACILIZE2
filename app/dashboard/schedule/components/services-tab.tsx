'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { ServiceModal } from './service-modal'
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
import {
  createService,
  updateService,
  getMyServices,
  getServicesByProvider,
  deleteService,
  Service,
  ServiceResponse,
} from '@/app/api/services-api'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/context/AuthContext'

export function ServicesTab() {
  const { toast } = useToast()
  const { token, user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [services, setServices] = useState<ServiceResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)

  const loadServices = async () => {
    if (!token) return

    try {
      setLoading(true)

      // Primeiro tenta obter os serviços usando o endpoint my-services
      try {
        const data = await getMyServices(token)
        setServices(data)
        return
      } catch (error) {
        console.log('Endpoint my-services falhou, tentando alternativa')

        // Se falhar, tenta obter os serviços usando o providerId
        if (user?.provider?.id) {
          const providerId = user.provider.id
          const data = await getServicesByProvider(providerId)
          setServices(data)
          return
        }

        // Se não conseguir encontrar o providerId, lança o erro original
        throw error
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadServices()
    }
  }, [token])

  const handleAddService = () => {
    setCurrentService(null)
    setIsModalOpen(true)
  }

  const handleEditService = (service: ServiceResponse) => {
    setCurrentService(service)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (serviceId: number) => {
    setServiceToDelete(serviceId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (serviceToDelete && token) {
      try {
        await deleteService(serviceToDelete, token)
        toast({
          title: 'Sucesso',
          description: 'Serviço excluído com sucesso.',
        })
        loadServices()
      } catch (error) {
        console.error('Erro ao excluir serviço:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o serviço.',
          variant: 'destructive',
        })
      } finally {
        setIsDeleteDialogOpen(false)
        setServiceToDelete(null)
      }
    }
  }

  const handleSubmit = async (data: Service) => {
    if (!token) {
      toast({
        title: 'Erro',
        description:
          'Você precisa estar logado como prestador para realizar esta ação.',
        variant: 'destructive',
      })
      return
    }

    try {
      if (currentService?.id) {
        // Atualizar serviço existente
        const { name, description, price, duration } = data
        await updateService(
          currentService.id,
          { name, description, price, duration },
          token
        )
        toast({
          title: 'Sucesso',
          description: 'Serviço atualizado com sucesso.',
        })
      } else {
        // Adicionar novo serviço
        const { name, description, price, duration } = data
        await createService({ name, description, price, duration }, token)
        toast({
          title: 'Sucesso',
          description: 'Serviço adicionado com sucesso.',
        })
      }
      loadServices()
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o serviço.',
        variant: 'destructive',
      })
    }
  }

  // Se o usuário não for um prestador, mostrar mensagem de erro
  if (user && user.type !== 'PROVIDER') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
          <CardDescription>
            Esta área é exclusiva para prestadores de serviço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Você não tem permissão para acessar esta área.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-xl font-semibold'>Gerenciar Serviços</h2>
          <p className='text-gray-500 text-sm'>
            Adicione, edite ou remova os serviços que você oferece
          </p>
        </div>
        <Button onClick={handleAddService}>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar Serviço
        </Button>
      </div>

      <Card>
        <CardContent className='p-6'>
          {loading ? (
            <div className='flex justify-center items-center h-32'>
              <p>Carregando serviços...</p>
            </div>
          ) : services.length === 0 ? (
            <div className='flex flex-col justify-center items-center h-32'>
              <p className='text-muted-foreground'>
                Nenhum serviço encontrado.
              </p>
              <Button
                variant='outline'
                className='mt-2'
                onClick={handleAddService}
              >
                <Plus className='mr-2 h-4 w-4' />
                Adicionar serviço
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className='font-medium'>
                      {service.name}
                    </TableCell>
                    <TableCell className='max-w-xs truncate'>
                      {service.description}
                    </TableCell>
                    <TableCell>{formatCurrency(service.price)}</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell className='text-right space-x-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleDeleteClick(service.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ServiceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        title={currentService ? 'Editar Serviço' : 'Adicionar Serviço'}
        description={
          currentService
            ? 'Edite as informações do serviço existente.'
            : 'Adicione um novo serviço ao seu catálogo.'
        }
        submitLabel={currentService ? 'Atualizar Serviço' : 'Adicionar Serviço'}
        defaultValues={
          currentService || {
            name: '',
            description: '',
            price: 0,
            duration: 30,
          }
        }
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
