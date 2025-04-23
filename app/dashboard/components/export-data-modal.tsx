'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePickerWithRange } from './date-range-picker'
import { useState } from 'react'

type ExportDataModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='export-type'>Tipo de Dados</Label>
            <Select defaultValue='transactions'>
              <SelectTrigger id='export-type'>
                <SelectValue placeholder='Selecione o tipo de dados' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='transactions'>Transações</SelectItem>
                <SelectItem value='invoices'>Notas Fiscais</SelectItem>
                <SelectItem value='taxes'>Impostos</SelectItem>
                <SelectItem value='clients'>Clientes</SelectItem>
                <SelectItem value='services'>Serviços</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Período</Label>
            <DatePickerWithRange
              date={dateRange}
              setDate={(date) =>
                setDateRange({
                  from: date.from || new Date(),
                  to: date.to || new Date(),
                })
              }
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='export-format'>Formato</Label>
            <Select defaultValue='excel'>
              <SelectTrigger id='export-format'>
                <SelectValue placeholder='Selecione o formato' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='excel'>Excel (.xlsx)</SelectItem>
                <SelectItem value='csv'>CSV</SelectItem>
                <SelectItem value='pdf'>PDF</SelectItem>
                <SelectItem value='json'>JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Opções</Label>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='include-headers' defaultChecked />
                <label
                  htmlFor='include-headers'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Incluir cabeçalhos
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='include-totals' defaultChecked />
                <label
                  htmlFor='include-totals'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Incluir totais
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='include-metadata' />
                <label
                  htmlFor='include-metadata'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Incluir metadados
                </label>
              </div>
            </div>
          </div>

          <div className='rounded-md bg-muted p-4'>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <p className='text-sm'>
                Os dados exportados estarão disponíveis para download por 7
                dias.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button>Exportar Dados</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
