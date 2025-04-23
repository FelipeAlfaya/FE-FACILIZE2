'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ReportGenerationModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ReportGenerationModal({
  isOpen,
  onClose,
}: ReportGenerationModalProps) {
  const [reportType, setReportType] = useState('financial')
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [isScheduled, setIsScheduled] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Gerar Novo Relatório</DialogTitle>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>

        <Tabs defaultValue='generate' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='generate'>Gerar Relatório</TabsTrigger>
            <TabsTrigger value='schedule'>Agendar Relatório</TabsTrigger>
          </TabsList>
          <TabsContent value='generate' className='space-y-4 py-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='report-name'>Nome do Relatório</Label>
                <Input
                  id='report-name'
                  placeholder='Ex: Demonstrativo Financeiro Abril 2023'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='report-type'>Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id='report-type'>
                    <SelectValue placeholder='Selecione o tipo de relatório' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='financial'>
                      Demonstrativo de Resultados
                    </SelectItem>
                    <SelectItem value='cashflow'>Fluxo de Caixa</SelectItem>
                    <SelectItem value='tax'>Relatório de Impostos</SelectItem>
                    <SelectItem value='balance'>Balanço Patrimonial</SelectItem>
                    <SelectItem value='sales'>Relatório de Vendas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Período do Relatório</Label>
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
                <Label htmlFor='report-format'>Formato do Relatório</Label>
                <Select defaultValue='pdf'>
                  <SelectTrigger id='report-format'>
                    <SelectValue placeholder='Selecione o formato' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pdf'>PDF</SelectItem>
                    <SelectItem value='excel'>Excel</SelectItem>
                    <SelectItem value='csv'>CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Opções Adicionais</Label>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='include-charts' />
                    <label
                      htmlFor='include-charts'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Incluir gráficos e visualizações
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='include-comparison' />
                    <label
                      htmlFor='include-comparison'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Incluir comparativo com período anterior
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='include-notes' />
                    <label
                      htmlFor='include-notes'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Incluir notas explicativas
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='schedule' className='space-y-4 py-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='schedule-name'>
                  Nome do Relatório Agendado
                </Label>
                <Input
                  id='schedule-name'
                  placeholder='Ex: Demonstrativo Financeiro Mensal'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='schedule-type'>Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id='schedule-type'>
                    <SelectValue placeholder='Selecione o tipo de relatório' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='financial'>
                      Demonstrativo de Resultados
                    </SelectItem>
                    <SelectItem value='cashflow'>Fluxo de Caixa</SelectItem>
                    <SelectItem value='tax'>Relatório de Impostos</SelectItem>
                    <SelectItem value='balance'>Balanço Patrimonial</SelectItem>
                    <SelectItem value='sales'>Relatório de Vendas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='frequency'>Frequência</Label>
                <Select defaultValue='monthly'>
                  <SelectTrigger id='frequency'>
                    <SelectValue placeholder='Selecione a frequência' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='daily'>Diário</SelectItem>
                    <SelectItem value='weekly'>Semanal</SelectItem>
                    <SelectItem value='monthly'>Mensal</SelectItem>
                    <SelectItem value='quarterly'>Trimestral</SelectItem>
                    <SelectItem value='yearly'>Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='day'>Dia de Geração</Label>
                <Select defaultValue='5'>
                  <SelectTrigger id='day'>
                    <SelectValue placeholder='Selecione o dia' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Dia 1</SelectItem>
                    <SelectItem value='5'>Dia 5</SelectItem>
                    <SelectItem value='10'>Dia 10</SelectItem>
                    <SelectItem value='15'>Dia 15</SelectItem>
                    <SelectItem value='20'>Dia 20</SelectItem>
                    <SelectItem value='25'>Dia 25</SelectItem>
                    <SelectItem value='last'>Último dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='report-format-schedule'>
                  Formato do Relatório
                </Label>
                <Select defaultValue='pdf'>
                  <SelectTrigger id='report-format-schedule'>
                    <SelectValue placeholder='Selecione o formato' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pdf'>PDF</SelectItem>
                    <SelectItem value='excel'>Excel</SelectItem>
                    <SelectItem value='csv'>CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Opções de Entrega</Label>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='email-delivery' defaultChecked />
                    <label
                      htmlFor='email-delivery'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Enviar por email
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='save-platform' defaultChecked />
                    <label
                      htmlFor='save-platform'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      Salvar na plataforma
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button>
            {isScheduled ? 'Agendar Relatório' : 'Gerar Relatório'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
