'use client'

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { date: 'Jan', revenue: 4000 },
  { date: 'Fev', revenue: 4200 },
  { date: 'Mar', revenue: 5800 },
  { date: 'Abr', revenue: 5200 },
  { date: 'Mai', revenue: 6000 },
  { date: 'Jun', revenue: 7200 },
  { date: 'Jul', revenue: 8500 },
  { date: 'Ago', revenue: 9800 },
  { date: 'Set', revenue: 10200 },
  { date: 'Out', revenue: 11000 },
  { date: 'Nov', revenue: 12500 },
  { date: 'Dez', revenue: 12450 },
]

export function AccountingRevenueChart() {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: 'Receita',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className='h-[300px]'
    >
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey='date'
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(value) => `R$${value}`}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type='monotone'
            dataKey='revenue'
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: 'var(--color-revenue)', opacity: 0.8 },
            }}
            stroke='var(--color-revenue)'
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
