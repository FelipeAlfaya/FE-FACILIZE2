import { DashboardHeader } from '@/app/dashboard/components/dashboard-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { UserDashboard } from '@/app/dashboard/components/user-dashboard'
import { ProviderDashboard } from '@/app/dashboard/components/provider-dashboard'

export default function Dashboard() {
  return (
    <div className='min-h-screen bg-white'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <Tabs defaultValue='user' className='w-full'>
          <TabsList className='grid w-full max-w-md mx-auto grid-cols-2 mb-8'>
            <TabsTrigger value='user'>Encontrar Provedores</TabsTrigger>
            <TabsTrigger value='provider'>Minha Agenda</TabsTrigger>
          </TabsList>
          <TabsContent value='user'>
            <UserDashboard />
          </TabsContent>
          <TabsContent value='provider'>
            <ProviderDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
