'use client'

import { useState } from 'react'
import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  PieChart,
  Plus,
  TrendingUp,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AccountingRevenueChart } from './accounting-revenue-chart'
import { AccountingExpensesChart } from './accounting-expenses-chart'
import { AccountingTransactionsTable } from './accounting-transactions-table'
import { AccountingTaxesTable } from './accounting-taxes-table'
import { AccountingInvoicesTable } from './accounting-invoices-table'
import { AccountingCategoryChart } from './accounting-category-chart'
import { FinancialNavigation } from '../../tax-calculator/components/financial-navigation'
import { DatePickerWithRange } from '../../components/date-range-picker'
import { DateRange } from 'react-day-picker'

export function AccountingDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const [period, setPeriod] = useState('month')

  return (
    <div className='container mx-auto p-6'>
      <FinancialNavigation />

      <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Selecione o período' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Diário</SelectItem>
              <SelectItem value='week'>Semanal</SelectItem>
              <SelectItem value='month'>Mensal</SelectItem>
              <SelectItem value='quarter'>Trimestral</SelectItem>
              <SelectItem value='year'>Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' size='sm'>
            <Filter className='mr-2 h-4 w-4' />
            Filtros
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='mr-2 h-4 w-4' />
            Exportar
          </Button>
          <Button size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-0.5'>
              <CardTitle className='text-base'>Receita Total</CardTitle>
              <CardDescription>Período atual</CardDescription>
            </div>
            <DollarSign className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>R$ 12.450,00</div>
            <div className='mt-1 flex items-center text-sm text-green-600'>
              <TrendingUp className='mr-1 h-4 w-4' />
              <span>12% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-0.5'>
              <CardTitle className='text-base'>Despesas</CardTitle>
              <CardDescription>Período atual</CardDescription>
            </div>
            <CreditCard className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>R$ 3.850,00</div>
            <div className='mt-1 flex items-center text-sm text-red-600'>
              <TrendingUp className='mr-1 h-4 w-4' />
              <span>8% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-0.5'>
              <CardTitle className='text-base'>Lucro Líquido</CardTitle>
              <CardDescription>Período atual</CardDescription>
            </div>
            <PieChart className='h-5 w-5 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>R$ 8.600,00</div>
            <div className='mt-1 flex items-center text-sm text-green-600'>
              <TrendingUp className='mr-1 h-4 w-4' />
              <span>15% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='mt-8 grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>Análise de receitas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountingRevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
            <CardDescription>Análise de despesas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountingExpensesChart />
          </CardContent>
        </Card>
      </div>

      <div className='mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>
              Análise de receitas e despesas por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountingCategoryChart />
          </CardContent>
        </Card>
      </div>

      <div className='mt-8'>
        <Tabs defaultValue='transactions'>
          <TabsList className='grid-row w-full md:w-auto md:grid-cols-none'>
            <TabsTrigger value='transactions'>Transações</TabsTrigger>
            <TabsTrigger value='invoices'>Notas Fiscais</TabsTrigger>
            <TabsTrigger value='taxes'>Impostos</TabsTrigger>
          </TabsList>
          <TabsContent value='transactions' className='mt-4'>
            <Card>
              <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>
                    Histórico de transações no período selecionado
                  </CardDescription>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button variant='outline' size='sm'>
                    <Upload className='mr-2 h-4 w-4' />
                    Importar
                  </Button>
                  <Button size='sm'>
                    <Plus className='mr-2 h-4 w-4' />
                    Nova Transação
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AccountingTransactionsTable />
              </CardContent>
              <CardFooter className='flex justify-center border-t px-6 py-4'>
                <Button variant='outline'>Carregar Mais</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='invoices' className='mt-4'>
            <Card>
              <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle>Notas Fiscais</CardTitle>
                  <CardDescription>
                    Histórico de notas fiscais emitidas e recebidas
                  </CardDescription>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button variant='outline' size='sm'>
                    <Download className='mr-2 h-4 w-4' />
                    Exportar
                  </Button>
                  <Button size='sm'>
                    <FileText className='mr-2 h-4 w-4' />
                    Nova Nota Fiscal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AccountingInvoicesTable />
              </CardContent>
              <CardFooter className='flex justify-center border-t px-6 py-4'>
                <Button variant='outline'>Carregar Mais</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='taxes' className='mt-4'>
            <Card>
              <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle>Impostos</CardTitle>
                  <CardDescription>
                    Acompanhamento de impostos e obrigações fiscais
                  </CardDescription>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button variant='outline' size='sm'>
                    <Calendar className='mr-2 h-4 w-4' />
                    Calendário Fiscal
                  </Button>
                  <Button size='sm'>
                    <Download className='mr-2 h-4 w-4' />
                    Exportar Relatório
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AccountingTaxesTable />
              </CardContent>
              <CardFooter className='flex justify-center border-t px-6 py-4'>
                <Button variant='outline'>Carregar Mais</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

