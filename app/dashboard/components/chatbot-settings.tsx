'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, Save } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ChatbotSettings() {
  const [settings, setSettings] = useState({
    general: {
      botName: 'Facilize Assistant',
      businessHours: '09:00 - 18:00',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      autoReply: true,
      transferToHuman: true,
      transferThreshold: '3',
    },
    ai: {
      model: 'gpt-4o',
      temperature: '0.7',
      maxTokens: '1024',
      systemPrompt:
        'Você é um assistente virtual da Facilize, uma plataforma para agendamento de serviços profissionais. Seu objetivo é ajudar os clientes a agendar, verificar e cancelar compromissos de forma eficiente e amigável. Mantenha suas respostas concisas, claras e úteis. Sempre confirme os detalhes importantes com o cliente antes de finalizar qualquer agendamento.',
    },
    notifications: {
      notifyNewConversation: true,
      notifyTransferRequest: true,
      notifyAfterHours: true,
      adminPhoneNumber: '+5511999999999',
      adminEmail: 'admin@facilize.com',
    },
    whatsapp: {
      phoneNumber: '+5511988888888',
      displayName: 'Facilize',
      profileImage: 'default',
      verificationStatus: 'verified',
      apiKey: 'wh_123456789abcdef',
    },
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const handleSaveSettings = () => {
    // Simulate API call to save settings
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 500)
  }

  const updateSettings = (
    category: keyof typeof settings,
    field: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-bold mb-4'>Configurações do Chatbot</h2>
        <p className='text-muted-foreground mb-6'>
          Configure as preferências e comportamentos do seu assistente virtual
          WhatsApp.
        </p>
      </div>

      {showSuccess && (
        <Alert className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50'>
          <Check className='h-4 w-4' />
          <AlertDescription>Configurações salvas com sucesso!</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue='general' className='space-y-4'>
        <TabsList className='grid w-full max-w-2xl grid-cols-4'>
          <TabsTrigger value='general'>Geral</TabsTrigger>
          <TabsTrigger value='ai'>IA</TabsTrigger>
          <TabsTrigger value='notifications'>Notificações</TabsTrigger>
          <TabsTrigger value='whatsapp'>WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as preferências básicas do chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='bot-name'>Nome do Chatbot</Label>
                  <Input
                    id='bot-name'
                    value={settings.general.botName}
                    onChange={(e) =>
                      updateSettings('general', 'botName', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='business-hours'>
                    Horário de Funcionamento
                  </Label>
                  <Input
                    id='business-hours'
                    value={settings.general.businessHours}
                    onChange={(e) =>
                      updateSettings('general', 'businessHours', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='language'>Idioma</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) =>
                      updateSettings('general', 'language', value)
                    }
                  >
                    <SelectTrigger id='language'>
                      <SelectValue placeholder='Selecione o idioma' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='pt-BR'>Português (Brasil)</SelectItem>
                      <SelectItem value='en-US'>English (US)</SelectItem>
                      <SelectItem value='es'>Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='timezone'>Fuso Horário</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      updateSettings('general', 'timezone', value)
                    }
                  >
                    <SelectTrigger id='timezone'>
                      <SelectValue placeholder='Selecione o fuso horário' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='America/Sao_Paulo'>
                        Brasília (GMT-3)
                      </SelectItem>
                      <SelectItem value='America/Manaus'>
                        Manaus (GMT-4)
                      </SelectItem>
                      <SelectItem value='America/Rio_Branco'>
                        Rio Branco (GMT-5)
                      </SelectItem>
                      <SelectItem value='America/Noronha'>
                        Fernando de Noronha (GMT-2)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='auto-reply'>Resposta Automática</Label>
                    <p className='text-sm text-muted-foreground'>
                      Responder automaticamente a todas as mensagens recebidas
                    </p>
                  </div>
                  <Switch
                    id='auto-reply'
                    checked={settings.general.autoReply}
                    onCheckedChange={(checked) =>
                      updateSettings('general', 'autoReply', checked)
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='transfer-human'>
                      Transferência para Humano
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      Permitir que o chatbot transfira conversas para atendentes
                      humanos
                    </p>
                  </div>
                  <Switch
                    id='transfer-human'
                    checked={settings.general.transferToHuman}
                    onCheckedChange={(checked) =>
                      updateSettings('general', 'transferToHuman', checked)
                    }
                  />
                </div>

                {settings.general.transferToHuman && (
                  <div className='space-y-2 ml-6 border-l-2 pl-4 border-muted'>
                    <Label htmlFor='transfer-threshold'>
                      Limite de Tentativas
                    </Label>
                    <Select
                      value={settings.general.transferThreshold}
                      onValueChange={(value) =>
                        updateSettings('general', 'transferThreshold', value)
                      }
                    >
                      <SelectTrigger id='transfer-threshold'>
                        <SelectValue placeholder='Selecione o limite' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='2'>2 tentativas</SelectItem>
                        <SelectItem value='3'>3 tentativas</SelectItem>
                        <SelectItem value='4'>4 tentativas</SelectItem>
                        <SelectItem value='5'>5 tentativas</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-muted-foreground'>
                      Número de tentativas antes de oferecer transferência para
                      um atendente humano
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='ai'>
          <Card>
            <CardHeader>
              <CardTitle>Configurações de IA</CardTitle>
              <CardDescription>
                Configure os parâmetros do modelo de IA
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='ai-model'>Modelo de IA</Label>
                  <Select
                    value={settings.ai.model}
                    onValueChange={(value) =>
                      updateSettings('ai', 'model', value)
                    }
                  >
                    <SelectTrigger id='ai-model'>
                      <SelectValue placeholder='Selecione o modelo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='gpt-4o'>
                        GPT-4o (Recomendado)
                      </SelectItem>
                      <SelectItem value='gpt-4'>GPT-4</SelectItem>
                      <SelectItem value='gpt-3.5-turbo'>
                        GPT-3.5 Turbo
                      </SelectItem>
                      <SelectItem value='claude-3-opus'>
                        Claude 3 Opus
                      </SelectItem>
                      <SelectItem value='claude-3-sonnet'>
                        Claude 3 Sonnet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='temperature'>Temperatura</Label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      id='temperature'
                      type='number'
                      min='0'
                      max='2'
                      step='0.1'
                      value={settings.ai.temperature}
                      onChange={(e) =>
                        updateSettings('ai', 'temperature', e.target.value)
                      }
                    />
                    <div className='flex items-center'>
                      <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full'>
                        <div
                          className='h-full bg-blue-600 rounded-full'
                          style={{
                            width: `${
                              (Number(settings.ai.temperature) / 2) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Controla a aleatoriedade das respostas (0 = determinístico,
                    2 = muito aleatório)
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='max-tokens'>Máximo de Tokens</Label>
                  <Input
                    id='max-tokens'
                    type='number'
                    min='256'
                    max='4096'
                    step='128'
                    value={settings.ai.maxTokens}
                    onChange={(e) =>
                      updateSettings('ai', 'maxTokens', e.target.value)
                    }
                  />
                  <p className='text-xs text-muted-foreground'>
                    Limite máximo de tokens para cada resposta
                  </p>
                </div>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='system-prompt'>Prompt do Sistema</Label>
                <Textarea
                  id='system-prompt'
                  rows={6}
                  value={settings.ai.systemPrompt}
                  onChange={(e) =>
                    updateSettings('ai', 'systemPrompt', e.target.value)
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Instruções gerais para o modelo de IA sobre como se comportar
                  e responder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='notify-new'>Novas Conversas</Label>
                    <p className='text-sm text-muted-foreground'>
                      Receber notificação quando uma nova conversa for iniciada
                    </p>
                  </div>
                  <Switch
                    id='notify-new'
                    checked={settings.notifications.notifyNewConversation}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        'notifications',
                        'notifyNewConversation',
                        checked
                      )
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='notify-transfer'>
                      Solicitações de Transferência
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      Receber notificação quando um cliente solicitar falar com
                      um atendente humano
                    </p>
                  </div>
                  <Switch
                    id='notify-transfer'
                    checked={settings.notifications.notifyTransferRequest}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        'notifications',
                        'notifyTransferRequest',
                        checked
                      )
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='notify-hours'>Fora do Horário</Label>
                    <p className='text-sm text-muted-foreground'>
                      Receber notificação quando mensagens chegarem fora do
                      horário de funcionamento
                    </p>
                  </div>
                  <Switch
                    id='notify-hours'
                    checked={settings.notifications.notifyAfterHours}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        'notifications',
                        'notifyAfterHours',
                        checked
                      )
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='admin-phone'>
                    Telefone para Notificações
                  </Label>
                  <Input
                    id='admin-phone'
                    value={settings.notifications.adminPhoneNumber}
                    onChange={(e) =>
                      updateSettings(
                        'notifications',
                        'adminPhoneNumber',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='admin-email'>Email para Notificações</Label>
                  <Input
                    id='admin-email'
                    type='email'
                    value={settings.notifications.adminEmail}
                    onChange={(e) =>
                      updateSettings(
                        'notifications',
                        'adminEmail',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='whatsapp'>
          <Card>
            <CardHeader>
              <CardTitle>Configurações do WhatsApp</CardTitle>
              <CardDescription>
                Configure sua conta comercial do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='whatsapp-phone'>Número de Telefone</Label>
                  <Input
                    id='whatsapp-phone'
                    value={settings.whatsapp.phoneNumber}
                    onChange={(e) =>
                      updateSettings('whatsapp', 'phoneNumber', e.target.value)
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='whatsapp-name'>Nome de Exibição</Label>
                  <Input
                    id='whatsapp-name'
                    value={settings.whatsapp.displayName}
                    onChange={(e) =>
                      updateSettings('whatsapp', 'displayName', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Imagem de Perfil</Label>
                <RadioGroup
                  value={settings.whatsapp.profileImage}
                  onValueChange={(value) =>
                    updateSettings('whatsapp', 'profileImage', value)
                  }
                  className='grid grid-cols-4 gap-4'
                >
                  <div>
                    <RadioGroupItem
                      value='default'
                      id='profile-default'
                      className='peer sr-only'
                    />
                    <Label
                      htmlFor='profile-default'
                      className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                    >
                      <div className='w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2'>
                        <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                          F
                        </span>
                      </div>
                      <span className='text-sm'>Padrão</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value='logo'
                      id='profile-logo'
                      className='peer sr-only'
                    />
                    <Label
                      htmlFor='profile-logo'
                      className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                    >
                      <div className='w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2 overflow-hidden'>
                        <img
                          src='/logo-light.svg'
                          alt='Logo'
                          className='w-12 h-12 object-contain'
                        />
                      </div>
                      <span className='text-sm'>Logo</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value='custom'
                      id='profile-custom'
                      className='peer sr-only'
                    />
                    <Label
                      htmlFor='profile-custom'
                      className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                    >
                      <div className='w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2'>
                        <span className='text-sm text-muted-foreground'>
                          Upload
                        </span>
                      </div>
                      <span className='text-sm'>Personalizada</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='whatsapp-api'>
                  Chave da API WhatsApp Business
                </Label>
                <Input
                  id='whatsapp-api'
                  type='password'
                  value={settings.whatsapp.apiKey}
                  onChange={(e) =>
                    updateSettings('whatsapp', 'apiKey', e.target.value)
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Chave de API da sua conta WhatsApp Business
                </p>
              </div>

              <div className='flex items-center space-x-2 p-4 bg-muted/40 rounded-md'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    settings.whatsapp.verificationStatus === 'verified'
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  }`}
                ></div>
                <p className='text-sm'>
                  {settings.whatsapp.verificationStatus === 'verified'
                    ? 'Conta verificada e ativa'
                    : 'Conta pendente de verificação'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className='flex justify-end'>
        <Button onClick={handleSaveSettings}>
          <Save className='h-4 w-4 mr-2' />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
