'use client'

import { useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  Code,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AdminView } from './admin-dashboard'

interface TabNavigationProps {
  currentView: AdminView
  onViewChange: (view: AdminView) => void
}

export function TabNavigation({
  currentView,
  onViewChange,
}: TabNavigationProps) {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const mainTabs = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      view: 'dashboard' as AdminView,
    },
    {
      title: 'Usuários',
      icon: Users,
      view: 'users' as AdminView,
    },
    {
      title: 'Planos',
      icon: Package,
      view: 'plans' as AdminView,
    },
    {
      title: 'Notificações',
      icon: Bell,
      view: 'notifications' as AdminView,
    },
    {
      title: 'Dev Controller',
      icon: Code,
      view: 'dev-controller' as AdminView,
    },
  ]

  return (
    <div className='border-b bg-background'>
      <div className='flex items-center px-4 overflow-x-auto'>
        {mainTabs.map((tab) => (
          <Button
            key={tab.view}
            variant='ghost'
            className={cn(
              'flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2',
              currentView === tab.view
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onViewChange(tab.view)}
          >
            <tab.icon className='h-5 w-5' />
            <span>{tab.title}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
