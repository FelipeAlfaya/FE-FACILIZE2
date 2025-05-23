'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
type ValueFormatter = (
  value: any,
  name?: string,
  entry?: any,
  index?: number
) => string
import { Info, ArrowRight, Download } from 'lucide-react'
import { FinancialNavigation } from '../tax-calculator/components/financial-navigation'

interface TaxBreakdown {
  [key: string]: number | boolean | undefined
  exceedsLimit?: boolean
}

interface TaxResult {
  totalTax: number
  effectiveRate: number
  breakdown: TaxBreakdown
  netProfit: number
}

interface TaxResults {
  simples: TaxResult
  presumido: TaxResult
  real: TaxResult
  mei: TaxResult
}

interface ChartDataItem {
  name: string
  impostos: number
  lucro: number
  aliquota: number
}

type ActivityType = 'services' | 'commerce' | 'industry' | 'transport'
type PeriodType = 'monthly' | 'yearly'
type AnnexType = '1' | '2' | '3' | '4' | '5' | '6'

interface PresumedRates {
  irpj: number
  csll: number
  pis: number
  cofins: number
  iss?: number
  icms?: number
  ipi?: number
}

interface RealRates {
  irpj: number
  csll: number
  pis: number
  cofins: number
  iss: number
  icms: number
}

interface MeiValues {
  monthlyFee: number
  revenueLimit: number
  hasLimit: boolean
}

