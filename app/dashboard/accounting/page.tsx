import type { Metadata } from 'next'
import { AccountingDashboard } from './components/accounting-dashboard'

export const metadata: Metadata = {
  title: 'Contabilidade | Facilize',
  description: 'Gerencie suas finanças e contabilidade',
}

export default function AccountingPage() {
  return <AccountingDashboard />
}
