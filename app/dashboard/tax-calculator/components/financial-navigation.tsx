'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, BarChart, Calculator, DollarSign, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FinancialNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Contabilidade',
      href: '/dashboard/accounting',
      icon: DollarSign,
    },
    {
      name: 'Relatórios',
      href: '/dashboard/financial-reports',
      icon: BarChart,
    },
    {
      name: 'Calculadora',
      href: '/dashboard/tax-calculator',
      icon: Calculator,
    },
  ]

  return (
    <div className='mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
      <div className='flex items-center space-x-2'>
        <Button variant='outline' size='icon' asChild>
          <Link href='/dashboard'>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar para o Dashboard</span>
          </Link>
        </Button>
        <h1 className='text-2xl font-bold'>
          {navItems.find((item) => item.href === pathname)?.name || 'Finanças'}
        </h1>
      </div>
      <div className='flex flex-wrap gap-2'>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant={isActive ? 'default' : 'outline'}
              size='sm'
              className={cn(
                'flex items-center gap-1',
                isActive && 'pointer-events-none'
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className='h-4 w-4' />
                <span>{item.name}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

