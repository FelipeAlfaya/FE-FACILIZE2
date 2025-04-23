// app/dashboard/profile/page.tsx
import { ProfileHeader } from './components/profile-header'
import { ProfileForm } from './components/profile-form'
import { SecurityTab } from './components/security-tab'
import { BillingTab } from './components/billling-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { DashboardHeader } from '../components/dashboard-header'
import { UserProvider } from '@/context/UserContext'

export default function ProfilePage() {
  return (
    <UserProvider>
      <div className='min-h-screen bg-background'>
        <DashboardHeader />
        <ProfileContent />
      </div>
    </UserProvider>
  )
}

function ProfileContent() {
  return (
    <main className='container mx-auto px-4 py-6'>
      <ProfileHeader />

      <Tabs defaultValue='personal' className='mt-8'>
        <TabsList className='grid w-full max-w-md mx-auto grid-cols-3 mb-8'>
          <TabsTrigger value='personal'>Dados Pessoais</TabsTrigger>
          <TabsTrigger value='security'>Segurança</TabsTrigger>
          <TabsTrigger value='billing'>Faturamento</TabsTrigger>
        </TabsList>

        <TabsContent value='personal'>
          <Card className='p-6'>
            <ProfileForm />
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Card className='p-6'>
            <SecurityTab />
          </Card>
        </TabsContent>

        <TabsContent value='billing'>
          <Card className='p-6'>
            <BillingTab />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
