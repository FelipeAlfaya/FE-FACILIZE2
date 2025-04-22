import { DashboardHeader } from '../components/dashboard-header'
import { ProvidersList } from '../components/providers-list'
import { ProviderFilters } from '../components/providers-filters'

export default function ProvidersPage() {
  return (
    <div className='min-h-screen bg-white'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2'>Provedores</h1>
          <p className='text-gray-600'>
            Encontre os melhores profissionais para seus serviços
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='md:col-span-1'>
            <ProviderFilters />
          </div>
          <div className='md:col-span-3'>
            <ProvidersList />
          </div>
        </div>
      </main>
    </div>
  )
}
