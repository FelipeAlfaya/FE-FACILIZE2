'use client'

import { DashboardHeader } from '../components/dashboard-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function DevelopmentPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <DashboardHeader />

      <main className='flex flex-1 items-center justify-center px-4 py-6 bg-background'>
        <div className='text-center space-y-8 max-w-xl'>
          <div>
            <h1 className='text-4xl font-bold tracking-tight text-primary'>
              Página em Desenvolvimento 🚧
            </h1>
            <p className='text-muted-foreground mt-4 text-lg'>
              Esta funcionalidade ainda está sendo construída. Em breve você
              poderá acessar este conteúdo completo aqui.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>O que você pode esperar?</CardTitle>
              <CardDescription>
                Estamos trabalhando para entregar uma experiência completa.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2 text-muted-foreground'>
              <p>✔️ Funcionalidades modernas e intuitivas.</p>
              <p>✔️ Experiência otimizada para o seu uso.</p>
              <p>✔️ Integrações com ferramentas inteligentes.</p>
              <p>✔️ Melhorias contínuas com base no seu feedback.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

