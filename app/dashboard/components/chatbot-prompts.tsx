'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Check, Save } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type PromptTemplate = {
  id: string
  name: string
  content: string
  variables: string[]
}

const initialPrompts: Record<string, PromptTemplate[]> = {
  welcome: [
    {
      id: 'welcome-1',
      name: 'Boas-vindas Padrão',
      content:
        'Olá! Bem-vindo ao atendimento da Facilize. Eu sou o assistente virtual e estou aqui para ajudar com agendamentos e informações. Como posso ajudar você hoje?',
      variables: [],
    },
    {
      id: 'welcome-2',
      name: 'Boas-vindas Personalizada',
      content:
        'Olá {customerName}! Bem-vindo ao atendimento da Facilize. Eu sou o assistente virtual e estou aqui para ajudar com agendamentos e informações. Como posso ajudar você hoje?',
      variables: ['customerName'],
    },
  ],
  scheduling: [
    {
      id: 'scheduling-1',
      name: 'Confirmação de Agendamento',
      content:
        'Ótimo! Seu agendamento com {providerName} foi confirmado para o dia {appointmentDate} às {appointmentTime}. Você receberá um lembrete 24 horas antes. Posso ajudar com mais alguma coisa?',
      variables: ['providerName', 'appointmentDate', 'appointmentTime'],
    },
    {
      id: 'scheduling-2',
      name: 'Horários Disponíveis',
      content:
        'Para {service} com {providerName}, temos os seguintes horários disponíveis:\n\n{availableTimes}\n\nQual horário seria melhor para você?',
      variables: ['service', 'providerName', 'availableTimes'],
    },
  ],
  followup: [
    {
      id: 'followup-1',
      name: 'Lembrete de Agendamento',
      content:
        'Olá {customerName}! Este é um lembrete do seu agendamento amanhã, dia {appointmentDate} às {appointmentTime} com {providerName}. Por favor, confirme sua presença respondendo SIM ou avise com antecedência caso precise reagendar.',
      variables: [
        'customerName',
        'appointmentDate',
        'appointmentTime',
        'providerName',
      ],
    },
  ],
  fallback: [
    {
      id: 'fallback-1',
      name: 'Não Entendi',
      content:
        'Desculpe, não consegui entender sua solicitação. Você pode tentar novamente ou escolher uma das opções abaixo:\n\n1. Agendar consulta\n2. Verificar horários disponíveis\n3. Cancelar agendamento\n4. Falar com atendente humano',
      variables: [],
    },
  ],
}

export function ChatbotPrompts() {
  const [promptCategory, setPromptCategory] = useState('welcome')
  const [prompts, setPrompts] =
    useState<Record<string, PromptTemplate[]>>(initialPrompts)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [editedPrompt, setEditedPrompt] = useState<PromptTemplate | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSelectPrompt = (id: string) => {
    const prompt = prompts[promptCategory].find((p) => p.id === id)
    if (prompt) {
      setSelectedPrompt(id)
      setEditedPrompt({ ...prompt })
    }
  }

  const handleSavePrompt = () => {
    if (!editedPrompt) return

    const updatedPrompts = { ...prompts }
    const promptIndex = updatedPrompts[promptCategory].findIndex(
      (p) => p.id === editedPrompt.id
    )

    if (promptIndex >= 0) {
      updatedPrompts[promptCategory][promptIndex] = editedPrompt
    }

    setPrompts(updatedPrompts)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleContentChange = (content: string) => {
    if (!editedPrompt) return

    // Extract variables from content (format: {variableName})
    const variableRegex = /{([^}]+)}/g
    const matches = content.matchAll(variableRegex)
    const variables: string[] = []

    for (const match of matches) {
      if (match[1] && !variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    setEditedPrompt({ ...editedPrompt, content, variables })
  }

  const handleTestPrompt = () => {
    if (!editedPrompt) return

    // Create a sample data object with the variables
    const sampleData: Record<string, string> = {}
    editedPrompt.variables.forEach((variable) => {
      sampleData[variable] = `[${variable}]`
    })

    // Replace variables in the content
    let testContent = editedPrompt.content
    Object.entries(sampleData).forEach(([key, value]) => {
      testContent = testContent.replace(new RegExp(`{${key}}`, 'g'), value)
    })

    alert('Visualização da mensagem:\n\n' + testContent)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-bold mb-4'>Modelos de Mensagens</h2>
        <p className='text-muted-foreground mb-6'>
          Configure as mensagens que o chatbot enviará aos clientes em
          diferentes situações.
        </p>
      </div>

      {showSuccess && (
        <Alert className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50'>
          <Check className='h-4 w-4' />
          <AlertDescription>
            Modelo de mensagem salvo com sucesso!
          </AlertDescription>
        </Alert>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <div className='space-y-4'>
            <Label>Categoria de Mensagem</Label>
            <Tabs
              value={promptCategory}
              onValueChange={setPromptCategory}
              className='w-full'
            >
              <TabsList className='grid grid-cols-2 mb-4'>
                <TabsTrigger value='welcome'>Boas-vindas</TabsTrigger>
                <TabsTrigger value='scheduling'>Agendamento</TabsTrigger>
              </TabsList>
              <TabsList className='grid grid-cols-2'>
                <TabsTrigger value='followup'>Acompanhamento</TabsTrigger>
                <TabsTrigger value='fallback'>Fallback</TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator className='my-4' />

            <div className='space-y-2'>
              <Label>Selecione um modelo</Label>
              <Select
                value={selectedPrompt || ''}
                onValueChange={handleSelectPrompt}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um modelo' />
                </SelectTrigger>
                <SelectContent>
                  {prompts[promptCategory].map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='md:col-span-2'>
          {editedPrompt ? (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='prompt-name'>Nome do Modelo</Label>
                <Input
                  id='prompt-name'
                  value={editedPrompt.name}
                  onChange={(e) =>
                    setEditedPrompt({ ...editedPrompt, name: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='prompt-content'>Conteúdo da Mensagem</Label>
                <Textarea
                  id='prompt-content'
                  value={editedPrompt.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={8}
                />
                <p className='text-xs text-muted-foreground'>
                  Use {'{variável}'} para inserir dados dinâmicos. Ex:{' '}
                  {'{customerName}'}, {'{appointmentDate}'}
                </p>
              </div>

              {editedPrompt.variables.length > 0 && (
                <div className='space-y-2'>
                  <Label>Variáveis Detectadas</Label>
                  <div className='flex flex-wrap gap-2'>
                    {editedPrompt.variables.map((variable) => (
                      <div
                        key={variable}
                        className='bg-muted px-2 py-1 rounded-md text-sm'
                      >
                        {variable}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex justify-end space-x-2 pt-4'>
                <Button variant='outline' onClick={handleTestPrompt}>
                  Visualizar
                </Button>
                <Button onClick={handleSavePrompt}>
                  <Save className='h-4 w-4 mr-2' />
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-center h-full min-h-[300px] border rounded-md'>
              <p className='text-muted-foreground'>
                Selecione um modelo para editar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
