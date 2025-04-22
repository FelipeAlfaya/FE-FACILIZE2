'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { ChatbotServices } from './chatbot-services'
import { ChatbotPrompts } from './chatbot-prompts'
import { ChatbotSettings } from './chatbot-settings'
import { ChatbotAnalytics } from './chatbot-analytics'

export function ChatbotTabs() {
  return (
    <Tabs defaultValue='services' className='space-y-4'>
      <TabsList className='grid w-full max-w-3xl grid-cols-4'>
        <TabsTrigger value='services'>Serviços</TabsTrigger>
        <TabsTrigger value='prompts'>Mensagens</TabsTrigger>
        <TabsTrigger value='analytics'>Análises</TabsTrigger>
        <TabsTrigger value='settings'>Configurações</TabsTrigger>
      </TabsList>
      <TabsContent value='services'>
        <Card className='p-6'>
          <ChatbotServices />
        </Card>
      </TabsContent>
      <TabsContent value='prompts'>
        <Card className='p-6'>
          <ChatbotPrompts />
        </Card>
      </TabsContent>
      <TabsContent value='analytics'>
        <Card className='p-6'>
          <ChatbotAnalytics />
        </Card>
      </TabsContent>
      <TabsContent value='settings'>
        <Card className='p-6'>
          <ChatbotSettings />
        </Card>
      </TabsContent>
    </Tabs>
  )
}
