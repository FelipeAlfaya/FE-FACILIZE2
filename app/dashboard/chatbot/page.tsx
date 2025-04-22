import { DashboardHeader } from '../components/dashboard-header'
import { ChatbotTabs } from '../components/chatbot-tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { MessageSquareText } from 'lucide-react'

export default function ChatbotPage() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-6'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard/chatbot'>
                  Chatbot WhatsApp
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='mb-8 flex items-center gap-3'>
          <div className='h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
            <MessageSquareText className='h-5 w-5 text-green-600 dark:text-green-500' />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>Chatbot WhatsApp</h1>
            <p className='text-muted-foreground'>
              Configure e gerencie seu assistente virtual para agendamentos
            </p>
          </div>
        </div>

        <ChatbotTabs />
      </main>
    </div>
  )
}
