'use client'

import React, { useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

interface TaxResultsChartProps {
  results: {
    incomeTax: number
    socialSecurity: number
    municipalTax: number
    otherTaxes: number
    totalTax: number
    effectiveRate: number
  }
}

function TaxResultsChart({ results }: TaxResultsChartProps) {
  // Debug: Log quando o componente recebe novos dados
  useEffect(() => {
    console.log('TaxResultsChart recebeu novos dados:', results)
  }, [results])

  // Formatação de moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Validação e preparação dos dados
  const rawData = [
    {
      name: 'Imposto de Renda (IRPJ)',
      value: Math.max(0, results.incomeTax || 0),
    },
    {
      name: 'Contribuição Social (CSLL)',
      value: Math.max(0, results.socialSecurity || 0),
    },
    { name: 'ISS/ICMS', value: Math.max(0, results.municipalTax || 0) },
    {
      name: 'Outros Impostos (PIS/COFINS/CPP)',
      value: Math.max(0, results.otherTaxes || 0),
    },
  ]

  // Filtrar apenas dados com valores > 0
  const data = rawData.filter((item) => item.value > 0)

  const COLORS = [
    '#8b5cf6', // Roxo
    '#06b6d4', // Cyan
    '#10b981', // Verde
    '#f59e0b', // Amarelo
  ]

  // Se não há dados válidos, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
        <div className='text-center'>
          <p className='text-lg font-medium'>Nenhum imposto calculado</p>
          <p className='text-sm'>Verifique os dados informados</p>
        </div>
      </div>
    )
  }

  // Calcular percentuais para exibir no tooltip
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className='h-[200px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={70}
            innerRadius={25}
            fill='#8884d8'
            dataKey='value'
            stroke='#fff'
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              const percentage = ((value / totalValue) * 100).toFixed(1)
              return [`${formatCurrency(value)} (${percentage}%)`, name]
            }}
            labelStyle={{ color: '#000', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend
            verticalAlign='bottom'
            height={36}
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Resumo dos totais */}
      <div className='mt-2 text-center'>
        <div className='text-sm text-muted-foreground'>
          Total de Impostos:{' '}
          <span className='font-medium text-foreground'>
            {formatCurrency(totalValue)}
          </span>
        </div>
        <div className='text-xs text-muted-foreground'>
          Alíquota Efetiva:{' '}
          <span className='font-medium'>
            {results.effectiveRate.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export { TaxResultsChart }
