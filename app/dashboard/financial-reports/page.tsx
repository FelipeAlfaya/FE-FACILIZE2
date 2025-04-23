import type { Metadata } from 'next'
import { FinancialReports } from '../components/financial-reports'

export const metadata: Metadata = {
  title: 'Relatórios Financeiros | Facilize',
  description: 'Gere e baixe relatórios financeiros detalhados',
}

export default function FinancialReportsPage() {
  return <FinancialReports />
}
