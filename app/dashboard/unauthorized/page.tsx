'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center pb-2'>
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center'>
              <Lock className='h-10 w-10 text-red-600 dark:text-red-400' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold'>Acesso Restrito</CardTitle>
        </CardHeader>
        <CardContent className='text-center space-y-4'>
          <div className='flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md'>
            <AlertCircle className='h-5 w-5' />
            <p>Você não tem permissão para acessar esta página.</p>
          </div>

          <p className='text-gray-600 dark:text-gray-300'>
            Esta área requer autenticação ou permissões específicas que você não
            possui no momento.
          </p>

          <div className='py-4'>
            <Image
              src='/images/logo-color.svg'
              alt='Facilize Logo'
              width={50}
              height={50}
              className='mx-auto hidden dark:block'
            />
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <Button className='w-full' onClick={() => router.push('/login')}>
            Fazer Login
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => router.push('/dashboard/plans')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar
          </Button>
          <div className='text-center w-full mt-4'>
            <Link
              href='/'
              className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
            >
              Voltar para a página inicial
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
