'use client'

import React, { useState, useEffect } from 'react'
import { X, TrendingUp, Calculator, FileText, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { TaxComparisonChart } from '../../tax-comparison/tax-comparison-chart'
import {
  ActivityType,
  AnnexType,
  PeriodType,
  TaxResult,
  TaxBreakdown,
} from './tax-calculator'

interface TaxEnhancedModalProps {
  isOpen: boolean
  onClose: () => void
  taxResult: TaxResult | null
  taxRegime: string
  activity: ActivityType
  annex: AnnexType
  revenue: string
  expenses: string
  period: PeriodType
  initialTab?: 'calculation' | 'comparison' | 'analysis'
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

export function TaxEnhancedModal({
  isOpen,
  onClose,
  taxResult,
  taxRegime,
  activity,
  annex,
  revenue,
  expenses,
  period,
  initialTab = 'calculation',
}: TaxEnhancedModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [allTaxResults, setAllTaxResults] = useState<TaxResults | null>(null)
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [chartKey, setChartKey] = useState<number>(0)

  // Importar funções de cálculo (copiadas do tax-comparison)
  // Anexos do Simples Nacional e suas alíquotas (atualizadas 2025)
  const simplesTotals: Record<AnnexType, number[]> = {
    '1': [4.5, 7.8, 10.0, 11.2, 14.7, 30.0], // Comércio
    '2': [4.5, 7.8, 10.0, 11.2, 14.7, 30.0], // Indústria
    '3': [6.0, 11.2, 13.5, 16.0, 21.0, 33.0], // Serviços Gerais
    '4': [4.5, 9.0, 10.2, 14.0, 22.0, 33.0], // Serviços Específicos
    '5': [15.5, 18.0, 19.5, 20.5, 23.0, 30.5], // Serviços Técnicos
    '6': [16.93, 17.72, 18.43, 18.77, 19.04, 19.94], // Serviços Profissionais
  }

  // Faixas de faturamento do Simples Nacional (anual) - atualizadas 2025
  const simplesRanges: number[] = [
    180000, 360000, 720000, 1800000, 3600000, 4800000,
  ]

  // Parcelas a deduzir do Simples Nacional (atualizadas 2025)
  const simplesDeductions: Record<AnnexType, number[]> = {
    '1': [0, 5940, 13860, 22500, 87300, 378000],
    '2': [0, 5940, 13860, 22500, 87300, 378000],
    '3': [0, 9360, 17640, 35640, 125640, 648000],
    '4': [0, 8100, 12420, 39780, 183780, 828000],
    '5': [0, 4500, 9900, 17100, 62100, 540000],
    '6': [0, 4230.43, 7078.76, 13353.6, 22628.76, 144768.36],
  }

  // Alíquotas e base de cálculo do Lucro Presumido (atualizadas 2025)
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

  // Alíquotas para Lucro Real (atualizadas 2025)
  const realRates: TaxBreakdown = {
    irpj: 0.15,
    csll: 0.09,
    pis: 0.0165,
    cofins: 0.076,
    iss: 0.05,
    icms: 0.18,
  }

  // Alíquotas de ISS por tipo de serviço
  const issRates = {
    default: 0.05,
    professional: 0.02,
    technical: 0.03,
    consulting: 0.05,
  }

  // Valores para MEI atualizados 2025
  const getMeiValues = (activityType: ActivityType) => {
    switch (activityType) {
      case 'commerce':
        return { monthlyFee: 65.66, revenueLimit: 8333.33, hasLimit: true }
      case 'services':
        return { monthlyFee: 70.66, revenueLimit: 8333.33, hasLimit: true }
      case 'industry':
        return { monthlyFee: 65.66, revenueLimit: 8333.33, hasLimit: true }
      case 'transport':
        return { monthlyFee: 70.66, revenueLimit: 8333.33, hasLimit: true }
      default:
        return { monthlyFee: 71.66, revenueLimit: 8333.33, hasLimit: true }
    }
  }

  // Função para calcular ISS baseado no anexo
  const getIssRate = (
    activityType: ActivityType,
    annexType: AnnexType
  ): number => {
    if (activityType !== 'services' && activityType !== 'transport') return 0
    switch (annexType) {
      case '6':
        return issRates.professional
      case '5':
        return issRates.technical
      case '4':
        return issRates.consulting
      case '3':
      default:
        return issRates.default
    }
  }

  // Função para obter faixa do Simples
  const getSimplesBracket = (annualRevenue: number): number => {
    for (let i = 0; i < simplesRanges.length; i++) {
      if (annualRevenue <= simplesRanges[i]) return i
    }
    return 5
  }

  // Cálculo do adicional de IRPJ
  const calculateIrpjAdditional = (profit: number): number => {
    const annualValue = period === 'monthly' ? profit * 12 : profit
    const monthlyEquivalent = period === 'monthly' ? profit : profit / 12
    return annualValue > 240000 ? monthlyEquivalent * 0.1 : 0
  }

  // Função para calcular todos os regimes
  const calculateAllRegimes = () => {
    const monthlyRevenueValue = Number(revenue)
    const annualRevenueValue =
      period === 'monthly' ? monthlyRevenueValue * 12 : monthlyRevenueValue
    const monthlyRevenueCalculation =
      period === 'monthly' ? monthlyRevenueValue : monthlyRevenueValue / 12
    const monthlyExpensesValue = Number(expenses)
    const expensesCalculation =
      period === 'monthly' ? monthlyExpensesValue : monthlyExpensesValue / 12

    // Cálculo do Simples Nacional
    const calculateSimples = (): TaxResult => {
      if (annualRevenueValue > 4800000) {
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

      const bracket = getSimplesBracket(annualRevenueValue)
      const nominalRate = simplesTotals[annex][bracket] / 100
      const deduction = simplesDeductions[annex][bracket]
      const effectiveRate =
        (annualRevenueValue * nominalRate - deduction) / annualRevenueValue
      const totalTax = monthlyRevenueCalculation * effectiveRate

      let breakdown: TaxBreakdown = { irpj: 0, csll: 0, pis: 0, cofins: 0 }

      if (annex === '3' || annex === '4' || annex === '5' || annex === '6') {
        breakdown = {
          cpp: totalTax * 0.43,
          iss: totalTax * 0.34,
          irpj: totalTax * 0.095,
          csll: totalTax * 0.05,
          cofins: totalTax * 0.065,
          pis: totalTax * 0.02,
        }
      } else {
        breakdown = {
          cpp: totalTax * 0.41,
          icms: totalTax * 0.34,
          irpj: totalTax * 0.095,
          csll: totalTax * 0.05,
          cofins: totalTax * 0.085,
          pis: totalTax * 0.02,
        }
      }

      return {
        totalTax,
        effectiveRate: effectiveRate * 100,
        breakdown,
        netProfit: monthlyRevenueCalculation - totalTax - expensesCalculation,
      }
    }

    // Cálculo do Lucro Presumido
    const calculatePresumed = (): TaxResult => {
      const rates = presumedRates[activity]
      const irpjBase = monthlyRevenueCalculation * rates.irpj
      const csllBase = monthlyRevenueCalculation * rates.csll

      const irpj = irpjBase * 0.15
      const irpjAdd = calculateIrpjAdditional(irpjBase)
      const csll = csllBase * 0.09
      const pis = monthlyRevenueCalculation * rates.pis
      const cofins = monthlyRevenueCalculation * rates.cofins

      let municipalTax = 0
      if (activity === 'services' || activity === 'transport') {
        const issRate = getIssRate(activity, annex)
        municipalTax = monthlyRevenueCalculation * issRate
      } else {
        municipalTax = monthlyRevenueCalculation * (rates.icms || 0)
        if (activity === 'industry') {
          municipalTax += monthlyRevenueCalculation * (rates.ipi || 0)
        }
      }

      const totalTax = irpj + irpjAdd + csll + pis + cofins + municipalTax
      const effectiveRate = (totalTax / monthlyRevenueCalculation) * 100

      return {
        totalTax,
        effectiveRate,
        breakdown: { irpj: irpj + irpjAdd, csll, pis, cofins, municipalTax },
        netProfit: monthlyRevenueCalculation - totalTax - expensesCalculation,
      }
    }

    // Cálculo do Lucro Real
    const calculateReal = (): TaxResult => {
      const profit = Math.max(
        0,
        monthlyRevenueCalculation - expensesCalculation
      )
      const irpj = profit * realRates.irpj
      const irpjAdd = calculateIrpjAdditional(profit)
      const csll = profit * realRates.csll

      const creditRate = Math.min(
        0.8,
        expensesCalculation / monthlyRevenueCalculation
      )
      const pisCredits = expensesCalculation * creditRate * realRates.pis
      const cofinsCredits = expensesCalculation * creditRate * realRates.cofins

      const pis = Math.max(
        0,
        monthlyRevenueCalculation * realRates.pis - pisCredits
      )
      const cofins = Math.max(
        0,
        monthlyRevenueCalculation * realRates.cofins - cofinsCredits
      )

      let municipalTax = 0
      if (activity === 'services' || activity === 'transport') {
        const issRate = getIssRate(activity, annex)
        municipalTax = monthlyRevenueCalculation * issRate
      } else {
        municipalTax = monthlyRevenueCalculation * (realRates.icms ?? 0)
      }

      const totalTax = irpj + irpjAdd + csll + pis + cofins + municipalTax
      const effectiveRate = (totalTax / monthlyRevenueCalculation) * 100

      return {
        totalTax,
        effectiveRate,
        breakdown: { irpj: irpj + irpjAdd, csll, pis, cofins, municipalTax },
        netProfit: monthlyRevenueCalculation - totalTax - expensesCalculation,
      }
    }

    // Cálculo do MEI
    const calculateMEI = (): TaxResult => {
      const meiValues = getMeiValues(activity)

      return {
        totalTax: meiValues.monthlyFee,
        effectiveRate: (meiValues.monthlyFee / monthlyRevenueCalculation) * 100,
        breakdown: {
          irpj: 0,
          csll: 0,
          pis: 0,
          cofins: 0,
          fixedFee: meiValues.monthlyFee,
          exceedsLimit: monthlyRevenueCalculation > meiValues.revenueLimit,
        },
        netProfit:
          monthlyRevenueCalculation -
          meiValues.monthlyFee -
          expensesCalculation,
      }
    }

    return {
      simples: calculateSimples(),
      presumido: calculatePresumed(),
      real: calculateReal(),
      mei: calculateMEI(),
    }
  }

  // Calcular todos os regimes quando o modal abre
  useEffect(() => {
    if (isOpen && revenue && expenses) {
      const results = calculateAllRegimes()
      setAllTaxResults(results)

      // Preparar dados para o gráfico
      const newChartData = [
        {
          name: 'Simples Nacional',
          impostos: Math.max(0, results.simples.totalTax),
          lucro: Math.max(0, results.simples.netProfit),
          aliquota: Number(results.simples.effectiveRate.toFixed(2)),
        },
        {
          name: 'Lucro Presumido',
          impostos: Math.max(0, results.presumido.totalTax),
          lucro: Math.max(0, results.presumido.netProfit),
          aliquota: Number(results.presumido.effectiveRate.toFixed(2)),
        },
        {
          name: 'Lucro Real',
          impostos: Math.max(0, results.real.totalTax),
          lucro: Math.max(0, results.real.netProfit),
          aliquota: Number(results.real.effectiveRate.toFixed(2)),
        },
        {
          name: 'MEI',
          impostos: Math.max(0, results.mei.totalTax),
          lucro: Math.max(0, results.mei.netProfit),
          aliquota: Number(results.mei.effectiveRate.toFixed(2)),
        },
      ]

      setChartData(newChartData)
      setChartKey((prev) => prev + 1)
    }
  }, [isOpen, revenue, expenses, activity, annex, period])

  // Formatação de moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Obter nome do regime
  const getRegimeName = (regime: string): string => {
    switch (regime) {
      case 'simples':
        return 'Simples Nacional'
      case 'presumido':
        return 'Lucro Presumido'
      case 'real':
        return 'Lucro Real'
      case 'mei':
        return 'MEI'
      default:
        return regime
    }
  }

  // Obter nome da atividade
  const getActivityName = (activityType: ActivityType): string => {
    switch (activityType) {
      case 'services':
        return 'Prestação de Serviços'
      case 'commerce':
        return 'Comércio'
      case 'industry':
        return 'Indústria'
      case 'transport':
        return 'Transporte'
      default:
        return activityType
    }
  }

  // Obter o melhor regime (apenas regimes válidos)
  const getBestRegime = (): string => {
    if (!allTaxResults) return 'N/A'

    const regimes = [
      {
        name: 'Simples Nacional',
        profit: allTaxResults.simples.netProfit,
        isValid: !allTaxResults.simples.breakdown.exceedsLimit,
      },
      {
        name: 'Lucro Presumido',
        profit: allTaxResults.presumido.netProfit,
        isValid: true, // Lucro Presumido não tem limite específico
      },
      {
        name: 'Lucro Real',
        profit: allTaxResults.real.netProfit,
        isValid: true, // Lucro Real não tem limite específico
      },
      {
        name: 'MEI',
        profit: allTaxResults.mei.netProfit,
        isValid: !allTaxResults.mei.breakdown.exceedsLimit,
      },
    ]

    // Filtrar apenas regimes válidos
    const validRegimes = regimes.filter((regime) => regime.isValid)

    if (validRegimes.length === 0) {
      return 'Nenhum regime válido'
    }

    return validRegimes.reduce((best, current) =>
      current.profit > best.profit ? current : best
    ).name
  }

  if (!taxResult) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[900px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Calculator className='h-5 w-5' />
            Análise Detalhada de Impostos
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as 'calculation' | 'comparison' | 'analysis')
          }
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger
              value='calculation'
              className='flex items-center gap-2'
            >
              <FileText className='h-4 w-4' />
              Detalhes
            </TabsTrigger>
            <TabsTrigger value='comparison' className='flex items-center gap-2'>
              <TrendingUp className='h-4 w-4' />
              Comparativo
            </TabsTrigger>
            <TabsTrigger value='analysis' className='flex items-center gap-2'>
              <Info className='h-4 w-4' />
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value='calculation' className='space-y-6 py-4'>
            <div className='grid gap-6 md:grid-cols-2'>
              {/* Parâmetros do Cálculo */}
              <div>
                <h3 className='mb-3 font-semibold flex items-center gap-2'>
                  <Calculator className='h-4 w-4' />
                  Parâmetros do Cálculo
                </h3>
                <div className='rounded-lg bg-muted/50 p-4 space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Regime Tributário
                    </span>
                    <Badge variant='outline'>{getRegimeName(taxRegime)}</Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Atividade
                    </span>
                    <span className='font-medium'>
                      {getActivityName(activity)}
                    </span>
                  </div>
                  {taxRegime === 'simples' && activity === 'services' && (
                    <div className='flex justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Anexo Simples
                      </span>
                      <span className='font-medium'>Anexo {annex}</span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Faturamento ({period === 'monthly' ? 'Mensal' : 'Anual'})
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(
                        period === 'monthly'
                          ? Number(revenue)
                          : Number(revenue) / 12
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Despesas ({period === 'monthly' ? 'Mensais' : 'Anuais'})
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(
                        period === 'monthly'
                          ? Number(expenses)
                          : Number(expenses) / 12
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Alíquota Efetiva
                    </span>
                    <span className='font-bold text-blue-600'>
                      {taxResult.effectiveRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo dos Impostos */}
              <div>
                <h3 className='mb-3 font-semibold flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4' />
                  Resumo dos Impostos
                </h3>
                <div className='rounded-lg bg-muted/50 p-4 space-y-3'>
                  {Object.entries(taxResult.breakdown).map(([key, value]) => {
                    if (typeof value !== 'number' || value <= 0) return null

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
                        label = 'Taxa Fixa MEI'
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

                    const percentage = (
                      (value / taxResult.totalTax) *
                      100
                    ).toFixed(1)

                    return (
                      <div
                        key={key}
                        className='flex justify-between items-center'
                      >
                        <span className='text-sm'>{label}</span>
                        <div className='text-right'>
                          <span className='font-medium'>
                            {formatCurrency(value)}
                          </span>
                          <span className='text-xs text-muted-foreground ml-2'>
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <Separator />
                  <div className='flex justify-between items-center font-bold text-lg'>
                    <span>Total</span>
                    <span className='text-red-600'>
                      {formatCurrency(taxResult.totalTax)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center font-bold text-lg'>
                    <span>Lucro Líquido</span>
                    <span className='text-green-600'>
                      {formatCurrency(taxResult.netProfit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <h3 className='mb-3 font-semibold flex items-center gap-2'>
                <Info className='h-4 w-4' />
                Observações Importantes
              </h3>
              <div className='rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4'>
                <ul className='list-disc space-y-2 pl-5 text-sm'>
                  <li>
                    Este cálculo é uma estimativa baseada nas informações
                    fornecidas e na legislação vigente para 2025.
                  </li>
                  <li>
                    Consulte sempre um contador para validar os valores e obter
                    orientações específicas para o seu caso.
                  </li>
                  <li>
                    O ISS pode variar de acordo com o município onde o serviço é
                    prestado (2% a 5%).
                  </li>
                  {taxResult.breakdown.exceedsLimit && (
                    <li className='text-red-600 font-medium'>
                      ⚠️ Atenção: O faturamento excede o limite permitido para
                      este regime!
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='comparison' className='py-4'>
            <div className='space-y-6'>
              {/* Gráfico de Comparação */}
              <div>
                <h3 className='mb-4 font-semibold flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4' />
                  Comparação Visual dos Regimes
                </h3>
                <div className='rounded-lg border p-4'>
                  <TaxComparisonChart
                    key={`modal-chart-${chartKey}`}
                    data={chartData}
                  />
                </div>
              </div>

              {/* Tabela Comparativa */}
              {allTaxResults && (
                <div>
                  <h3 className='mb-4 font-semibold'>
                    Tabela Comparativa Detalhada
                  </h3>
                  <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                      <thead>
                        <tr className='border-b-2'>
                          <th className='pb-3 text-left font-semibold'>
                            Regime Tributário
                          </th>
                          <th className='pb-3 text-right font-semibold'>
                            Total de Impostos
                          </th>
                          <th className='pb-3 text-right font-semibold'>
                            Alíquota Efetiva
                          </th>
                          <th className='pb-3 text-right font-semibold'>
                            Lucro Líquido
                          </th>
                          <th className='pb-3 text-center font-semibold'>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(allTaxResults).map(
                          ([regime, result]) => {
                            const isCurrentRegime =
                              (regime === 'simples' &&
                                taxRegime === 'simples') ||
                              (regime === 'presumido' &&
                                taxRegime === 'presumido') ||
                              (regime === 'real' && taxRegime === 'real') ||
                              (regime === 'mei' && taxRegime === 'mei')

                            const isBest =
                              getBestRegime() ===
                              (regime === 'simples'
                                ? 'Simples Nacional'
                                : regime === 'presumido'
                                ? 'Lucro Presumido'
                                : regime === 'real'
                                ? 'Lucro Real'
                                : 'MEI')

                            const exceedsLimit = result.breakdown.exceedsLimit

                            return (
                              <tr
                                key={regime}
                                className={`border-b ${
                                  isCurrentRegime
                                    ? 'bg-blue-50 dark:bg-blue-950/20'
                                    : ''
                                } ${
                                  exceedsLimit
                                    ? 'opacity-60 bg-gray-50 dark:bg-gray-900/20'
                                    : ''
                                }`}
                              >
                                <td className='py-4'>
                                  <div className='flex items-center gap-2'>
                                    <span
                                      className={`font-medium ${
                                        exceedsLimit
                                          ? 'line-through text-muted-foreground'
                                          : ''
                                      }`}
                                    >
                                      {regime === 'simples'
                                        ? 'Simples Nacional'
                                        : regime === 'presumido'
                                        ? 'Lucro Presumido'
                                        : regime === 'real'
                                        ? 'Lucro Real'
                                        : 'MEI'}
                                    </span>
                                    {isCurrentRegime && (
                                      <Badge variant='secondary'>Atual</Badge>
                                    )}
                                    {exceedsLimit && (
                                      <Badge
                                        variant='destructive'
                                        className='text-xs'
                                      >
                                        Inválido
                                      </Badge>
                                    )}
                                  </div>
                                  {regime === 'simples' &&
                                    activity === 'services' && (
                                      <span className='text-xs text-muted-foreground'>
                                        Anexo {annex}
                                      </span>
                                    )}
                                </td>
                                <td
                                  className={`py-4 text-right font-medium ${
                                    exceedsLimit
                                      ? 'text-muted-foreground'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {formatCurrency(result.totalTax)}
                                </td>
                                <td
                                  className={`py-4 text-right font-medium ${
                                    exceedsLimit ? 'text-muted-foreground' : ''
                                  }`}
                                >
                                  {result.effectiveRate.toFixed(2)}%
                                </td>
                                <td
                                  className={`py-4 text-right font-medium ${
                                    exceedsLimit
                                      ? 'text-muted-foreground'
                                      : 'text-green-600'
                                  }`}
                                >
                                  {formatCurrency(result.netProfit)}
                                </td>
                                <td className='py-4 text-center'>
                                  {isBest && !exceedsLimit && (
                                    <Badge className='bg-green-500'>
                                      🏆 Melhor
                                    </Badge>
                                  )}
                                  {exceedsLimit && (
                                    <Badge variant='destructive'>
                                      ⚠️ Limite Excedido
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            )
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='analysis' className='py-4'>
            <div className='space-y-6'>
              {allTaxResults && (
                <>
                  <div>
                    <h3 className='mb-4 font-semibold flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4' />
                      Análise Estratégica
                    </h3>
                    <div className='rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6'>
                      <div className='space-y-4'>
                        <div>
                          <h4 className='font-semibold text-lg mb-2'>
                            🏆 Melhor Regime Para Você:
                          </h4>
                          <p className='text-lg'>
                            <span className='font-bold text-blue-600'>
                              {getBestRegime()}
                            </span>{' '}
                            com lucro líquido de{' '}
                            <span className='font-bold text-green-600'>
                              {(() => {
                                const validRegimes = [
                                  {
                                    name: 'Simples Nacional',
                                    profit: allTaxResults.simples.netProfit,
                                    isValid:
                                      !allTaxResults.simples.breakdown
                                        .exceedsLimit,
                                  },
                                  {
                                    name: 'Lucro Presumido',
                                    profit: allTaxResults.presumido.netProfit,
                                    isValid: true,
                                  },
                                  {
                                    name: 'Lucro Real',
                                    profit: allTaxResults.real.netProfit,
                                    isValid: true,
                                  },
                                  {
                                    name: 'MEI',
                                    profit: allTaxResults.mei.netProfit,
                                    isValid:
                                      !allTaxResults.mei.breakdown.exceedsLimit,
                                  },
                                ].filter((regime) => regime.isValid)

                                if (validRegimes.length === 0)
                                  return formatCurrency(0)

                                const bestProfit = validRegimes.reduce(
                                  (best, current) =>
                                    current.profit > best.profit
                                      ? current
                                      : best
                                ).profit

                                return formatCurrency(bestProfit)
                              })()}
                            </span>
                          </p>

                          {/* Avisos sobre regimes que excedem limites */}
                          {(allTaxResults.mei.breakdown.exceedsLimit ||
                            allTaxResults.simples.breakdown.exceedsLimit) && (
                            <div className='mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700'>
                              <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2'>
                                ⚠️ Regimes com Limitações:
                              </p>
                              <ul className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
                                {allTaxResults.mei.breakdown.exceedsLimit && (
                                  <li>
                                    • MEI: Faturamento excede o limite de R$
                                    100.000/ano
                                  </li>
                                )}
                                {allTaxResults.simples.breakdown
                                  .exceedsLimit && (
                                  <li>
                                    • Simples Nacional: Faturamento excede o
                                    limite de R$ 4.800.000/ano
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className='font-semibold mb-2'>
                            💰 Economia Potencial:
                          </h4>
                          <p>
                            Comparado ao regime atual (
                            {getRegimeName(taxRegime)}), você poderia
                            {(() => {
                              const currentProfit = taxResult.netProfit

                              // Considerar apenas regimes válidos para economia
                              const validRegimes = [
                                {
                                  name: 'Simples Nacional',
                                  profit: allTaxResults.simples.netProfit,
                                  isValid:
                                    !allTaxResults.simples.breakdown
                                      .exceedsLimit,
                                },
                                {
                                  name: 'Lucro Presumido',
                                  profit: allTaxResults.presumido.netProfit,
                                  isValid: true,
                                },
                                {
                                  name: 'Lucro Real',
                                  profit: allTaxResults.real.netProfit,
                                  isValid: true,
                                },
                                {
                                  name: 'MEI',
                                  profit: allTaxResults.mei.netProfit,
                                  isValid:
                                    !allTaxResults.mei.breakdown.exceedsLimit,
                                },
                              ].filter((regime) => regime.isValid)

                              if (validRegimes.length === 0) {
                                return ' não tem opções válidas de regime tributário para este faturamento.'
                              }

                              const bestProfit = validRegimes.reduce(
                                (best, current) =>
                                  current.profit > best.profit ? current : best
                              ).profit

                              const difference = bestProfit - currentProfit

                              if (difference > 0) {
                                return ` economizar ${formatCurrency(
                                  difference
                                )} por mês.`
                              } else {
                                return ' já está no regime mais vantajoso!'
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='mb-4 font-semibold'>
                      📊 Análise por Regime
                    </h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                      {Object.entries(allTaxResults).map(([regime, result]) => (
                        <div key={regime} className='rounded-lg border p-4'>
                          <h4 className='font-semibold mb-2'>
                            {regime === 'simples'
                              ? 'Simples Nacional'
                              : regime === 'presumido'
                              ? 'Lucro Presumido'
                              : regime === 'real'
                              ? 'Lucro Real'
                              : 'MEI'}
                          </h4>
                          <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                              <span>Impostos:</span>
                              <span className='text-red-600'>
                                {formatCurrency(result.totalTax)}
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span>Alíquota:</span>
                              <span>{result.effectiveRate.toFixed(2)}%</span>
                            </div>
                            <div className='flex justify-between'>
                              <span>Lucro:</span>
                              <span className='text-green-600'>
                                {formatCurrency(result.netProfit)}
                              </span>
                            </div>
                            {result.breakdown.exceedsLimit && (
                              <p className='text-red-600 text-xs'>
                                ⚠️ Excede limite do regime
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className='mb-4 font-semibold'>💡 Recomendações</h3>
                    <div className='rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-4'>
                      <ul className='list-disc space-y-2 pl-5 text-sm'>
                        <li>
                          <span className='font-medium'>
                            Planejamento Anual:
                          </span>{' '}
                          Considere projetar o faturamento anual para evitar
                          mudanças obrigatórias de regime.
                        </li>
                        <li>
                          <span className='font-medium'>
                            Controle de Despesas:
                          </span>{' '}
                          No Lucro Real, maior controle de despesas pode gerar
                          mais créditos tributários.
                        </li>
                        <li>
                          <span className='font-medium'>
                            Timing de Mudança:
                          </span>{' '}
                          Alterações de regime só são possíveis no início do
                          ano-calendário.
                        </li>
                        <li>
                          <span className='font-medium'>
                            Consultoria Especializada:
                          </span>{' '}
                          Para decisões definitivas, consulte sempre um contador
                          especializado.
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={onClose}>
            Fechar
          </Button>
          <Button variant='outline'>
            <FileText className='h-4 w-4 mr-2' />
            Salvar PDF
          </Button>
          <Button>
            <TrendingUp className='h-4 w-4 mr-2' />
            Exportar Análise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
