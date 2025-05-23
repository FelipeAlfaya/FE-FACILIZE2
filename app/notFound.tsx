import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8'>
      <div className='mx-auto flex w-full max-w-md flex-col items-center text-center'>
        <div className='mb-4 rounded-full bg-muted p-6'>
          <div className='text-6xl font-bold'>404</div>
        </div>

        <h1 className='mt-6 text-2xl font-bold tracking-tight'>
          Página não encontrada
        </h1>

        <p className='mt-4 text-muted-foreground'>
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>

        <div className='mt-8 grid w-full gap-2'>
          <Button asChild>
            <Link href='/dashboard'>
              <Home className='mr-2 h-4 w-4' />
              Voltar para o Dashboard
            </Link>
          </Button>

          <Button variant='outline' asChild>
            <Link href='javascript:history.back()'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Voltar
            </Link>
          </Button>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-center rounded-lg border bg-background px-3 py-2'>
            <Search className='mr-2 h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
              Tente pesquisar o que você está procurando
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
