'use client'

import { useState } from 'react'
import { Download, Eye, MoreHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const invoices = [
  {
    id: 'NF-001',
    date: '15/12/2023',
    client: 'Empresa XYZ Ltda',
    description: 'Consultoria em Processos',
    amount: 1200,
    status: 'paid',
  },
  {
    id: 'NF-002',
    date: '10/12/2023',
    client: 'Startup ABC',
    description: 'Desenvolvimento de Software',
    amount: 3500,
    status: 'paid',
  },
  {
    id: 'NF-003',
    date: '05/12/2023',
    client: 'Corporação DEF S.A.',
    description: 'Treinamento em Equipe',
    amount: 2500,
    status: 'pending',
  },
  {
    id: 'NF-004',
    date: '01/12/2023',
    client: 'Empresa GHI',
    description: 'Consultoria Estratégica',
    amount: 4200,
    status: 'paid',
  },
  {
    id: 'NF-005',
    date: '25/11/2023',
    client: 'Startup JKL',
    description: 'Implementação de Sistema',
    amount: 5800,
    status: 'overdue',
  },
  {
    id: 'NF-006',
    date: '20/11/2023',
    client: 'Corporação MNO',
    description: 'Análise de Dados',
    amount: 3200,
    status: 'paid',
  },
]

export function AccountingInvoicesTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge
            variant='outline'
            className='bg-green-100 text-green-800 border-green-200'
          >
            Pago
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant='outline'
            className='bg-yellow-100 text-yellow-800 border-yellow-200'
          >
            Pendente
          </Badge>
        )
      case 'overdue':
        return (
          <Badge
            variant='outline'
            className='bg-red-100 text-red-800 border-red-200'
          >
            Atrasado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Buscar notas fiscais...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className='font-medium'>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Eye className='h-4 w-4' />
                        <span className='sr-only'>Visualizar</span>
                      </Button>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Download className='h-4 w-4' />
                        <span className='sr-only'>Download</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <span className='sr-only'>Abrir menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Enviar por email</DropdownMenuItem>
                          <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='text-red-600'>
                            Cancelar nota
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Nenhuma nota fiscal encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
