import { DashboardHeader } from '../components/dashboard-header'
import { PricingPlans } from '../components/pricing-plans'

export default function PlansPage() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8 text-center'>
          <h1 className='text-2xl font-bold mb-2'>Nossos Planos</h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Escolha o plano ideal para suas necessidades. Todos os planos
            incluem acesso às funcionalidades essenciais da plataforma.
          </p>
        </div>

        <PricingPlans />
      </main>
    </div>
  )
}
