'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, RefreshCw, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

export function ChatbotPrompts() {
  const [activeTab, setActiveTab] = useState('welcome')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [prompts, setPrompts] = useState({
    welcome: {
      title: 'Mensagem de Boas-vindas',
      description:
        'Esta mensagem é enviada quando um cliente inicia uma conversa com o chatbot.',
      prompt:
        'Você é um assistente virtual da Facilize, uma plataforma para profissionais e prestadores de serviços. Seu nome é Fácil. Seja sempre cordial, profissional e prestativo. Quando um cliente iniciar uma conversa, apresente-se e pergunte como pode ajudar. Mencione que você pode auxiliar com agendamentos, verificação de disponibilidade, informações sobre serviços e responder perguntas frequentes.',
      variables: ['nome_cliente', 'nome_empresa', 'horario_funcionamento'],
    },
    scheduling: {
      title: 'Agendamento',
      description: 'Prompt usado quando o cliente deseja agendar um serviço.',
      prompt:
        'O cliente deseja agendar um serviço. Colete as seguintes informações de forma conversacional: nome completo, tipo de serviço desejado, data preferida (ofereça algumas opções se o cliente não souber) e horário preferido. Após coletar todas as informações, confirme os detalhes com o cliente antes de finalizar o agendamento. Se houver conflitos de horário, sugira alternativas próximas.',
      variables: [
        'servicos_disponiveis',
        'horarios_disponiveis',
        'datas_disponiveis',
      ],
    },
    faq: {
      title: 'Perguntas Frequentes',
      description:
        'Prompt usado para responder perguntas frequentes dos clientes.',
      prompt:
        'O cliente fez uma pergunta sobre os serviços. Responda de forma clara e concisa, usando as informações da base de conhecimento. Se a pergunta não estiver na base de conhecimento, informe educadamente que você precisará consultar a equipe e sugira que o cliente aguarde o contato de um atendente humano ou deixe um número para retorno.',
      variables: ['base_conhecimento', 'contato_suporte'],
    },
    followup: {
      title: 'Acompanhamento',
      description: 'Mensagem enviada para acompanhamento após um serviço.',
      prompt:
        'Envie uma mensagem de acompanhamento após a conclusão de um serviço. Pergunte ao cliente sobre sua experiência, se está satisfeito com o serviço prestado e se há algo mais em que possamos ajudar. Agradeça pela confiança e mencione que estamos à disposição para futuros atendimentos.',
      variables: [
        'nome_cliente',
        'servico_realizado',
        'data_servico',
        'nome_profissional',
      ],
    },
    fallback: {
      title: 'Fallback',
      description:
        'Mensagem enviada quando o chatbot não entende a solicitação do cliente.',
      prompt:
        'Você não entendeu a solicitação do cliente. Peça desculpas pela confusão e solicite que o cliente reformule a pergunta ou escolha entre as opções de serviços disponíveis. Ofereça a opção de falar com um atendente humano se o cliente preferir.',
      variables: ['opcoes_servicos', 'contato_suporte'],
    },
  })

  const handleSavePrompts = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      toast.success('Prompts salvos com sucesso!')

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handlePromptChange = (type: string, value: string) => {
    setPrompts({
      ...prompts,
      [activeTab]: {
        ...prompts[activeTab as keyof typeof prompts],
        prompt: value,
      },
    })
  }

  const handleTestPrompt = () => {
    toast.info('Testando prompt...', {
      description: 'Esta funcionalidade estará disponível em breve.',
    })
  }

  return (
    <div className='space-y-6'>
      {showSuccess && (
        <Alert className='bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Prompts salvos com sucesso!</AlertDescription>
        </Alert>
      )}

      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>Prompts de IA</h3>
          <p className='text-sm text-muted-foreground'>
            Personalize as instruções que a IA usará para gerar respostas para
            seus clientes.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleTestPrompt}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Testar
          </Button>
          <Button onClick={handleSavePrompts} disabled={isLoading}>
            <Save className='h-4 w-4 mr-2' />
            {isLoading ? 'Salvando...' : 'Salvar Prompts'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid grid-cols-5 mb-4'>
          <TabsTrigger value='welcome'>Boas-vindas</TabsTrigger>
          <TabsTrigger value='scheduling'>Agendamento</TabsTrigger>
          <TabsTrigger value='faq'>FAQ</TabsTrigger>
          <TabsTrigger value='followup'>Acompanhamento</TabsTrigger>
          <TabsTrigger value='fallback'>Fallback</TabsTrigger>
        </TabsList>

        {Object.entries(prompts).map(([key, prompt]) => (
          <TabsContent key={key} value={key} className='space-y-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium'>{prompt.title}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {prompt.description}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor={`prompt-${key}`}>Prompt para IA</Label>
                    <Textarea
                      id={`prompt-${key}`}
                      value={prompt.prompt}
                      onChange={(e) => handlePromptChange(key, e.target.value)}
                      placeholder='Insira as instruções para a IA...'
                      rows={8}
                      className='font-mono text-sm'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Este prompt será usado para instruir a IA sobre como
                      responder ao cliente.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label>Variáveis Disponíveis</Label>
                    <div className='flex flex-wrap gap-2'>
                      {prompt.variables.map((variable) => (
                        <Badge key={variable} variant='outline'>
                          {`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Estas variáveis serão substituídas por valores reais
                      quando o chatbot enviar a mensagem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className='bg-muted/50 p-4 rounded-md'>
        <h4 className='font-medium mb-2'>Dicas para Prompts Eficazes</h4>
        <ul className='space-y-1 text-sm'>
          <li>
            • Seja específico sobre o tom e estilo de comunicação desejado
          </li>
          <li>
            • Inclua exemplos de como a IA deve responder em diferentes
            situações
          </li>
          <li>
            • Defina claramente quais informações a IA deve coletar dos clientes
          </li>
          <li>
            • Estabeleça limites sobre o que a IA pode e não pode fazer ou
            prometer
          </li>
          <li>
            • Use variáveis para personalizar as mensagens com informações do
            cliente
          </li>
        </ul>
      </div>
    </div>
  )
}
