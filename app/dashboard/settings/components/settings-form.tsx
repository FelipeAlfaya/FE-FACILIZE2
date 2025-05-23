'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { AppearanceForm } from './appearance-form'
import { NotificationsForm } from './notifications-form'
import { AccountForm } from './account-form'
import { SecurityForm } from './security-form'

export function SettingsTabs() {
  return (
    <Tabs defaultValue='appearance' className='space-y-4'>
      <TabsList className='grid w-full max-w-2xl grid-cols-4'>
        <TabsTrigger value='appearance'>Aparência</TabsTrigger>
        <TabsTrigger value='account'>Conta</TabsTrigger>
        <TabsTrigger value='notifications'>Notificações</TabsTrigger>
        <TabsTrigger value='security'>Segurança</TabsTrigger>
      </TabsList>
      <TabsContent value='appearance'>
        <Card className='p-6'>
          <AppearanceForm />
        </Card>
      </TabsContent>
      <TabsContent value='account'>
        <Card className='p-6'>
          <AccountForm />
        </Card>
      </TabsContent>
      <TabsContent value='notifications'>
        <Card className='p-6'>
          <NotificationsForm />
        </Card>
      </TabsContent>
      <TabsContent value='security'>
        <Card className='p-6'>
          <SecurityForm />
        </Card>
      </TabsContent>
    </Tabs>
  )
}

