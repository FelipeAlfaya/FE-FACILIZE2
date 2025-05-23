'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TermsOfService } from './terms-of-service'
import { PrivacyPolicy } from './privacy-policy'

export function LegalTabs() {
  const [activeTab, setActiveTab] = useState('terms')

  return (
    <Tabs
      defaultValue='terms'
      value={activeTab}
      onValueChange={setActiveTab}
      className='w-full'
    >
      <div className='flex justify-center mb-6'>
        <TabsList className='grid w-full max-w-md grid-cols-2'>
          <TabsTrigger value='terms'>Termos de Serviço</TabsTrigger>
          <TabsTrigger value='privacy'>Política de Privacidade</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='terms' className='mt-6'>
        <TermsOfService />
      </TabsContent>
      <TabsContent value='privacy' className='mt-6'>
        <PrivacyPolicy />
      </TabsContent>
    </Tabs>
  )
}
