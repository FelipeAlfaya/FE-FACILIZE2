'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Home, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

export default function AcessoNegado() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState<string>('')

  useEffect(() => {
    // Capturar o caminho atual que estava tentando acessar
    setCurrentPath(window.location.pathname)
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <Card className='max-w-md w-full shadow-lg border-red-500/30'>
        <CardHeader className='bg-red-50/50 dark:bg-red-900/10 border-b'>
          <div className='flex items-center gap-3'>
            <ShieldAlert className='h-6 w-6 text-red-600' />
            <div>
              <Badge
                variant='outline'
                className='border-red-400 text-red-700 dark:text-red-400 mb-2'
              >
                Acesso Restrito
              </Badge>
              <CardTitle className='text-2xl'>Acesso Negado</CardTitle>
            </div>
          </div>
          <CardDescription className='mt-2'>
            Esta página está em desenvolvimento e só pode ser acessada por
            administradores do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6 space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-3'>Caminho restrito</h3>
            <div className='bg-muted p-2 rounded-md font-mono text-sm'>
              {currentPath || 'Caminho não identificado'}
            </div>
          </div>

          <div className='text-muted-foreground'>
            <p>
              Se você acredita que deveria ter acesso a esta página, entre em
              contato com o administrador do sistema.
            </p>
          </div>
        </CardContent>
        <CardFooter className='border-t flex justify-between pt-4'>
          <Button
            variant='outline'
            onClick={() => router.back()}
            className='gap-2'
          >
            <ArrowLeft className='h-4 w-4' /> Voltar
          </Button>
          <Button
            variant='default'
            onClick={() => router.push('/dashboard')}
            className='gap-2'
          >
            <Home className='h-4 w-4' /> Ir para Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
