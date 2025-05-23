'use client'

import { useState } from 'react'
import { AlertCircle, Calendar, MoreHorizontal, Search } from 'lucide-react'
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

// Sample data
const taxes = [
  {
    id: 'TX-001',
    name: 'IRPJ',
    description: 'Imposto de Renda Pessoa Jurídica',
    dueDate: '31/12/2023',
    amount: 1850,
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'TX-002',
    name: 'CSLL',
    description: 'Contribuição Social sobre o Lucro Líquido',
    dueDate: '31/12/2023',
    amount: 950,
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'TX-003',
    name: 'PIS',
    description: 'Programa de Integração Social',
    dueDate: '25/12/2023',
    amount: 350,
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'TX-004',
    name: 'COFINS',
    description: 'Contribuição para o Financiamento da Seguridade Social',
    dueDate: '25/12/2023',
    amount: 1200,
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'TX-005',
    name: 'ISS',
    description: 'Imposto Sobre Serviços',
    dueDate: '15/12/2023',
    amount: 750,
    status: 'paid',
    priority: 'low',
  },
  {
    id: 'TX-006',
    name: 'INSS',
    description: 'Instituto Nacional do Seguro Social',
    dueDate: '20/12/2023',
    amount: 1100,
    status: 'pending',
    priority: 'high',
  },
]

export function AccountingTaxesTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTaxes = taxes.filter(
    (tax) =>
      tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.id.toLowerCase().includes(searchTerm.toLowerCase())
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
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <div className='flex items-center'>
            <AlertCircle className='mr-1 h-4 w-4 text-red-500' />
            <span className='text-red-600'>Alta</span>
          </div>
        )
      case 'medium':
        return (
          <div className='flex items-center'>
            <AlertCircle className='mr-1 h-4 w-4 text-yellow-500' />
            <span className='text-yellow-600'>Média</span>
          </div>
        )
      case 'low':
        return (
          <div className='flex items-center'>
            <AlertCircle className='mr-1 h-4 w-4 text-green-500' />
            <span className='text-green-600'>Baixa</span>
          </div>
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
            placeholder='Buscar impostos...'
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
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTaxes.length > 0 ? (
              filteredTaxes.map((tax) => (
                <TableRow key={tax.id}>
                  <TableCell className='font-medium'>{tax.id}</TableCell>
                  <TableCell>{tax.name}</TableCell>
                  <TableCell>{tax.description}</TableCell>
                  <TableCell>{tax.dueDate}</TableCell>
                  <TableCell>R$ {tax.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(tax.status)}</TableCell>
                  <TableCell>{getPriorityBadge(tax.priority)}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Calendar className='h-4 w-4' />
                        <span className='sr-only'>Agendar</span>
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
                          <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Gerar guia de pagamento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className='h-24 text-center'>
                  Nenhum imposto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

