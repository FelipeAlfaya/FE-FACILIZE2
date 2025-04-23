'use client'

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

export function TaxResultsChart({ results }: TaxResultsChartProps) {
  const data = [
    { name: 'Imposto de Renda', value: results.incomeTax },
    { name: 'Contribuição Social', value: results.socialSecurity },
    { name: 'ISS/ICMS', value: results.municipalTax },
    { name: 'Outros Impostos', value: results.otherTaxes },
  ]

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ]

  return (
    <div className='h-[200px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value),
              '',
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
