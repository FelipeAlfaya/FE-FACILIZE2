'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Download, Calendar, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BillingTab() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePlan = () => {
    router.push('/dashboard/plans')
  }

  const downloadInvoice = (invoiceId: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would trigger a file download
      console.log(`Downloading invoice ${invoiceId}`)
    }, 1000)
  }

  return (
    <div className='space-y-8'>
      <h2 className='text-xl font-bold'>Informações de Faturamento</h2>

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Plano Atual</h3>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <h4 className='text-xl font-bold'>Plano Profissional</h4>
                <Badge className='bg-blue-500 hover:bg-blue-600'>Ativo</Badge>
              </div>
              <p className='text-gray-500 dark:text-gray-400 mt-1'>
                Faturamento mensal • Próxima cobrança em 15/05/2023
              </p>
              <ul className='mt-4 space-y-2'>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span>Até 100 clientes</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span>Emissão ilimitada de notas fiscais</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span>Agendamento online</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  <span>Relatórios avançados</span>
                </li>
              </ul>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-center md:text-right'>
                <span className='text-3xl font-bold'>R$ 99,90</span>
                <span className='text-gray-500 dark:text-gray-400'>/mês</span>
              </div>
              <Button onClick={handleChangePlan}>Alterar Plano</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>Método de Pagamento</h3>
          <div className='flex items-center gap-4 p-4 border rounded-md'>
            <CreditCard className='h-8 w-8 text-gray-500' />
            <div>
              <p className='font-medium'>Mastercard terminando em 4242</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Expira em 12/2025
              </p>
            </div>
          </div>
          <div className='mt-4 flex gap-2'>
            <Button variant='outline'>Atualizar Método de Pagamento</Button>
            <Button variant='outline'>Adicionar Novo Cartão</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium'>Histórico de Faturas</h3>
          </div>
          <div className='space-y-4'>
            {[
              {
                id: 'INV-2023-001',
                date: '01/05/2023',
                amount: 'R$ 99,90',
                status: 'Pago',
              },
              {
                id: 'INV-2023-002',
                date: '01/04/2023',
                amount: 'R$ 99,90',
                status: 'Pago',
              },
              {
                id: 'INV-2023-003',
                date: '01/03/2023',
                amount: 'R$ 99,90',
                status: 'Pago',
              },
            ].map((invoice) => (
              <div
                key={invoice.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md'
              >
                <div className='flex items-center space-x-3'>
                  <Calendar className='h-5 w-5 text-gray-500' />
                  <div>
                    <p className='font-medium'>{invoice.id}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {invoice.date}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='font-medium'>{invoice.amount}</p>
                    <Badge
                      variant='outline'
                      className='bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => downloadInvoice(invoice.id)}
                    disabled={isLoading}
                  >
                    <Download className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className='bg-gray-50 dark:bg-gray-800 border-t px-6 py-4'>
          <Button variant='outline' className='w-full'>
            Ver Todas as Faturas
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-medium mb-4'>
            Informações de Faturamento
          </h3>
          <div className='space-y-4'>
            <div>
              <p className='font-medium'>Endereço de Cobrança</p>
              <p className='text-gray-500 dark:text-gray-400'>
                Felipe da Silva
                <br />
                Av. Paulista, 1000 - Bela Vista
                <br />
                São Paulo, SP - 01310-100
                <br />
                Brasil
              </p>
            </div>
            <div>
              <p className='font-medium'>Informações Fiscais</p>
              <p className='text-gray-500 dark:text-gray-400'>
                CPF: 123.456.789-00
              </p>
            </div>
          </div>
          <Button variant='outline' className='mt-4'>
            Atualizar Informações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
