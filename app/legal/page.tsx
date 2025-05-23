import type { Metadata } from 'next'
import { LegalTabs } from './components/legal-tabs'

export const metadata: Metadata = {
  title: 'Termos e Privacidade | Facilize',
  description:
    'Termos de serviço e política de privacidade da plataforma Facilize',
}

export default function LegalPage() {
  return (
    <div className='container mx-auto py-8 px-4 md:px-6'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center'>
          Termos e Política de Privacidade
        </h1>
        <p className='text-muted-foreground mb-8 text-center'>
          Última atualização: 24 de abril de 2025
        </p>
        <LegalTabs />
      </div>
    </div>
  )
}
