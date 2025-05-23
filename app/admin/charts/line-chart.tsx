'use client'

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4000 },
  { name: 'May', revenue: 7000 },
  { name: 'Jun', revenue: 6000 },
  { name: 'Jul', revenue: 8000 },
  { name: 'Aug', revenue: 9000 },
  { name: 'Sep', revenue: 8500 },
  { name: 'Oct', revenue: 9500 },
  { name: 'Nov', revenue: 10000 },
  { name: 'Dec', revenue: 12000 },
]

export function LineChart() {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className='rounded-lg border bg-background p-2 shadow-sm'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='flex flex-col'>
                      <span className='text-[0.70rem] uppercase text-muted-foreground'>
                        Month
                      </span>
                      <span className='font-bold text-muted-foreground'>
                        {payload[0].payload.name}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-[0.70rem] uppercase text-muted-foreground'>
                        Revenue
                      </span>
                      <span className='font-bold'>${payload[0].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type='monotone'
          dataKey='revenue'
          stroke='#8884d8'
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

