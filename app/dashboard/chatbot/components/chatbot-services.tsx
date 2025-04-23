'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Trash2,
  Plus,
  Save,
  Edit,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type Service = {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: string
  responseTemplate: string
  requiredInfo: string[]
}

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Agendamento de Consulta',
    description: 'Permite que clientes agendem consultas através do WhatsApp',
    enabled: true,
    icon: 'Calendar',
    responseTemplate:
      'Olá {nome}, sua consulta foi agendada para {data} às {hora}. Lembre-se de trazer {documentos}.',
    requiredInfo: ['Nome', 'Data', 'Hora', 'Tipo de serviço'],
  },
  {
    id: '2',
    name: 'Verificação de Disponibilidade',
    description: 'Verifica horários disponíveis para agendamento',
    enabled: true,
    icon: 'Clock',
    responseTemplate:
      'Olá {nome}, temos os seguintes horários disponíveis para {data}: {horarios}. Qual horário você prefere?',
    requiredInfo: ['Nome', 'Data', 'Tipo de serviço'],
  },
  {
    id: '3',
    name: 'Solicitação de Documentos',
    description: 'Solicita documentos necessários para um serviço',
    enabled: false,
    icon: 'FileText',
    responseTemplate:
      'Olá {nome}, para o serviço de {servico}, precisamos dos seguintes documentos: {documentos}. Você pode enviá-los por aqui mesmo.',
    requiredInfo: ['Nome', 'Tipo de serviço'],
  },
  {
    id: '4',
    name: 'FAQ / Perguntas Frequentes',
    description: 'Responde perguntas frequentes sobre serviços',
    enabled: true,
    icon: 'HelpCircle',
    responseTemplate:
      'Olá {nome}, aqui está a resposta para sua pergunta sobre {assunto}: {resposta}',
    requiredInfo: ['Nome', 'Assunto da pergunta'],
  },
]

