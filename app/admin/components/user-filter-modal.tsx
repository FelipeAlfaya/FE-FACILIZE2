'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface UserFilterModalProps {
  onApplyFilters: (filters: UserFilters) => void
}

export interface UserFilters {
  search: string
  userType: 'ALL' | 'CLIENT' | 'PROVIDER' | 'ADMIN'
  emailVerified: boolean | null
  phoneVerified: boolean | null
  isAdmin: boolean | null
  createdFrom: Date | null
  createdTo: Date | null
}

const defaultFilters: UserFilters = {
  search: '',
  userType: 'ALL',
  emailVerified: null,
  phoneVerified: null,
  isAdmin: null,
  createdFrom: null,
  createdTo: null,
}

export function UserFilterModal({ onApplyFilters }: UserFilterModalProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<UserFilters>(defaultFilters)

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    setOpen(false)
  }

  const handleResetFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Filter className='h-4 w-4' />
          Filtrar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Filtrar Usuários</DialogTitle>
          <DialogDescription>
            Defina os critérios para filtrar a lista de usuários.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='search'>Busca</Label>
            <Input
              id='search'
              placeholder='Nome, email ou telefone'
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Tipo de Usuário</Label>
            <RadioGroup
              value={filters.userType}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  userType: value as UserFilters['userType'],
                })
              }
              className='flex flex-col space-y-1'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='ALL' id='all' />
                <Label htmlFor='all' className='font-normal'>
                  Todos
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='CLIENT' id='client' />
                <Label htmlFor='client' className='font-normal'>
                  Cliente
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='PROVIDER' id='provider' />
                <Label htmlFor='provider' className='font-normal'>
                  Fornecedor
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='ADMIN' id='admin' />
                <Label htmlFor='admin' className='font-normal'>
                  Administrador
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className='space-y-2'>
            <Label>Status de Verificação</Label>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='emailVerified'
                  checked={filters.emailVerified === true}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      emailVerified:
                        checked === 'indeterminate' ? null : checked,
                    })
                  }
                />
                <Label htmlFor='emailVerified' className='font-normal'>
                  Email Verificado
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='phoneVerified'
                  checked={filters.phoneVerified === true}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      phoneVerified:
                        checked === 'indeterminate' ? null : checked,
                    })
                  }
                />
                <Label htmlFor='phoneVerified' className='font-normal'>
                  Telefone Verificado
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isAdmin'
                  checked={filters.isAdmin === true}
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      isAdmin: checked === 'indeterminate' ? null : checked,
                    })
                  }
                />
                <Label htmlFor='isAdmin' className='font-normal'>
                  Administrador
                </Label>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Data de Criação</Label>
            <div className='flex flex-col sm:flex-row gap-2'>
              <div className='flex-1 space-y-1'>
                <Label htmlFor='createdFrom' className='text-xs'>
                  De
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.createdFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {filters.createdFrom
                        ? format(filters.createdFrom, 'PPP', { locale: ptBR })
                        : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={filters.createdFrom || undefined}
                      onSelect={(date) =>
                        setFilters({ ...filters, createdFrom: date || null })
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='flex-1 space-y-1'>
                <Label htmlFor='createdTo' className='text-xs'>
                  Até
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.createdTo && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {filters.createdTo
                        ? format(filters.createdTo, 'PPP', { locale: ptBR })
                        : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={filters.createdTo || undefined}
                      onSelect={(date) =>
                        setFilters({ ...filters, createdTo: date || null })
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2'>
          <Button variant='outline' onClick={handleResetFilters}>
            Limpar Filtros
          </Button>
          <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

