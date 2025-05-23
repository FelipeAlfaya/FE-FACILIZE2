'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Settings,
  Code,
  BarChart,
  LogOut,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Planos',
    href: '/admin/plans',
    icon: Package,
  },
  {
    title: 'Controlador Dev',
    href: '/admin/dev-controller',
    icon: Code,
  },
  {
    title: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <nav className='grid gap-1 p-2'>
      {navItems.map((item, index) => (
        <Button
          key={index}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          asChild
          className={cn(
            'justify-start',
            pathname === item.href ? 'bg-secondary' : 'hover:bg-accent'
          )}
        >
          <Link href={item.href}>
            <item.icon className='mr-2 h-4 w-4' />
            {item.title}
          </Link>
        </Button>
      ))}
      <Button
        variant='ghost'
        className='justify-start mt-auto'
        onClick={logout}
      >
        <LogOut className='mr-2 h-4 w-4' />
        Sair
      </Button>
    </nav>
  )
}
