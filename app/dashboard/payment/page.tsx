import { DashboardHeader } from '../components/dashboard-header'
import { PaymentFlow } from '../components/payment-flow'

export default function PaymentPage() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2'>Pagamento</h1>
          <p className='text-gray-600'>
            Escolha seu plano e método de pagamento
          </p>
        </div>

        <PaymentFlow />
      </main>
    </div>
  )
}