export function ChatbotServices() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newRequiredInfo, setNewRequiredInfo] = useState('')

  const handleToggleService = (id: string) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, enabled: !service.enabled } : service
      )
    )

    const service = services.find((s) => s.id === id)
    if (service) {
      toast.success(
        `Serviço "${service.name}" ${
          service.enabled ? 'desativado' : 'ativado'
        } com sucesso!`
      )
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService({ ...service })
    setIsAdding(false)
  }

  const handleAddNewService = () => {
    setEditingService({
      id: Date.now().toString(),
      name: '',
      description: '',
      enabled: true,
      icon: 'MessageSquare',
      responseTemplate: '',
      requiredInfo: [],
    })
    setIsAdding(true)
  }

  const handleSaveService = () => {
    if (!editingService) return

    if (!editingService.name.trim()) {
      toast.error('O nome do serviço é obrigatório')
      return
    }

    if (isAdding) {
      setServices([...services, editingService])
      toast.success(`Serviço "${editingService.name}" adicionado com sucesso!`)
    } else {
      setServices(
        services.map((service) =>
          service.id === editingService.id ? editingService : service
        )
      )
      toast.success(`Serviço "${editingService.name}" atualizado com sucesso!`)
    }

    setEditingService(null)
    setIsAdding(false)
  }

  const handleDeleteService = (id: string) => {
    const service = services.find((s) => s.id === id)
    if (service) {
      setServices(services.filter((service) => service.id !== id))
      toast.success(`Serviço "${service.name}" removido com sucesso!`)
    }
  }

  const handleAddRequiredInfo = () => {
    if (!editingService || !newRequiredInfo.trim()) return

    setEditingService({
      ...editingService,
      requiredInfo: [...editingService.requiredInfo, newRequiredInfo],
    })

    setNewRequiredInfo('')
  }

  const handleRemoveRequiredInfo = (info: string) => {
    if (!editingService) return

    setEditingService({
      ...editingService,
      requiredInfo: editingService.requiredInfo.filter((i) => i !== info),
    })
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className='h-5 w-5' />
      case 'Clock':
        return <Clock className='h-5 w-5' />
      case 'FileText':
        return <FileText className='h-5 w-5' />
      case 'HelpCircle':
        return <HelpCircle className='h-5 w-5' />
      default:
        return <MessageSquare className='h-5 w-5' />
    }
  }

  return (
    <div className='space-y-6'>
      {!editingService ? (
        <>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-medium'>Serviços Disponíveis</h3>
            <Button onClick={handleAddNewService}>
              <Plus className='h-4 w-4 mr-2' />
              Adicionar Serviço
            </Button>
          </div>

          <div className='space-y-4'>
            {services.map((service) => (
              <Card key={service.id} className='relative'>
                <CardContent className='p-4'>
                  <div className='flex items-start gap-4'>
                    <div className='mt-1 p-2 bg-primary/10 rounded-md'>
                      {getIconComponent(service.icon)}
                    </div>

                    <div className='flex-1 space-y-1'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <h4 className='font-medium'>{service.name}</h4>
                          <Badge
                            variant={service.enabled ? 'default' : 'outline'}
                          >
                            {service.enabled ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Switch
                            checked={service.enabled}
                            onCheckedChange={() =>
                              handleToggleService(service.id)
                            }
                          />
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      <p className='text-sm text-muted-foreground'>
                        {service.description}
                      </p>

                      <div className='pt-2'>
                        <p className='text-xs font-medium mb-1'>
                          Informações necessárias:
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {service.requiredInfo.map((info) => (
                            <Badge
                              key={info}
                              variant='secondary'
                              className='text-xs'
                            >
                              {info}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>
              {isAdding ? 'Adicionar Novo Serviço' : 'Editar Serviço'}
            </h3>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setEditingService(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveService}>
                <Save className='h-4 w-4 mr-2' />
                Salvar
              </Button>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='service-name'>Nome do Serviço</Label>
                <Input
                  id='service-name'
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                  placeholder='Ex: Agendamento de Consulta'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='service-icon'>Ícone</Label>
                <select
                  id='service-icon'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  value={editingService.icon}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      icon: e.target.value,
                    })
                  }
                >
                  <option value='Calendar'>Calendário</option>
                  <option value='Clock'>Relógio</option>
                  <option value='FileText'>Documento</option>
                  <option value='HelpCircle'>Ajuda</option>
                  <option value='MessageSquare'>Mensagem</option>
                </select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='service-description'>Descrição</Label>
              <Textarea
                id='service-description'
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    description: e.target.value,
                  })
                }
                placeholder='Descreva o que este serviço faz'
                rows={2}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='response-template'>Template de Resposta</Label>
              <Textarea
                id='response-template'
                value={editingService.responseTemplate}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    responseTemplate: e.target.value,
                  })
                }
                placeholder='Ex: Olá {nome}, sua consulta foi agendada para {data} às {hora}.'
                rows={3}
              />
              <p className='text-xs text-muted-foreground'>
                Use {'{variável}'} para inserir informações dinâmicas na
                resposta.
              </p>
            </div>

            <div className='space-y-2'>
              <Label>Informações Necessárias</Label>
              <div className='flex flex-wrap gap-2 mb-2'>
                {editingService.requiredInfo.map((info) => (
                  <Badge
                    key={info}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {info}
                    <button
                      onClick={() => handleRemoveRequiredInfo(info)}
                      className='ml-1 rounded-full hover:bg-muted p-0.5'
                    >
                      <Trash2 className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className='flex gap-2'>
                <Input
                  value={newRequiredInfo}
                  onChange={(e) => setNewRequiredInfo(e.target.value)}
                  placeholder='Ex: Nome, Data, Hora'
                  className='flex-1'
                />
                <Button
                  variant='outline'
                  onClick={handleAddRequiredInfo}
                  disabled={!newRequiredInfo.trim()}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar
                </Button>
              </div>
              <p className='text-xs text-muted-foreground'>
                Adicione as informações que o chatbot precisa coletar para este
                serviço.
              </p>
            </div>

            <div className='flex items-center space-x-2 pt-2'>
              <Switch
                id='service-enabled'
                checked={editingService.enabled}
                onCheckedChange={(checked) =>
                  setEditingService({ ...editingService, enabled: checked })
                }
              />
              <Label htmlFor='service-enabled'>Serviço Ativo</Label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
