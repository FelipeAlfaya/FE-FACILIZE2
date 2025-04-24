import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='border-b'>
        <div className='container mx-auto py-4 px-4 md:px-6'>
          <Link href='/' passHref>
            <Button
              variant='ghost'
              size='sm'
              className='flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Voltar para a página inicial</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className='flex-1'>{children}</main>
      <footer className='border-t py-6'>
        <div className='container mx-auto text-center text-sm text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} Facilize. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
