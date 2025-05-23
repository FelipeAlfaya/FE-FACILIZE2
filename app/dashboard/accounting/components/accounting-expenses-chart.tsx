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

// Sample data
const data = [
  { date: 'Jan', expenses: 1200 },
  { date: 'Fev', expenses: 1500 },
  { date: 'Mar', expenses: 1800 },
  { date: 'Abr', expenses: 1600 },
  { date: 'Mai', expenses: 2000 },
  { date: 'Jun', expenses: 2200 },
  { date: 'Jul', expenses: 2500 },
  { date: 'Ago', expenses: 2800 },
  { date: 'Set', expenses: 3000 },
  { date: 'Out', expenses: 3200 },
  { date: 'Nov', expenses: 3500 },
  { date: 'Dez', expenses: 3850 },
]

export function AccountingExpensesChart() {
  return (
    <ChartContainer
      config={{
        expenses: {
          label: 'Despesas',
          color: 'hsl(var(--chart-2))',
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
            dataKey='expenses'
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: 'var(--color-expenses)', opacity: 0.8 },
            }}
            stroke='var(--color-expenses)'
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

