'use client'
import { DashboardHeader } from '../../components/dashboard-header'
import { InvoiceForm } from '../../components/invoice-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { FileText } from 'lucide-react'

export default function IssueInvoicePage() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-6'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard/invoices'>
                  Notas Fiscais
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/dashboard/invoices/issue'>
                  Emitir Nota
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='mb-8 flex items-center gap-3'>
          <div className='h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center'>
            <FileText className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>Emitir Nota Fiscal</h1>
            <p className='text-muted-foreground'>
              Preencha os dados para emissão da NF-e
            </p>
          </div>
        </div>

        <InvoiceForm />
      </main>
    </div>
  )
}
