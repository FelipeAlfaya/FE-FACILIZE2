'use client'
import { DashboardHeader } from '../components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  MoreHorizontal,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useAuthCheck } from '@/hooks/useAuthCheck'

// Mock data for invoices
const mockInvoices = [
  {
    id: '1',
    number: '000001',
    series: '1',
    date: '22/04/2025',
    recipient: 'João Silva',
    value: 1250.75,
    status: 'approved',
  },
  {
    id: '2',
    number: '000002',
    series: '1',
    date: '21/04/2025',
    recipient: 'Empresa ABC Ltda',
    value: 3450.0,
    status: 'approved',
  },
  {
    id: '3',
    number: '000003',
    series: '1',
    date: '20/04/2025',
    recipient: 'Maria Oliveira',
    value: 750.5,
    status: 'processing',
  },
  {
    id: '4',
    number: '000004',
    series: '1',
    date: '19/04/2025',
    recipient: 'Comércio XYZ Ltda',
    value: 5200.25,
    status: 'approved',
  },
  {
    id: '5',
    number: '000005',
    series: '1',
    date: '18/04/2025',
    recipient: 'Pedro Santos',
    value: 1800.0,
    status: 'rejected',
  },
]

export default function InvoicesPage() {
  useAuthCheck('PROVIDER')
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
          <div className='mb-4 md:mb-0'>
            <h1 className='text-2xl font-bold mb-2'>Notas Fiscais</h1>
            <p className='text-muted-foreground'>
              Gerencie suas notas fiscais eletrônicas
            </p>
          </div>
          <Button asChild>
            <Link href='/dashboard/invoices/issue'>
              <Plus className='h-4 w-4 mr-2' />
              Emitir Nova Nota
            </Link>
          </Button>
        </div>

        <Card className='mb-8'>
          <CardHeader className='pb-2'>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar por número ou destinatário'
                  className='pl-10'
                />
              </div>

              <Select defaultValue='all'>
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos os status</SelectItem>
                  <SelectItem value='approved'>Aprovadas</SelectItem>
                  <SelectItem value='processing'>Em processamento</SelectItem>
                  <SelectItem value='rejected'>Rejeitadas</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue='30'>
                <SelectTrigger>
                  <SelectValue placeholder='Período' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='7'>Últimos 7 dias</SelectItem>
                  <SelectItem value='30'>Últimos 30 dias</SelectItem>
                  <SelectItem value='90'>Últimos 90 dias</SelectItem>
                  <SelectItem value='365'>Último ano</SelectItem>
                </SelectContent>
              </Select>

              <Button variant='outline'>Aplicar Filtros</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left p-4'>Número</th>
                    <th className='text-left p-4'>Data</th>
                    <th className='text-left p-4'>Destinatário</th>
                    <th className='text-left p-4'>Valor</th>
                    <th className='text-left p-4'>Status</th>
                    <th className='text-right p-4'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className='border-b hover:bg-muted/50'>
                      <td className='p-4'>
                        <div className='flex items-center'>
                          <FileText className='h-4 w-4 mr-2 text-muted-foreground' />
                          <span>{invoice.number}</span>
                        </div>
                      </td>
                      <td className='p-4'>{invoice.date}</td>
                      <td className='p-4'>{invoice.recipient}</td>
                      <td className='p-4'>R$ {invoice.value.toFixed(2)}</td>
                      <td className='p-4'>
                        <Badge
                          variant='outline'
                          className={
                            invoice.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900'
                              : invoice.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900'
                          }
                        >
                          {invoice.status === 'approved'
                            ? 'Aprovada'
                            : invoice.status === 'processing'
                            ? 'Processando'
                            : 'Rejeitada'}
                        </Badge>
                      </td>
                      <td className='p-4 text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <Eye className='h-4 w-4 mr-2' />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className='h-4 w-4 mr-2' />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className='h-4 w-4 mr-2' />
                              Download XML
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='p-4 flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Mostrando 5 de 5 notas fiscais
              </div>
              <div className='flex items-center space-x-2'>
                <Button variant='outline' size='sm' disabled>
                  Anterior
                </Button>
                <Button variant='outline' size='sm' disabled>
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
