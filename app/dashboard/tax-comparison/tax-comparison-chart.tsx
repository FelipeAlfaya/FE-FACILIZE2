'use client'

import React, { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartDataItem {
  name: string
  impostos: number
  lucro: number
  aliquota: number
}

interface TaxComparisonChartProps {
  data: ChartDataItem[]
}

function TaxComparisonChart({ data }: TaxComparisonChartProps) {
  // Debug: Log quando o componente recebe novos dados
  useEffect(() => {
    console.log('TaxComparisonChart recebeu novos dados:', data)
  }, [data])

  // Formatação de moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Validação e limpeza dos dados
  const validData = data
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      name: item.name || 'Sem nome',
      impostos: Math.max(0, Number(item.impostos) || 0),
      lucro: Math.max(0, Number(item.lucro) || 0),
      aliquota: Math.max(0, Number(item.aliquota) || 0),
    }))

  // Se não há dados válidos, mostrar mensagem
  if (validData.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center text-muted-foreground'>
        <p>Nenhum dado disponível para o gráfico</p>
      </div>
    )
  }

  // Cores para destacar o melhor regime (maior lucro)
  const getBestRegime = () => {
    return validData.reduce((prev, current) =>
      current.lucro > prev.lucro ? current : prev
    )
  }

  const bestRegime = getBestRegime()

  const getBarColor = (entry: ChartDataItem, dataKey: string) => {
    if (dataKey === 'impostos') {
      return entry.name === bestRegime.name ? '#dc2626' : '#ef4444'
    } else {
      return entry.name === bestRegime.name ? '#16a34a' : '#22c55e'
    }
  }

  return (
    <div className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={validData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
          <XAxis
            dataKey='name'
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor='end'
            height={80}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `R$ ${(value / 1000).toFixed(0)}k`
              }
              return formatCurrency(value)
            }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name,
            ]}
            labelStyle={{ color: '#000', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar
            dataKey='impostos'
            name='Total de Impostos'
            fill='#ef4444'
            radius={[4, 4, 0, 0]}
          >
            {validData.map((entry, index) => (
              <Cell
                key={`cell-impostos-${index}`}
                fill={getBarColor(entry, 'impostos')}
              />
            ))}
          </Bar>
          <Bar
            dataKey='lucro'
            name='Lucro Líquido'
            fill='#22c55e'
            radius={[4, 4, 0, 0]}
          >
            {validData.map((entry, index) => (
              <Cell
                key={`cell-lucro-${index}`}
                fill={getBarColor(entry, 'lucro')}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Indicador do melhor regime */}
      <div className='mt-2 text-center text-sm text-muted-foreground'>
        <span className='inline-flex items-center gap-1'>
          🏆 Melhor opção: <strong>{bestRegime.name}</strong>
          (Lucro: {formatCurrency(bestRegime.lucro)})
        </span>
      </div>
    </div>
  )
}

export { TaxComparisonChart }
