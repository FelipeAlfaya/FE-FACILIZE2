'use client'

import { useEffect, useState } from 'react'
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
import { TaxEnhancedModal } from './tax-enhanced-modal'
import { toast } from 'sonner'

export type ActivityType = 'services' | 'commerce' | 'industry' | 'transport'
export type AnnexType = '1' | '2' | '3' | '4' | '5' | '6'
export type PeriodType = 'monthly' | 'yearly'

export interface TaxBreakdown {
  irpj: number
  csll: number
  pis: number
  cofins: number
  iss?: number
  icms?: number
  ipi?: number
  cpp?: number
  fixedFee?: number
  exceedsLimit?: boolean
  municipalTax?: number
  activityType?: string
}

export interface TaxResult {
  totalTax: number
  effectiveRate: number
  breakdown: TaxBreakdown
  netProfit: number
}

export function TaxCalculator() {
  const [taxRegime, setTaxRegime] = useState('simples')
  const [revenue, setRevenue] = useState('10000')
  const [expenses, setExpenses] = useState('3000')
  const [activity, setActivity] = useState<ActivityType>('services')
  const [annex, setAnnex] = useState<AnnexType>('3')
  const [period, setPeriod] = useState<PeriodType>('monthly')
  const [showResults, setShowResults] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [modalInitialTab, setModalInitialTab] = useState<
    'calculation' | 'comparison' | 'analysis'
  >('calculation')
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null)
  const [chartKey, setChartKey] = useState<number>(0)

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
  const presumedRates: Record<ActivityType, TaxBreakdown> = {
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
  const realRates: TaxBreakdown = {
    irpj: 0.15, // 15% sobre o lucro
    csll: 0.09, // 9% sobre o lucro
    pis: 0.0165, // 1,65% sobre o faturamento (não-cumulativo)
    cofins: 0.076, // 7,6% sobre o faturamento (não-cumulativo)
    iss: 0.05,
    icms: 0.18,
  }

  // Alíquotas de ISS por tipo de serviço (estimativas médias)
  const issRates = {
    default: 0.05, // 5% - serviços gerais
    professional: 0.02, // 2% - serviços profissionais (advocacia, contabilidade)
    technical: 0.03, // 3% - serviços técnicos
    consulting: 0.05, // 5% - consultoria
  }

  // Valores para MEI atualizados 2025
  const getMeiValues = (activityType: ActivityType) => {
    switch (activityType) {
      case 'commerce':
        return {
          monthlyFee: 65.66, // INSS + ICMS
          revenueLimit: 8333.33, // R$ 100.000 anual / 12
          hasLimit: true,
          activityType: 'commerce',
        }
      case 'services':
        return {
          monthlyFee: 70.66, // INSS + ISS
          revenueLimit: 8333.33, // R$ 100.000 anual / 12
          hasLimit: true,
          activityType: 'services',
        }
      case 'industry':
        return {
          monthlyFee: 65.66, // INSS + ICMS
          revenueLimit: 8333.33, // R$ 100.000 anual / 12
          hasLimit: true,
          activityType: 'industry',
        }
      case 'transport':
        return {
          monthlyFee: 70.66, // INSS + ISS
          revenueLimit: 8333.33, // R$ 100.000 anual / 12
          hasLimit: true,
          activityType: 'transport',
        }
      default:
        return {
          monthlyFee: 71.66, // INSS + ISS + ICMS (atividade mista)
          revenueLimit: 8333.33,
          hasLimit: true,
        }
    }
  }

  // Calcula a alíquota de ISS baseada no tipo de serviço e anexo
  const getIssRate = (
    activityType: ActivityType,
    annexType: AnnexType
  ): number => {
    if (activityType !== 'services' && activityType !== 'transport') {
      return 0 // Não há ISS para comércio e indústria
    }

    switch (annexType) {
      case '6': // Serviços profissionais
        return issRates.professional
      case '5': // Serviços técnicos
        return issRates.technical
      case '4': // Serviços específicos
        return issRates.consulting
      case '3': // Serviços gerais
      default:
        return issRates.default
    }
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

  const handleShowDetails = () => {
    setModalInitialTab('calculation')
    setShowDetailsModal(true)
  }

  const handleCompareRegimes = () => {
    setModalInitialTab('comparison')
    setShowDetailsModal(true)
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
        breakdown: {
          irpj: 0,
          csll: 0,
          pis: 0,
          cofins: 0,
          exceedsLimit: true,
        },
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
    let breakdown: TaxBreakdown = {
      irpj: 0,
      csll: 0,
      pis: 0,
      cofins: 0,
    }

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

  // Cálculo do Lucro Presumido (melhorado)
  const calculatePresumed = (
    monthlyRevenue: number,
    activityType: ActivityType,
    monthlyExpenses: number
  ): TaxResult => {
    const rates = presumedRates[activityType]

    // Base de cálculo
    const irpjBase = monthlyRevenue * rates.irpj
    const csllBase = monthlyRevenue * rates.csll

    // Cálculo dos impostos federais
    const irpj = irpjBase * 0.15
    const irpjAdd = calculateIrpjAdditional(irpjBase)
    const csll = csllBase * 0.09
    const pis = monthlyRevenue * rates.pis
    const cofins = monthlyRevenue * rates.cofins

    // Impostos municipais/estaduais com cálculo melhorado
    let municipalTax = 0
    if (activityType === 'services' || activityType === 'transport') {
      const issRate = getIssRate(activityType, annex)
      municipalTax = monthlyRevenue * issRate // ISS
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

  // Cálculo do Lucro Real (melhorado)
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

    // Impostos sobre o faturamento (com créditos aprimorados)
    // Estimativa de créditos baseada em despesas operacionais típicas
    const creditRate = Math.min(0.8, monthlyExpenses / monthlyRevenue) // Máximo 80% de crédito
    const pisCredits = monthlyExpenses * creditRate * realRates.pis
    const cofinsCredits = monthlyExpenses * creditRate * realRates.cofins

    const pis = Math.max(0, monthlyRevenue * realRates.pis - pisCredits)
    const cofins = Math.max(
      0,
      monthlyRevenue * realRates.cofins - cofinsCredits
    )

    // Impostos municipais/estaduais
    let municipalTax = 0
    if (activityType === 'services' || activityType === 'transport') {
      const issRate = getIssRate(activityType, annex)
      municipalTax = monthlyRevenue * issRate // ISS
    } else {
      municipalTax = monthlyRevenue * (realRates.icms ?? 0) // ICMS
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
    const meiValues = getMeiValues(activity)
    if (monthlyRevenue > meiValues.revenueLimit) {
      return {
        totalTax: meiValues.monthlyFee,
        effectiveRate: (meiValues.monthlyFee / monthlyRevenue) * 100,
        breakdown: {
          irpj: 0,
          csll: 0,
          pis: 0,
          cofins: 0,
          fixedFee: meiValues.monthlyFee,
          exceedsLimit: true,
          activityType: meiValues.activityType,
        },
        netProfit:
          monthlyRevenue - meiValues.monthlyFee - Number(monthlyExpenses),
      }
    }

    return {
      totalTax: meiValues.monthlyFee,
      effectiveRate: (meiValues.monthlyFee / monthlyRevenue) * 100,
      breakdown: {
        irpj: 0,
        csll: 0,
        pis: 0,
        cofins: 0,
        fixedFee: meiValues.monthlyFee,
        activityType: meiValues.activityType,
      },
      netProfit:
        monthlyRevenue - meiValues.monthlyFee - Number(monthlyExpenses),
    }
  }

  const handleCalculate = () => {
    const monthlyRevenueValue = Number(revenue)
    const annualRevenueValue =
      period === 'monthly' ? monthlyRevenueValue * 12 : monthlyRevenueValue
    const monthlyRevenueCalculation =
      period === 'monthly' ? monthlyRevenueValue : monthlyRevenueValue / 12

    const monthlyExpensesValue = Number(expenses)
    const expensesCalculation =
      period === 'monthly' ? monthlyExpensesValue : monthlyExpensesValue / 12

    let result: TaxResult

    switch (taxRegime) {
      case 'simples':
        result = calculateSimples(monthlyRevenueCalculation, annualRevenueValue)
        break
      case 'presumido':
        result = calculatePresumed(
          monthlyRevenueCalculation,
          activity,
          expensesCalculation
        )
        break
      case 'real':
        result = calculateReal(
          monthlyRevenueCalculation,
          activity,
          expensesCalculation
        )
        break
      case 'mei':
        result = calculateMEI(monthlyRevenueCalculation, expensesCalculation)
        break
      default:
        result = {
          totalTax: 0,
          effectiveRate: 0,
          breakdown: {
            irpj: 0,
            csll: 0,
            pis: 0,
            cofins: 0,
          },
          netProfit: 0,
        }
    }

    setTaxResult(result)
    setChartKey((prev) => prev + 1)
    setShowResults(true)
  }

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
            <CardTitle>Calculadora de Impostos</CardTitle>
            <CardDescription>
              Calcule os impostos devidos com base no regime tributário e
              faturamento
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

                {taxRegime === 'simples' && activity === 'services' && (
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

                {taxRegime === 'simples' && activity === 'services' && (
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
                    value={
                      period === 'yearly'
                        ? revenue
                        : (Number.parseFloat(revenue) * 12).toString()
                    }
                    onChange={(e) =>
                      setRevenue(
                        period === 'yearly'
                          ? e.target.value
                          : (Number.parseFloat(e.target.value) / 12).toString()
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
                    value={
                      period === 'yearly'
                        ? expenses
                        : (Number.parseFloat(expenses) * 12).toString()
                    }
                    onChange={(e) =>
                      setExpenses(
                        period === 'yearly'
                          ? e.target.value
                          : (Number.parseFloat(e.target.value) / 12).toString()
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

        {showResults && taxResult && (
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
                    {formatCurrency(
                      period === 'monthly'
                        ? Number(revenue)
                        : Number(revenue) / 12
                    )}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>
                    Total de Impostos
                  </p>
                  <p className='text-2xl font-bold text-red-600'>
                    {formatCurrency(taxResult.totalTax)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                {Object.entries(taxResult.breakdown).map(([key, value]) => {
                  if (typeof value !== 'number') return null

                  let label = ''
                  switch (key) {
                    case 'irpj':
                      label = 'IRPJ'
                      break
                    case 'csll':
                      label = 'CSLL'
                      break
                    case 'pis':
                      label = 'PIS'
                      break
                    case 'cofins':
                      label = 'COFINS'
                      break
                    case 'iss':
                      label = 'ISS'
                      break
                    case 'icms':
                      label = 'ICMS'
                      break
                    case 'ipi':
                      label = 'IPI'
                      break
                    case 'cpp':
                      label = 'CPP'
                      break
                    case 'fixedFee':
                      label = 'Taxa Fixa'
                      break
                    case 'municipalTax':
                      label =
                        activity === 'services' || activity === 'transport'
                          ? 'ISS'
                          : 'ICMS'
                      break
                    default:
                      label = key.toUpperCase()
                  }

                  return (
                    <div key={key} className='flex justify-between'>
                      <span>{label}</span>
                      <span>{formatCurrency(value)}</span>
                    </div>
                  )
                })}
              </div>

              <div className='h-64'>
                <TaxResultsChart
                  key={`chart-${chartKey}`}
                  results={{
                    incomeTax: taxResult.breakdown.irpj || 0,
                    socialSecurity: taxResult.breakdown.csll || 0,
                    municipalTax:
                      taxResult.breakdown.iss || taxResult.breakdown.icms || 0,
                    otherTaxes:
                      (taxResult.breakdown.pis || 0) +
                      (taxResult.breakdown.cofins || 0) +
                      (taxResult.breakdown.cpp || 0) +
                      (taxResult.breakdown.ipi || 0),
                    totalTax: taxResult.totalTax,
                    effectiveRate: taxResult.effectiveRate,
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
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={handleCompareRegimes}
                >
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

      <TaxEnhancedModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        taxResult={taxResult}
        taxRegime={taxRegime}
        activity={activity}
        annex={annex}
        revenue={revenue}
        expenses={expenses}
        period={period}
        initialTab={modalInitialTab}
      />
    </div>
  )
}
