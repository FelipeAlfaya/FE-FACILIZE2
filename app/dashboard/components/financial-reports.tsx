'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Download, FileText, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FinancialNavigation } from '../tax-calculator/components/financial-navigation'
import { ReportGenerationModal } from './report-generation-modal'
import { ExportDataModal } from './export-data-modal'
import { DevelopmentProvider } from '@/context/DevelopmentContext'

export function FinancialReports() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [reportType, setReportType] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const handleGenerateReport = () => {
    setShowGenerateModal(true)
  }

  const handleExportData = () => {
    setShowExportModal(true)
  }

  return (
    <DevelopmentProvider isDevelopment={true}>
      <div className='container mx-auto p-6'>
        <FinancialNavigation />

        <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar relatórios...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Tipo de relatório' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos os relatórios</SelectItem>
                <SelectItem value='financial'>Financeiros</SelectItem>
                <SelectItem value='tax'>Fiscais</SelectItem>
                <SelectItem value='operational'>Operacionais</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' size='sm' onClick={handleExportData}>
              <Download className='mr-2 h-4 w-4' />
              Exportar
            </Button>
            <Button size='sm' onClick={handleGenerateReport}>
              <Plus className='mr-2 h-4 w-4' />
              Novo Relatório
            </Button>
          </div>
        </div>

        <Tabs defaultValue='reports'>
          <TabsList className='grid-row w-full md:w-auto md:grid-cols-none'>
            <TabsTrigger value='reports'>Meus Relatórios</TabsTrigger>
            <TabsTrigger value='templates'>Modelos</TabsTrigger>
            <TabsTrigger value='scheduled'>Agendados</TabsTrigger>
          </TabsList>
          <TabsContent value='reports' className='mt-4 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Recentes</CardTitle>
                <CardDescription>
                  Relatórios gerados nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>Demonstrativo de Resultados</p>
                      <p className='text-sm text-muted-foreground'>
                        Abril 2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <FileText className='mr-2 h-4 w-4' />
                        Visualizar
                      </Button>
                      <Button variant='outline' size='sm'>
                        <Download className='mr-2 h-4 w-4' />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>Fluxo de Caixa</p>
                      <p className='text-sm text-muted-foreground'>
                        Abril 2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <FileText className='mr-2 h-4 w-4' />
                        Visualizar
                      </Button>
                      <Button variant='outline' size='sm'>
                        <Download className='mr-2 h-4 w-4' />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>Relatório de Impostos</p>
                      <p className='text-sm text-muted-foreground'>
                        1º Trimestre 2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <FileText className='mr-2 h-4 w-4' />
                        Visualizar
                      </Button>
                      <Button variant='outline' size='sm'>
                        <Download className='mr-2 h-4 w-4' />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>Balanço Patrimonial</p>
                      <p className='text-sm text-muted-foreground'>
                        Março 2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <FileText className='mr-2 h-4 w-4' />
                        Visualizar
                      </Button>
                      <Button variant='outline' size='sm'>
                        <Download className='mr-2 h-4 w-4' />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  Ver Todos os Relatórios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='templates' className='mt-4 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Modelos de Relatórios</CardTitle>
                <CardDescription>
                  Modelos pré-configurados para geração rápida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <Card className='border-2 border-dashed'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Demonstrativo de Resultados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <p className='text-sm text-muted-foreground'>
                        Relatório de receitas, despesas e lucro em um período
                        específico.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={handleGenerateReport}
                      >
                        Gerar Relatório
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className='border-2 border-dashed'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Fluxo de Caixa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <p className='text-sm text-muted-foreground'>
                        Análise detalhada das entradas e saídas de caixa no
                        período.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={handleGenerateReport}
                      >
                        Gerar Relatório
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className='border-2 border-dashed'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Relatório de Impostos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <p className='text-sm text-muted-foreground'>
                        Resumo dos impostos pagos e a pagar em um período
                        específico.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={handleGenerateReport}
                      >
                        Gerar Relatório
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className='border-2 border-dashed'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Balanço Patrimonial
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <p className='text-sm text-muted-foreground'>
                        Visão geral dos ativos, passivos e patrimônio líquido da
                        empresa.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={handleGenerateReport}
                      >
                        Gerar Relatório
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className='border-2 border-dashed'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Análise de Rentabilidade
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <p className='text-sm text-muted-foreground'>
                        Indicadores de rentabilidade e lucratividade do negócio.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={handleGenerateReport}
                      >
                        Gerar Relatório
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className='border-2 border-dashed'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>
                        Relatório de Vendas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='pb-2'>
                      <p className='text-sm text-muted-foreground'>
                        Análise detalhada das vendas por período, cliente e
                        serviço.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={handleGenerateReport}
                      >
                        Gerar Relatório
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='scheduled' className='mt-4 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Agendados</CardTitle>
                <CardDescription>
                  Relatórios configurados para geração automática
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>
                        Demonstrativo de Resultados Mensal
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Gerado todo dia 5 | Próximo: 05/06/2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <Calendar className='mr-2 h-4 w-4' />
                        Editar
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-destructive hover:text-destructive'
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>Fluxo de Caixa Semanal</p>
                      <p className='text-sm text-muted-foreground'>
                        Gerado toda segunda-feira | Próximo: 22/05/2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <Calendar className='mr-2 h-4 w-4' />
                        Editar
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-destructive hover:text-destructive'
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center'>
                    <div>
                      <p className='font-medium'>
                        Relatório de Impostos Trimestral
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Gerado no fim do trimestre | Próximo: 30/06/2023
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='outline' size='sm'>
                        <Calendar className='mr-2 h-4 w-4' />
                        Editar
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-destructive hover:text-destructive'
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className='w-full' onClick={handleGenerateReport}>
                  <Plus className='mr-2 h-4 w-4' />
                  Agendar Novo Relatório
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <ReportGenerationModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
        />
        <ExportDataModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      </div>
    </DevelopmentProvider>
  )
}

