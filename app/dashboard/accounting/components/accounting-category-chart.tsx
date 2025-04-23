'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { name: 'Consultorias', value: 5500, color: 'hsl(var(--chart-1))' },
  { name: 'Serviços Recorrentes', value: 3200, color: 'hsl(var(--chart-2))' },
  { name: 'Projetos', value: 2100, color: 'hsl(var(--chart-3))' },
  { name: 'Treinamentos', value: 1650, color: 'hsl(var(--chart-4))' },
]

export function AccountingCategoryChart() {
  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
      <div>
        <h3 className='mb-4 text-lg font-medium'>Receitas por Categoria</h3>
        <ChartContainer
          config={{
            category: {
              label: 'Categoria',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className='h-[300px]'
        >
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div>
        <h3 className='mb-4 text-lg font-medium'>Despesas por Categoria</h3>
        <ChartContainer
          config={{
            category: {
              label: 'Categoria',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className='h-[300px]'
        >
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={[
                  {
                    name: 'Salários',
                    value: 1800,
                    color: 'hsl(var(--chart-5))',
                  },
                  {
                    name: 'Marketing',
                    value: 850,
                    color: 'hsl(var(--chart-6))',
                  },
                  {
                    name: 'Infraestrutura',
                    value: 650,
                    color: 'hsl(var(--chart-7))',
                  },
                  {
                    name: 'Impostos',
                    value: 550,
                    color: 'hsl(var(--chart-8))',
                  },
                ]}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
