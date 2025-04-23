'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { TaxResultsChart } from './tax-results-chart'
import { FinancialNavigation } from './financial-navigation'
import { TaxDetailsModal } from './tax-details-modal'

export function TaxCalculator() {
  const [taxRegime, setTaxRegime] = useState('simples')
  const [revenue, setRevenue] = useState('10000')
  const [expenses, setExpenses] = useState('3000')
  const [activity, setActivity] = useState('services')
  const [showResults, setShowResults] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const handleCalculate = () => {
    setShowResults(true)
  }

  const handleShowDetails = () => {
    setShowDetailsModal(true)
  }

  return (
    <div className='container mx-auto p-6'>
      <FinancialNavigation />

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Impostos</CardTitle>
            <CardDescription>
              Calcule os impostos devidos com base no regime tributário e
              faturamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='monthly' className='mb-6'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='monthly'>Mensal</TabsTrigger>
                <TabsTrigger value='yearly'>Anual</TabsTrigger>
              </TabsList>
              <TabsContent value='monthly' className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='tax-regime'>Regime Tributário</Label>
                  <Select value={taxRegime} onValueChange={setTaxRegime}>
                    <SelectTrigger id='tax-regime'>
                      <SelectValue placeholder='Selecione o regime tributário' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='simples'>Simples Nacional</SelectItem>
                      <SelectItem value='presumido'>Lucro Presumido</SelectItem>
                      <SelectItem value='real'>Lucro Real</SelectItem>
                      <SelectItem value='mei'>MEI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='activity'>Atividade Principal</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger id='activity'>
                      <SelectValue placeholder='Selecione a atividade principal' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='services'>
                        Prestação de Serviços
                      </SelectItem>
                      <SelectItem value='commerce'>Comércio</SelectItem>
                      <SelectItem value='industry'>Indústria</SelectItem>
                      <SelectItem value='transport'>Transporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='revenue'>Faturamento Mensal (R$)</Label>
                  <Input
                    id='revenue'
                    type='number'
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder='0,00'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='expenses'>Despesas Mensais (R$)</Label>
                  <Input
                    id='expenses'
                    type='number'
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    placeholder='0,00'
                  />
                </div>
              </TabsContent>
              <TabsContent value='yearly' className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='tax-regime-yearly'>Regime Tributário</Label>
                  <Select value={taxRegime} onValueChange={setTaxRegime}>
                    <SelectTrigger id='tax-regime-yearly'>
                      <SelectValue placeholder='Selecione o regime tributário' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='simples'>Simples Nacional</SelectItem>
                      <SelectItem value='presumido'>Lucro Presumido</SelectItem>
                      <SelectItem value='real'>Lucro Real</SelectItem>
                      <SelectItem value='mei'>MEI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='activity-yearly'>Atividade Principal</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger id='activity-yearly'>
                      <SelectValue placeholder='Selecione a atividade principal' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='services'>
                        Prestação de Serviços
                      </SelectItem>
                      <SelectItem value='commerce'>Comércio</SelectItem>
                      <SelectItem value='industry'>Indústria</SelectItem>
                      <SelectItem value='transport'>Transporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='revenue-yearly'>Faturamento Anual (R$)</Label>
                  <Input
                    id='revenue-yearly'
                    type='number'
                    value={(Number.parseFloat(revenue) * 12).toString()}
                    onChange={(e) =>
                      setRevenue(
                        (Number.parseFloat(e.target.value) / 12).toString()
                      )
                    }
                    placeholder='0,00'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='expenses-yearly'>Despesas Anuais (R$)</Label>
                  <Input
                    id='expenses-yearly'
                    type='number'
                    value={(Number.parseFloat(expenses) * 12).toString()}
                    onChange={(e) =>
                      setExpenses(
                        (Number.parseFloat(e.target.value) / 12).toString()
                      )
                    }
                    placeholder='0,00'
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={handleCalculate} className='w-full'>
              Calcular Impostos
            </Button>
          </CardContent>
        </Card>

        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado do Cálculo</CardTitle>
              <CardDescription>
                {taxRegime === 'simples'
                  ? 'Simples Nacional'
                  : taxRegime === 'presumido'
                  ? 'Lucro Presumido'
                  : taxRegime === 'real'
                  ? 'Lucro Real'
                  : 'MEI'}
                {' - '}
                {activity === 'services'
                  ? 'Prestação de Serviços'
                  : activity === 'commerce'
                  ? 'Comércio'
                  : activity === 'industry'
                  ? 'Indústria'
                  : 'Transporte'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Faturamento</p>
                  <p className='text-2xl font-bold'>
                    R${' '}
                    {Number.parseFloat(revenue).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>
                    Total de Impostos
                  </p>
                  <p className='text-2xl font-bold text-red-600'>
                    R${' '}
                    {(Number.parseFloat(revenue) * 0.16).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span>IRPJ</span>
                  <span>
                    R${' '}
                    {(Number.parseFloat(revenue) * 0.048).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>CSLL</span>
                  <span>
                    R${' '}
                    {(Number.parseFloat(revenue) * 0.0288).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>PIS</span>
                  <span>
                    R${' '}
                    {(Number.parseFloat(revenue) * 0.0065).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>COFINS</span>
                  <span>
                    R${' '}
                    {(Number.parseFloat(revenue) * 0.03).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>ISS</span>
                  <span>
                    R${' '}
                    {(Number.parseFloat(revenue) * 0.05).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
              </div>

              <div className='h-64'>
                <TaxResultsChart
                  results={{
                    incomeTax: Number.parseFloat(revenue) * 0.048,
                    socialSecurity: Number.parseFloat(revenue) * 0.0288,
                    municipalTax: Number.parseFloat(revenue) * 0.05,
                    otherTaxes: Number.parseFloat(revenue) * 0.0365,
                    totalTax: Number.parseFloat(revenue) * 0.16,
                    effectiveRate: 16,
                  }}
                />
              </div>

              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='outline'
                  onClick={handleShowDetails}
                  className='flex-1'
                >
                  Ver Detalhes
                </Button>
                <Button variant='outline' className='flex-1'>
                  Comparar Regimes
                </Button>
                <Button className='flex-1'>Exportar Cálculo</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className='mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Calendário Fiscal</CardTitle>
            <CardDescription>
              Próximos vencimentos de impostos e obrigações fiscais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div>
                  <p className='font-medium'>Simples Nacional</p>
                  <p className='text-sm text-muted-foreground'>
                    DAS - Documento de Arrecadação do Simples
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>20/05/2023</p>
                  <p className='text-sm text-muted-foreground'>
                    Vencimento em 5 dias
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div>
                  <p className='font-medium'>INSS</p>
                  <p className='text-sm text-muted-foreground'>
                    Contribuição Previdenciária
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>15/05/2023</p>
                  <p className='text-sm text-muted-foreground'>
                    Vencido há 0 dias
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div>
                  <p className='font-medium'>IRRF</p>
                  <p className='text-sm text-muted-foreground'>
                    Imposto de Renda Retido na Fonte
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>20/05/2023</p>
                  <p className='text-sm text-muted-foreground'>
                    Vencimento em 5 dias
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant='outline' className='w-full'>
              Ver Calendário Completo
            </Button>
          </CardFooter>
        </Card>
      </div>

      <TaxDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  )
}