export default function TaxRegimeComparison() {
  // Estados para os inputs do usuário
  const [revenue, setRevenue] = useState<number>(10000)
  const [expenses, setExpenses] = useState<number>(3000)
  const [activity, setActivity] = useState<ActivityType>('services')
  const [annex, setAnnex] = useState<AnnexType>('3')
  const [showResults, setShowResults] = useState<boolean>(false)
  const [period, setPeriod] = useState<PeriodType>('monthly')

  // Estados para armazenar resultados dos cálculos
  const [taxResults, setTaxResults] = useState<TaxResults>({
    simples: { totalTax: 0, effectiveRate: 0, breakdown: {}, netProfit: 0 },
    presumido: { totalTax: 0, effectiveRate: 0, breakdown: {}, netProfit: 0 },
    real: { totalTax: 0, effectiveRate: 0, breakdown: {}, netProfit: 0 },
    mei: { totalTax: 0, effectiveRate: 0, breakdown: {}, netProfit: 0 },
  })

  // Dados para o gráfico de comparação
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  // Anexos do Simples Nacional e suas alíquotas
  const simplesTotals: Record<AnnexType, number[]> = {
    '1': [4.5, 7.8, 10.0, 11.2, 14.7, 30.0], // Comércio
    '2': [4.5, 7.8, 10.0, 11.2, 14.7, 30.0], // Indústria
    '3': [6.0, 11.2, 13.5, 16.0, 21.0, 33.0], // Serviços Gerais
    '4': [4.5, 9.0, 10.2, 14.0, 22.0, 33.0], // Serviços Específicos
    '5': [15.5, 18.0, 19.5, 20.5, 23.0, 30.5], // Serviços Técnicos
    '6': [16.93, 17.72, 18.43, 18.77, 19.04, 19.94], // Serviços Profissionais
  }

  // Faixas de faturamento do Simples Nacional (anual)
  const simplesRanges: number[] = [
    180000, // Até 180.000,00
    360000, // De 180.000,01 a 360.000,00
    720000, // De 360.000,01 a 720.000,00
    1800000, // De 720.000,01 a 1.800.000,00
    3600000, // De 1.800.000,01 a 3.600.000,00
    4800000, // De 3.600.000,01 a 4.800.000,00
  ]

  // Parcelas a deduzir do Simples Nacional
  const simplesDeductions: Record<AnnexType, number[]> = {
    '1': [0, 5940, 13860, 22500, 87300, 378000],
    '2': [0, 5940, 13860, 22500, 87300, 378000],
    '3': [0, 9360, 17640, 35640, 125640, 648000],
    '4': [0, 8100, 12420, 39780, 183780, 828000],
    '5': [0, 4500, 9900, 17100, 62100, 540000],
    '6': [0, 4230.43, 7078.76, 13353.6, 22628.76, 144768.36],
  }

  // Alíquotas e base de cálculo do Lucro Presumido
  const presumedRates: Record<ActivityType, PresumedRates> = {
    services: { irpj: 0.32, csll: 0.32, pis: 0.0065, cofins: 0.03, iss: 0.05 },
    commerce: { irpj: 0.08, csll: 0.12, pis: 0.0065, cofins: 0.03, icms: 0.18 },
    industry: {
      irpj: 0.08,
      csll: 0.12,
      pis: 0.0065,
      cofins: 0.03,
      ipi: 0.05,
      icms: 0.18,
    },
    transport: { irpj: 0.16, csll: 0.12, pis: 0.0065, cofins: 0.03, iss: 0.05 },
  }

  // Alíquotas para Lucro Real
  const realRates: RealRates = {
    irpj: 0.15, // 15% sobre o lucro
    csll: 0.09, // 9% sobre o lucro
    pis: 0.0165, // 1,65% sobre o faturamento (não-cumulativo)
    cofins: 0.076, // 7,6% sobre o faturamento (não-cumulativo)
    // ISS/ICMS varia conforme atividade
    iss: 0.05,
    icms: 0.18,
  }

  // Valores para MEI
  const meiValues: MeiValues = {
    monthlyFee: 71.0, // INSS + ISS/ICMS básico - valor atualizado 2025
    revenueLimit: 8333.33, // Limite mensal MEI (100k anual)
    hasLimit: true,
  }

  // Calcula a faixa do Simples Nacional baseado na receita anual
  const getSimplesBracket = (annualRevenue: number): number => {
    for (let i = 0; i < simplesRanges.length; i++) {
      if (annualRevenue <= simplesRanges[i]) {
        return i
      }
    }
    return 5 // última faixa
  }

  // Calcula o adicional de IRPJ (para Lucro Real e Presumido quando aplicável)
  const calculateIrpjAdditional = (profit: number): number => {
    const annualValue = period === 'monthly' ? profit * 12 : profit
    const monthlyEquivalent = period === 'monthly' ? profit : profit / 12
    return annualValue > 240000 ? monthlyEquivalent * 0.1 : 0
  }

  // Cálculo do Simples Nacional
  const calculateSimples = (
    monthlyRevenue: number,
    annualRevenue: number
  ): TaxResult => {
    if (annualRevenue > 4800000) {
      return {
        totalTax: 0,
        effectiveRate: 0,
        breakdown: { exceedsLimit: true },
        netProfit: 0,
      }
    }

    const bracket = getSimplesBracket(annualRevenue)
    const nominalRate = simplesTotals[annex][bracket] / 100
    const deduction = simplesDeductions[annex][bracket]

    // Alíquota efetiva = (RBT12 x Aliq - PD) / RBT12
    const effectiveRate =
      (annualRevenue * nominalRate - deduction) / annualRevenue
    const totalTax = monthlyRevenue * effectiveRate

    // Cálculo aproximado da distribuição de impostos no Simples
    let breakdown: TaxBreakdown = {}

    if (annex === '3' || annex === '4' || annex === '5' || annex === '6') {
      // Serviços
      breakdown = {
        cpp: totalTax * 0.43, // Previdência
        iss: totalTax * 0.34, // ISS
        irpj: totalTax * 0.095, // IRPJ
        csll: totalTax * 0.05, // CSLL
        cofins: totalTax * 0.065, // COFINS
        pis: totalTax * 0.02, // PIS
      }
    } else {
      // Comércio/Indústria
      breakdown = {
        cpp: totalTax * 0.41, // Previdência
        icms: totalTax * 0.34, // ICMS
        irpj: totalTax * 0.095, // IRPJ
        csll: totalTax * 0.05, // CSLL
        cofins: totalTax * 0.085, // COFINS
        pis: totalTax * 0.02, // PIS
      }
    }

    return {
      totalTax,
      effectiveRate: effectiveRate * 100,
      breakdown,
      netProfit: monthlyRevenue - totalTax - Number(expenses),
    }
  }

  // Cálculo do Lucro Presumido
  const calculatePresumed = (
    monthlyRevenue: number,
    activityType: ActivityType,
    monthlyExpenses: number
  ): TaxResult => {
    const rates = presumedRates[activityType]

    // Base de cálculo
    const irpjBase = monthlyRevenue * rates.irpj
    const csllBase = monthlyRevenue * rates.csll

    // Cálculo dos impostos
    const irpj = irpjBase * 0.15
    const irpjAdd = calculateIrpjAdditional(irpjBase)
    const csll = csllBase * 0.09
    const pis = monthlyRevenue * rates.pis
    const cofins = monthlyRevenue * rates.cofins

    // Impostos municipais/estaduais
    let municipalTax = 0
    if (activityType === 'services' || activityType === 'transport') {
      municipalTax = monthlyRevenue * (rates.iss || 0) // ISS
    } else {
      municipalTax = monthlyRevenue * (rates.icms || 0) // ICMS
      if (activityType === 'industry') {
        municipalTax += monthlyRevenue * (rates.ipi || 0) // IPI para indústria
      }
    }

    const totalTax = irpj + irpjAdd + csll + pis + cofins + municipalTax
    const effectiveRate = (totalTax / monthlyRevenue) * 100

    return {
      totalTax,
      effectiveRate,
      breakdown: {
        irpj: irpj + irpjAdd,
        csll,
        pis,
        cofins,
        municipalTax,
      },
      netProfit: monthlyRevenue - totalTax - Number(monthlyExpenses),
    }
  }

  // Cálculo do Lucro Real
  const calculateReal = (
    monthlyRevenue: number,
    activityType: ActivityType,
    monthlyExpenses: number
  ): TaxResult => {
    // Base de cálculo (receita - despesas)
    const profit = Math.max(0, monthlyRevenue - monthlyExpenses)

    // Impostos sobre o lucro
    const irpj = profit * realRates.irpj
    const irpjAdd = calculateIrpjAdditional(profit)
    const csll = profit * realRates.csll

    // Impostos sobre o faturamento (com créditos)
    // Considerando que cerca de 60% das despesas geram créditos de PIS/COFINS
    const pisCredits = monthlyExpenses * 0.6 * realRates.pis
    const cofinsCredits = monthlyExpenses * 0.6 * realRates.cofins

    const pis = monthlyRevenue * realRates.pis - pisCredits
    const cofins = monthlyRevenue * realRates.cofins - cofinsCredits

    // Impostos municipais/estaduais
    let municipalTax = 0
    if (activityType === 'services' || activityType === 'transport') {
      municipalTax = monthlyRevenue * realRates.iss // ISS
    } else {
      municipalTax = monthlyRevenue * realRates.icms // ICMS
    }

    const totalTax = irpj + irpjAdd + csll + pis + cofins + municipalTax
    const effectiveRate = (totalTax / monthlyRevenue) * 100

    return {
      totalTax,
      effectiveRate,
      breakdown: {
        irpj: irpj + irpjAdd,
        csll,
        pis,
        cofins,
        municipalTax,
      },
      netProfit: monthlyRevenue - totalTax - Number(monthlyExpenses),
    }
  }

  // Cálculo do MEI
  const calculateMEI = (
    monthlyRevenue: number,
    monthlyExpenses: number
  ): TaxResult => {
    if (monthlyRevenue > meiValues.revenueLimit) {
      return {
        totalTax: meiValues.monthlyFee,
        effectiveRate: (meiValues.monthlyFee / monthlyRevenue) * 100,
        breakdown: {
          fixedFee: meiValues.monthlyFee,
          exceedsLimit: true,
        },
        netProfit:
          monthlyRevenue - meiValues.monthlyFee - Number(monthlyExpenses),
      }
    }

    return {
      totalTax: meiValues.monthlyFee,
      effectiveRate: (meiValues.monthlyFee / monthlyRevenue) * 100,
      breakdown: { fixedFee: meiValues.monthlyFee },
      netProfit:
        monthlyRevenue - meiValues.monthlyFee - Number(monthlyExpenses),
    }
  }

  // Função principal de cálculo
  const calculateTaxes = (): void => {
    const monthlyRevenueValue = Number(revenue)
    const annualRevenueValue =
      period === 'monthly' ? monthlyRevenueValue * 12 : monthlyRevenueValue
    const monthlyRevenueCalculation =
      period === 'monthly' ? monthlyRevenueValue : monthlyRevenueValue / 12

    const monthlyExpensesValue = Number(expenses)
    const expensesCalculation =
      period === 'monthly' ? monthlyExpensesValue : monthlyExpensesValue / 12

    // Calcular impostos para cada regime
    const simplesResult = calculateSimples(
      monthlyRevenueCalculation,
      annualRevenueValue
    )
    const presumidoResult = calculatePresumed(
      monthlyRevenueCalculation,
      activity,
      expensesCalculation
    )
    const realResult = calculateReal(
      monthlyRevenueCalculation,
      activity,
      expensesCalculation
    )
    const meiResult = calculateMEI(
      monthlyRevenueCalculation,
      expensesCalculation
    )

    setTaxResults({
      simples: simplesResult,
      presumido: presumidoResult,
      real: realResult,
      mei: meiResult,
    })

    // Atualizar dados do gráfico
    setChartData([
      {
        name: 'Simples Nacional',
        impostos: simplesResult.totalTax,
        lucro: simplesResult.netProfit,
        aliquota: simplesResult.effectiveRate,
      },
      {
        name: 'Lucro Presumido',
        impostos: presumidoResult.totalTax,
        lucro: presumidoResult.netProfit,
        aliquota: presumidoResult.effectiveRate,
      },
      {
        name: 'Lucro Real',
        impostos: realResult.totalTax,
        lucro: realResult.netProfit,
        aliquota: realResult.effectiveRate,
      },
      {
        name: 'MEI',
        impostos: meiResult.totalTax,
        lucro: meiResult.netProfit,
        aliquota: meiResult.effectiveRate,
      },
    ])

    setShowResults(true)
  }

  // Formatar valores monetários
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Atualiza automaticamente o anexo do Simples quando a atividade muda
  useEffect(() => {
    if (activity === 'services') setAnnex('3')
    else if (activity === 'commerce') setAnnex('1')
    else if (activity === 'industry') setAnnex('2')
    else if (activity === 'transport') setAnnex('4')
  }, [activity])

  return (
    <div className='container mx-auto p-6'>
      <FinancialNavigation />

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Comparativo de Regimes Tributários</CardTitle>
            <CardDescription>
              Compare os impostos entre diferentes regimes tributários para sua
              empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={period}
              className='mb-6'
              onValueChange={(value: string) => setPeriod(value as PeriodType)}
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='monthly'>Mensal</TabsTrigger>
                <TabsTrigger value='yearly'>Anual</TabsTrigger>
              </TabsList>
              <TabsContent value='monthly' className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='activity'>Atividade Principal</Label>
                  <Select
                    value={activity}
                    onValueChange={(value: ActivityType) => setActivity(value)}
                  >
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

                {activity === 'services' && (
                  <div className='space-y-2'>
                    <Label htmlFor='simples-annex'>
                      Anexo do Simples Nacional
                    </Label>
                    <Select
                      value={annex}
                      onValueChange={(value: AnnexType) => setAnnex(value)}
                    >
                      <SelectTrigger id='simples-annex'>
                        <SelectValue placeholder='Selecione o anexo do Simples' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='3'>
                          Anexo III - Serviços em geral
                        </SelectItem>
                        <SelectItem value='4'>
                          Anexo IV - Serviços específicos
                        </SelectItem>
                        <SelectItem value='5'>
                          Anexo V - Serviços técnicos
                        </SelectItem>
                        <SelectItem value='6'>
                          Anexo VI - Serviços profissionais
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='revenue'>Faturamento Mensal (R$)</Label>
                  <Input
                    id='revenue'
                    type='number'
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    placeholder='0,00'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='expenses'>Despesas Mensais (R$)</Label>
                  <Input
                    id='expenses'
                    type='number'
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    placeholder='0,00'
                  />
                </div>
              </TabsContent>
              <TabsContent value='yearly' className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='activity-yearly'>Atividade Principal</Label>
                  <Select
                    value={activity}
                    onValueChange={(value: ActivityType) => setActivity(value)}
                  >
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

                {activity === 'services' && (
                  <div className='space-y-2'>
                    <Label htmlFor='simples-annex-yearly'>
                      Anexo do Simples Nacional
                    </Label>
                    <Select
                      value={annex}
                      onValueChange={(value: AnnexType) => setAnnex(value)}
                    >
                      <SelectTrigger id='simples-annex-yearly'>
                        <SelectValue placeholder='Selecione o anexo do Simples' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='3'>
                          Anexo III - Serviços em geral
                        </SelectItem>
                        <SelectItem value='4'>
                          Anexo IV - Serviços específicos
                        </SelectItem>
                        <SelectItem value='5'>
                          Anexo V - Serviços técnicos
                        </SelectItem>
                        <SelectItem value='6'>
                          Anexo VI - Serviços profissionais
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='revenue-yearly'>Faturamento Anual (R$)</Label>
                  <Input
                    id='revenue-yearly'
                    type='number'
                    value={period === 'yearly' ? revenue : revenue * 12}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    placeholder='0,00'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='expenses-yearly'>Despesas Anuais (R$)</Label>
                  <Input
                    id='expenses-yearly'
                    type='number'
                    value={period === 'yearly' ? expenses : expenses * 12}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    placeholder='0,00'
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={calculateTaxes} className='w-full'>
              Comparar Regimes Tributários
            </Button>
          </CardContent>
        </Card>

        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Comparação</CardTitle>
              <CardDescription>
                {activity === 'services'
                  ? 'Prestação de Serviços'
                  : activity === 'commerce'
                  ? 'Comércio'
                  : activity === 'industry'
                  ? 'Indústria'
                  : 'Transporte'}{' '}
                | Faturamento:{' '}
                {formatCurrency(period === 'monthly' ? revenue : revenue / 12)}{' '}
                {period === 'monthly' ? 'mensal' : '/ mês'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis yAxisId='left' orientation='left' stroke='#82ca9d' />
                    <YAxis
                      yAxisId='right'
                      orientation='right'
                      stroke='#8884d8'
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar
                      yAxisId='left'
                      dataKey='impostos'
                      name='Total de Impostos'
                      fill='#8884d8'
                    />
                    <Bar
                      yAxisId='left'
                      dataKey='lucro'
                      name='Lucro Líquido'
                      fill='#82ca9d'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <Card
                    className={
                      taxResults.simples.netProfit >=
                        taxResults.presumido.netProfit &&
                      taxResults.simples.netProfit >=
                        taxResults.real.netProfit &&
                      taxResults.simples.netProfit >= taxResults.mei.netProfit
                        ? 'border-green-500 border-2'
                        : ''
                    }
                  >
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Simples Nacional
                      </CardTitle>
                      <CardDescription>
                        {taxResults.simples.breakdown.exceedsLimit
                          ? 'Faturamento excede o limite!'
                          : `Anexo ${annex} - Alíquota Efetiva: ${taxResults.simples.effectiveRate.toFixed(
                              2
                            )}%`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <span>Total de Impostos:</span>
                          <span className='font-medium text-red-600'>
                            {formatCurrency(taxResults.simples.totalTax)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Lucro Líquido:</span>
                          <span className='font-medium text-green-600'>
                            {formatCurrency(taxResults.simples.netProfit)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      taxResults.presumido.netProfit >=
                        taxResults.simples.netProfit &&
                      taxResults.presumido.netProfit >=
                        taxResults.real.netProfit &&
                      taxResults.presumido.netProfit >= taxResults.mei.netProfit
                        ? 'border-green-500 border-2'
                        : ''
                    }
                  >
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Lucro Presumido
                      </CardTitle>
                      <CardDescription>
                        Alíquota Efetiva:{' '}
                        {taxResults.presumido.effectiveRate.toFixed(2)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <span>Total de Impostos:</span>
                          <span className='font-medium text-red-600'>
                            {formatCurrency(taxResults.presumido.totalTax)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Lucro Líquido:</span>
                          <span className='font-medium text-green-600'>
                            {formatCurrency(taxResults.presumido.netProfit)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      taxResults.real.netProfit >=
                        taxResults.simples.netProfit &&
                      taxResults.real.netProfit >=
                        taxResults.presumido.netProfit &&
                      taxResults.real.netProfit >= taxResults.mei.netProfit
                        ? 'border-green-500 border-2'
                        : ''
                    }
                  >
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>Lucro Real</CardTitle>
                      <CardDescription>
                        Alíquota Efetiva:{' '}
                        {taxResults.real.effectiveRate.toFixed(2)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <span>Total de Impostos:</span>
                          <span className='font-medium text-red-600'>
                            {formatCurrency(taxResults.real.totalTax)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Lucro Líquido:</span>
                          <span className='font-medium text-green-600'>
                            {formatCurrency(taxResults.real.netProfit)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      taxResults.mei.netProfit >=
                        taxResults.simples.netProfit &&
                      taxResults.mei.netProfit >=
                        taxResults.presumido.netProfit &&
                      taxResults.mei.netProfit >= taxResults.real.netProfit
                        ? 'border-green-500 border-2'
                        : ''
                    }
                  >
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>MEI</CardTitle>
                      <CardDescription>
                        {taxResults.mei.breakdown.exceedsLimit
                          ? 'Faturamento excede o limite!'
                          : `Taxa Fixa: ${formatCurrency(
                              meiValues.monthlyFee
                            )}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <span>Total de Impostos:</span>
                          <span className='font-medium text-red-600'>
                            {formatCurrency(taxResults.mei.totalTax)}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Lucro Líquido:</span>
                          <span className='font-medium text-green-600'>
                            {formatCurrency(taxResults.mei.netProfit)}
                          </span>
                        </div>
                      </div>
                      {taxResults.mei.breakdown.exceedsLimit && (
                        <div className='text-xs text-red-500 mt-2 flex items-center'>
                          <Info className='w-4 h-4 mr-1' />
                          Limite MEI ultrapassado - Considere migrar para outro
                          regime
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className='text-sm text-muted-foreground flex items-center'>
                  <Info className='w-4 h-4 mr-2' />
                  Valores estimados - Consulte um contador para análise
                  detalhada
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline'>
                <Download className='w-4 h-4 mr-2' />
                Exportar Dados
              </Button>
              <Button>
                Simular Opções <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

