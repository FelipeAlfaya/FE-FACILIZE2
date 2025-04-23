import type { Metadata } from 'next'
import { TaxCalculator } from './components/tax-calculator'

export const metadata: Metadata = {
  title: 'Calculadora de Impostos | Facilize',
  description: 'Calcule seus impostos e obrigações fiscais',
}

export default function TaxCalculatorPage() {
  return <TaxCalculator />
}
