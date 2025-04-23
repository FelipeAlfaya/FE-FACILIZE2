'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertCircle,
  Save,
  RefreshCw,
  Smartphone,
  MessageSquare,
  Bot,
  Settings2,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ChatbotSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [settings, setSettings] = useState({
    general: {
      botName: 'Facilize Assistant',
      welcomeMessage:
        'Olá! Sou o assistente virtual da Facilize. Como posso ajudar você hoje?',
      businessHours: 'Segunda a Sexta: 08:00 - 18:00, Sábado: 09:00 - 13:00',
      offHoursMessage:
        'Estamos fora do horário de atendimento. Retornaremos assim que possível.',
      transferToHuman: true,
      transferMessage:
        "Gostaria de falar com um atendente humano? Digite 'atendente' a qualquer momento.",
    },
    ai: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1024,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
    },
    notifications: {
      notifyNewConversations: true,
      notifyTransferRequests: true,
      notifyAfterHours: false,
      notifyEmail: 'contato@facilize.com',
      notifyPhone: '+5511999999999',
    },
    whatsapp: {
      phoneNumber: '+5511999999999',
      displayName: 'Facilize',
      profileImage: 'https://example.com/profile.jpg',
      businessAccount: true,
      businessId: '123456789',
      apiKey: '••••••••••••••••',
    },
  })

  const handleSaveSettings = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      toast.success('Configurações salvas com sucesso!')

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleGeneralChange = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [field]: value,
      },
    })
  }

  const handleAIChange = (field: string, value: string | number) => {
    setSettings({
      ...settings,
      ai: {
        ...settings.ai,
        [field]: value,
      },
    })
  }

  const handleNotificationsChange = (
    field: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    })
  }

  const handleWhatsAppChange = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      whatsapp: {
        ...settings.whatsapp,
        [field]: value,
      },
    })
  }

  const handleTestConnection = () => {
    toast.info('Testando conexão com WhatsApp...', {
      description: 'Esta funcionalidade estará disponível em breve.',
    })
  }

  return (
    <div className='space-y-6'>
      {showSuccess && (
        <Alert className='bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Configurações salvas com sucesso!</AlertDescription>
        </Alert>
      )}

      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>Configurações do Chatbot</h3>
          <p className='text-sm text-muted-foreground'>
            Configure os parâmetros gerais, IA e integrações do seu chatbot.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleTestConnection}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Testar Conexão
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            <Save className='h-4 w-4 mr-2' />
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue='general' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='general'>
            <Settings2 className='h-4 w-4 mr-2' />
            Geral
          </TabsTrigger>
          <TabsTrigger value='ai'>
            <Bot className='h-4 w-4 mr-2' />
            Parâmetros de IA
          </TabsTrigger>
          <TabsTrigger value='notifications'>
            <MessageSquare className='h-4 w-4 mr-2' />
            Notificações
          </TabsTrigger>
          <TabsTrigger value='whatsapp'>
            <Smartphone className='h-4 w-4 mr-2' />
            WhatsApp Business
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general'>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='bot-name'>Nome do Chatbot</Label>
                <Input
                  id='bot-name'
                  value={settings.general.botName}
                  onChange={(e) =>
                    handleGeneralChange('botName', e.target.value)
                  }
                  placeholder='Ex: Facilize Assistant'
                />
                <p className='text-xs text-muted-foreground'>
                  Este nome será exibido para os clientes durante as conversas.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='welcome-message'>Mensagem de Boas-vindas</Label>
                <Textarea
                  id='welcome-message'
                  value={settings.general.welcomeMessage}
                  onChange={(e) =>
                    handleGeneralChange('welcomeMessage', e.target.value)
                  }
                  placeholder='Ex: Olá! Como posso ajudar você hoje?'
                  rows={3}
                />
                <p className='text-xs text-muted-foreground'>
                  Esta mensagem será enviada quando um cliente iniciar uma
                  conversa.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='business-hours'>Horário de Funcionamento</Label>
                <Textarea
                  id='business-hours'
                  value={settings.general.businessHours}
                  onChange={(e) =>
                    handleGeneralChange('businessHours', e.target.value)
                  }
                  placeholder='Ex: Segunda a Sexta: 08:00 - 18:00'
                  rows={2}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='off-hours-message'>
                  Mensagem Fora do Horário
                </Label>
                <Textarea
                  id='off-hours-message'
                  value={settings.general.offHoursMessage}
                  onChange={(e) =>
                    handleGeneralChange('offHoursMessage', e.target.value)
                  }
                  placeholder='Ex: Estamos fora do horário de atendimento.'
                  rows={2}
                />
              </div>

              <Separator />

              <div className='flex items-center space-x-2'>
                <Switch
                  id='transfer-human'
                  checked={settings.general.transferToHuman}
                  onCheckedChange={(checked) =>
                    handleGeneralChange('transferToHuman', checked)
                  }
                />
                <Label htmlFor='transfer-human'>
                  Permitir transferência para atendente humano
                </Label>
              </div>

              {settings.general.transferToHuman && (
                <div className='space-y-2'>
                  <Label htmlFor='transfer-message'>
                    Mensagem de Transferência
                  </Label>
                  <Textarea
                    id='transfer-message'
                    value={settings.general.transferMessage}
                    onChange={(e) =>
                      handleGeneralChange('transferMessage', e.target.value)
                    }
                    placeholder='Ex: Gostaria de falar com um atendente humano?'
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='ai'>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='ai-model'>Modelo de IA</Label>
                <Select
                  value={settings.ai.model}
                  onValueChange={(value) => handleAIChange('model', value)}
                >
                  <SelectTrigger id='ai-model'>
                    <SelectValue placeholder='Selecione um modelo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
                    <SelectItem value='gpt-4'>GPT-4</SelectItem>
                    <SelectItem value='gpt-4o'>GPT-4o</SelectItem>
                    <SelectItem value='claude-3'>Claude 3</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-xs text-muted-foreground'>
                  O modelo de IA que será usado para gerar respostas.
                </p>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='temperature'>
                    Temperatura: {settings.ai.temperature}
                  </Label>
                  <span className='text-sm text-muted-foreground'>
                    (0 = Determinístico, 1 = Criativo)
                  </span>
                </div>
                <Slider
                  id='temperature'
                  min={0}
                  max={1}
                  step={0.1}
                  value={[settings.ai.temperature as number]}
                  onValueChange={(value) =>
                    handleAIChange('temperature', value[0])
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='max-tokens'>
                  Máximo de Tokens: {settings.ai.maxTokens}
                </Label>
                <Slider
                  id='max-tokens'
                  min={256}
                  max={4096}
                  step={128}
                  value={[settings.ai.maxTokens as number]}
                  onValueChange={(value) =>
                    handleAIChange('maxTokens', value[0])
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Limite máximo de tokens (palavras) para cada resposta.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='top-p'>Top P: {settings.ai.topP}</Label>
                <Slider
                  id='top-p'
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[settings.ai.topP as number]}
                  onValueChange={(value) => handleAIChange('topP', value[0])}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='frequency-penalty'>
                    Penalidade de Frequência: {settings.ai.frequencyPenalty}
                  </Label>
                  <Slider
                    id='frequency-penalty'
                    min={0}
                    max={2}
                    step={0.1}
                    value={[settings.ai.frequencyPenalty as number]}
                    onValueChange={(value) =>
                      handleAIChange('frequencyPenalty', value[0])
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='presence-penalty'>
                    Penalidade de Presença: {settings.ai.presencePenalty}
                  </Label>
                  <Slider
                    id='presence-penalty'
                    min={0}
                    max={2}
                    step={0.1}
                    value={[settings.ai.presencePenalty as number]}
                    onValueChange={(value) =>
                      handleAIChange('presencePenalty', value[0])
                    }
                  />
                </div>
              </div>

              <div className='bg-muted/50 p-4 rounded-md'>
                <h4 className='font-medium mb-2'>
                  Dicas para Parâmetros de IA
                </h4>
                <ul className='space-y-1 text-sm'>
                  <li>
                    • Temperatura mais alta (0.7-1.0) gera respostas mais
                    criativas e variadas
                  </li>
                  <li>
                    • Temperatura mais baixa (0.1-0.3) gera respostas mais
                    consistentes e previsíveis
                  </li>
                  <li>
                    • Aumente o máximo de tokens para respostas mais longas e
                    detalhadas
                  </li>
                  <li>
                    • Ajuste as penalidades para evitar repetições e melhorar a
                    qualidade das respostas
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='notifications'>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='notify-new'
                  checked={settings.notifications.notifyNewConversations}
                  onCheckedChange={(checked) =>
                    handleNotificationsChange('notifyNewConversations', checked)
                  }
                />
                <Label htmlFor='notify-new'>Notificar novas conversas</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='notify-transfer'
                  checked={settings.notifications.notifyTransferRequests}
                  onCheckedChange={(checked) =>
                    handleNotificationsChange('notifyTransferRequests', checked)
                  }
                />
                <Label htmlFor='notify-transfer'>
                  Notificar solicitações de transferência
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='notify-hours'
                  checked={settings.notifications.notifyAfterHours}
                  onCheckedChange={(checked) =>
                    handleNotificationsChange('notifyAfterHours', checked)
                  }
                />
                <Label htmlFor='notify-hours'>
                  Notificar mensagens fora do horário
                </Label>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='notify-email'>Email para Notificações</Label>
                <Input
                  id='notify-email'
                  type='email'
                  value={settings.notifications.notifyEmail}
                  onChange={(e) =>
                    handleNotificationsChange('notifyEmail', e.target.value)
                  }
                  placeholder='Ex: contato@facilize.com'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='notify-phone'>Telefone para Notificações</Label>
                <Input
                  id='notify-phone'
                  value={settings.notifications.notifyPhone}
                  onChange={(e) =>
                    handleNotificationsChange('notifyPhone', e.target.value)
                  }
                  placeholder='Ex: +5511999999999'
                />
                <p className='text-xs text-muted-foreground'>
                  Inclua o código do país (Ex: +55 para Brasil)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='whatsapp'>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='wa-phone'>Número de Telefone do WhatsApp</Label>
                <Input
                  id='wa-phone'
                  value={settings.whatsapp.phoneNumber}
                  onChange={(e) =>
                    handleWhatsAppChange('phoneNumber', e.target.value)
                  }
                  placeholder='Ex: +5511999999999'
                />
                <p className='text-xs text-muted-foreground'>
                  Número de telefone que será usado para o WhatsApp Business.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='wa-name'>Nome de Exibição</Label>
                <Input
                  id='wa-name'
                  value={settings.whatsapp.displayName}
                  onChange={(e) =>
                    handleWhatsAppChange('displayName', e.target.value)
                  }
                  placeholder='Ex: Facilize'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='wa-image'>URL da Imagem de Perfil</Label>
                <Input
                  id='wa-image'
                  value={settings.whatsapp.profileImage}
                  onChange={(e) =>
                    handleWhatsAppChange('profileImage', e.target.value)
                  }
                  placeholder='Ex: https://example.com/profile.jpg'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='wa-business'
                  checked={settings.whatsapp.businessAccount}
                  onCheckedChange={(checked) =>
                    handleWhatsAppChange('businessAccount', checked)
                  }
                />
                <Label htmlFor='wa-business'>
                  Usar conta WhatsApp Business
                </Label>
              </div>

              {settings.whatsapp.businessAccount && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='wa-business-id'>ID da Conta Business</Label>
                    <Input
                      id='wa-business-id'
                      value={settings.whatsapp.businessId}
                      onChange={(e) =>
                        handleWhatsAppChange('businessId', e.target.value)
                      }
                      placeholder='Ex: 123456789'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='wa-api-key'>
                      Chave de API do WhatsApp Business
                    </Label>
                    <Input
                      id='wa-api-key'
                      type='password'
                      value={settings.whatsapp.apiKey}
                      onChange={(e) =>
                        handleWhatsAppChange('apiKey', e.target.value)
                      }
                      placeholder='Insira sua chave de API'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Você pode obter esta chave no painel do WhatsApp Business
                      API.
                    </p>
                  </div>
                </>
              )}

              <div className='bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-amber-800 dark:text-amber-300'>
                <h4 className='font-medium mb-2 flex items-center'>
                  <AlertCircle className='h-4 w-4 mr-2' />
                  Importante
                </h4>
                <p className='text-sm'>
                  Para usar o WhatsApp Business API, você precisa ter uma conta
                  aprovada pelo WhatsApp. Saiba mais sobre o processo de
                  aprovação na
                  <a
                    href='https://business.whatsapp.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline ml-1'
                  >
                    página oficial do WhatsApp Business
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
