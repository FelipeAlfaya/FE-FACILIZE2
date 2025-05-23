'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, MoreHorizontal, Search } from 'lucide-react'
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
const transactions = [
  {
    id: 'TR-001',
    date: '15/12/2023',
    description: 'Consultoria para Empresa XYZ',
    category: 'Consultoria',
    amount: 1200,
    type: 'income',
    status: 'completed',
  },
  {
    id: 'TR-002',
    date: '14/12/2023',
    description: 'Pagamento de Aluguel',
    category: 'Infraestrutura',
    amount: 800,
    type: 'expense',
    status: 'completed',
  },
  {
    id: 'TR-003',
    date: '12/12/2023',
    description: 'Assinatura Mensal Cliente ABC',
    category: 'Serviço Recorrente',
    amount: 350,
    type: 'income',
    status: 'completed',
  },
  {
    id: 'TR-004',
    date: '10/12/2023',
    description: 'Pagamento de Fornecedor',
    category: 'Suprimentos',
    amount: 450,
    type: 'expense',
    status: 'completed',
  },
  {
    id: 'TR-005',
    date: '08/12/2023',
    description: 'Treinamento para Equipe DEF',
    category: 'Treinamento',
    amount: 2500,
    type: 'income',
    status: 'pending',
  },
  {
    id: 'TR-006',
    date: '05/12/2023',
    description: 'Pagamento de Impostos',
    category: 'Impostos',
    amount: 950,
    type: 'expense',
    status: 'completed',
  },
  {
    id: 'TR-007',
    date: '03/12/2023',
    description: 'Projeto para Startup GHI',
    category: 'Projeto',
    amount: 3500,
    type: 'income',
    status: 'completed',
  },
  {
    id: 'TR-008',
    date: '01/12/2023',
    description: 'Campanha de Marketing',
    category: 'Marketing',
    amount: 650,
    type: 'expense',
    status: 'pending',
  },
]

export function AccountingTransactionsTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Buscar transações...'
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
              <TableHead>Data</TableHead>
              <TableHead className='w-[300px]'>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className='font-medium'>
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      {transaction.type === 'income' ? (
                        <ArrowUp className='mr-1 h-4 w-4 text-green-500' />
                      ) : (
                        <ArrowDown className='mr-1 h-4 w-4 text-red-500' />
                      )}
                      <span
                        className={
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        R$ {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                    >
                      {transaction.status === 'completed'
                        ? 'Concluído'
                        : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <span className='sr-only'>Abrir menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-red-600'>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

