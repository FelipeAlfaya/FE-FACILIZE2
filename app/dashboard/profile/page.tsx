import { ProfileHeader } from '../components/profile-header'
import { ProfileForm } from '../components/profile-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { DashboardHeader } from '../components/dashboard-header'

export default function ProfilePage() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
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
              <h2 className='text-xl font-bold mb-6'>Segurança da Conta</h2>
              {/* Security settings would go here */}
              <p className='text-gray-500'>
                Configurações de segurança em desenvolvimento.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value='billing'>
            <Card className='p-6'>
              <h2 className='text-xl font-bold mb-6'>
                Informações de Faturamento
              </h2>
              {/* Billing information would go here */}
              <p className='text-gray-500'>
                Informações de faturamento em desenvolvimento.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
