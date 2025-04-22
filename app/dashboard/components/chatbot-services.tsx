'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  Trash2,
  Save,
  Edit,
  Check,
  X,
  DotIcon as DragHandleDots2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Service = {
  id: string
  name: string
  description: string
  keywords: string[]
  enabled: boolean
  responseTemplate: string
  requiresConfirmation: boolean
}

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Agendamento de Consulta',
    description:
      'Permite que clientes agendem consultas com profissionais disponíveis',
    keywords: ['agendar', 'marcar', 'consulta', 'horário', 'disponibilidade'],
    enabled: true,
    responseTemplate:
      'Olá! Vou ajudar você a agendar uma consulta. Temos horários disponíveis nas seguintes datas: {availableDates}. Qual data seria melhor para você?',
    requiresConfirmation: true,
  },
  {
    id: '2',
    name: 'Verificação de Horários',
    description:
      'Permite que clientes verifiquem horários disponíveis para agendamento',
    keywords: ['horários', 'disponível', 'agenda', 'quando', 'disponibilidade'],
    enabled: true,
    responseTemplate:
      'Olá! Os horários disponíveis para {service} são: {availableTimes}. Gostaria de agendar algum desses horários?',
    requiresConfirmation: false,
  },
  {
    id: '3',
    name: 'Cancelamento de Agendamento',
    description: 'Permite que clientes cancelem agendamentos existentes',
    keywords: ['cancelar', 'desmarcar', 'reagendar', 'mudar'],
    enabled: true,
    responseTemplate:
      'Entendi que você deseja cancelar seu agendamento. Seu agendamento para {date} às {time} será cancelado. Posso confirmar o cancelamento?',
    requiresConfirmation: true,
  },
]

export function ChatbotServices() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      description: '',
      keywords: [],
      enabled: true,
      responseTemplate: '',
      requiresConfirmation: false,
    }
    setEditingService(newService)
  }

  const handleEditService = (service: Service) => {
    setEditingService({ ...service })
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const handleSaveService = () => {
    if (!editingService) return

    if (
      !editingService.name ||
      !editingService.description ||
      !editingService.responseTemplate
    ) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const existingIndex = services.findIndex((s) => s.id === editingService.id)
    if (existingIndex >= 0) {
      const updatedServices = [...services]
      updatedServices[existingIndex] = editingService
      setServices(updatedServices)
    } else {
      setServices([...services, editingService])
    }

    setEditingService(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCancelEdit = () => {
    setEditingService(null)
  }

  const handleKeywordsChange = (value: string) => {
    if (!editingService) return
    const keywords = value
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k)
    setEditingService({ ...editingService, keywords })
  }

  const handleToggleService = (id: string, enabled: boolean) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, enabled } : service
      )
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-bold mb-4'>Serviços do Chatbot</h2>
        <p className='text-muted-foreground mb-6'>
          Configure os serviços que seu chatbot pode oferecer aos clientes via
          WhatsApp.
        </p>
      </div>

      {showSuccess && (
        <Alert className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50'>
          <Check className='h-4 w-4' />
          <AlertDescription>Serviço salvo com sucesso!</AlertDescription>
        </Alert>
      )}

      {editingService ? (
        <div className='space-y-4 border p-4 rounded-md'>
          <h3 className='font-medium text-lg'>
            {editingService.id ===
            services.find((s) => s.id === editingService.id)?.id
              ? 'Editar Serviço'
              : 'Novo Serviço'}
          </h3>

          <div className='space-y-2'>
            <Label htmlFor='service-name'>Nome do Serviço</Label>
            <Input
              id='service-name'
              value={editingService.name}
              onChange={(e) =>
                setEditingService({ ...editingService, name: e.target.value })
              }
              placeholder='Ex: Agendamento de Consulta'
            />
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
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='service-keywords'>
              Palavras-chave (separadas por vírgula)
            </Label>
            <Input
              id='service-keywords'
              value={editingService.keywords.join(', ')}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder='Ex: agendar, marcar, consulta'
            />
            <p className='text-xs text-muted-foreground'>
              Palavras que o chatbot identificará para acionar este serviço
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='service-template'>Modelo de Resposta</Label>
            <Textarea
              id='service-template'
              value={editingService.responseTemplate}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  responseTemplate: e.target.value,
                })
              }
              placeholder='Modelo de resposta que o chatbot usará'
              rows={5}
            />
            <p className='text-xs text-muted-foreground'>
              Use {'{variável}'} para inserir dados dinâmicos. Ex:{' '}
              {'{availableDates}'}, {'{service}'}
            </p>
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='service-confirmation'
              checked={editingService.requiresConfirmation}
              onCheckedChange={(checked) =>
                setEditingService({
                  ...editingService,
                  requiresConfirmation: checked,
                })
              }
            />
            <Label htmlFor='service-confirmation'>
              Requer confirmação do cliente
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='service-enabled'
              checked={editingService.enabled}
              onCheckedChange={(checked) =>
                setEditingService({ ...editingService, enabled: checked })
              }
            />
            <Label htmlFor='service-enabled'>Serviço ativo</Label>
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button variant='outline' onClick={handleCancelEdit}>
              <X className='h-4 w-4 mr-2' />
              Cancelar
            </Button>
            <Button onClick={handleSaveService}>
              <Save className='h-4 w-4 mr-2' />
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={handleAddService}>
          <Plus className='h-4 w-4 mr-2' />
          Adicionar Serviço
        </Button>
      )}

      <Separator className='my-6' />

      <div>
        <h3 className='font-medium text-lg mb-4'>Serviços Configurados</h3>
        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-4'>
            {services.map((service) => (
              <Card
                key={service.id}
                className={`${!service.enabled ? 'opacity-70' : ''}`}
              >
                <CardContent className='p-4'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-2'>
                      <DragHandleDots2 className='h-5 w-5 text-muted-foreground cursor-move' />
                      <div>
                        <div className='flex items-center gap-2'>
                          <h4 className='font-medium'>{service.name}</h4>
                          {!service.enabled && (
                            <Badge variant='outline'>Inativo</Badge>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        id={`toggle-${service.id}`}
                        checked={service.enabled}
                        onCheckedChange={(checked) =>
                          handleToggleService(service.id, checked)
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
                  <div className='mt-2'>
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {service.keywords.map((keyword, i) => (
                        <Badge key={i} variant='secondary' className='text-xs'>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className='mt-3 bg-muted/40 p-2 rounded-md text-sm'>
                    <p className='text-xs font-medium mb-1'>
                      Modelo de resposta:
                    </p>
                    <p className='text-xs'>{service.responseTemplate}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
