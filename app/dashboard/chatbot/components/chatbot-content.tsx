'use client'

import { DashboardHeader } from '../../components/dashboard-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChatbotServices } from './chatbot-services'
import { ChatbotPrompts } from './chatbot-prompts'
import { ChatbotAnalytics } from './chatbot-analytics'
import { ChatbotSettings } from './chatbot-settings'
import { useAuthCheck } from '@/hooks/useAuthCheck'

export function ChatbotContent() {
  useAuthCheck('PROVIDER')

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Painel de Controle do WhatsApp
          </h1>
          <p className='text-muted-foreground mt-2'>
            Configure e gerencie seu chatbot de WhatsApp para agendamentos e
            atendimento ao cliente.
          </p>
        </div>

        <Tabs defaultValue='services' className='space-y-6'>
          <TabsList className='grid w-full max-w-2xl grid-cols-4'>
            <TabsTrigger value='services'>Serviços</TabsTrigger>
            <TabsTrigger value='prompts'>Prompts</TabsTrigger>
            <TabsTrigger value='analytics'>Análises</TabsTrigger>
            <TabsTrigger value='settings'>Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value='services'>
            <Card>
              <CardHeader>
                <CardTitle>Serviços e Tarefas</CardTitle>
                <CardDescription>
                  Configure os serviços e tarefas que o chatbot pode realizar
                  para seus clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotServices />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='prompts'>
            <Card>
              <CardHeader>
                <CardTitle>Prompts de IA</CardTitle>
                <CardDescription>
                  Personalize as mensagens e prompts que a IA usará para
                  interagir com seus clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotPrompts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='analytics'>
            <Card>
              <CardHeader>
                <CardTitle>Análises e Estatísticas</CardTitle>
                <CardDescription>
                  Visualize estatísticas de uso e desempenho do seu chatbot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='settings'>
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Gerencie as configurações gerais do seu chatbot de WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

