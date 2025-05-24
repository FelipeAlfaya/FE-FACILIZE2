'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function TestToastPage() {
  const testToast = () => {
    console.log('🧪 Testando toast...')
    try {
      const result = toast({
        title: 'Teste de Toast',
        description:
          'Este é um teste para verificar se o toast está funcionando!',
      })
      console.log('📝 Toast chamado com sucesso:', result)
    } catch (error) {
      console.error('❌ Erro ao chamar toast:', error)
    }
  }

  const testToastSuccess = () => {
    try {
      const result = toast({
        title: 'Sucesso!',
        description: 'Toast de sucesso funcionando.',
        variant: 'default',
      })
      console.log('✅ Toast de sucesso criado:', result)
    } catch (error) {
      console.error('❌ Erro ao criar toast de sucesso:', error)
    }
  }

  const testToastError = () => {
    try {
      const result = toast({
        title: 'Erro!',
        description: 'Toast de erro funcionando.',
        variant: 'destructive',
      })
      console.log('🔴 Toast de erro criado:', result)
    } catch (error) {
      console.error('❌ Erro ao criar toast de erro:', error)
    }
  }

  const testMultipleToasts = () => {
    console.log('🔄 Testando múltiplos toasts...')
    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        toast({
          title: `Toast ${i}`,
          description: `Este é o toast número ${i}`,
        })
      }, i * 500)
    }
  }

  return (
    <div className='container mx-auto p-8'>
      <Card>
        <CardHeader>
          <CardTitle>Teste de Toast - Facilize</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p>
            Use os botões abaixo para testar se os toasts estão funcionando:
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Button
              onClick={testToast}
              className='bg-blue-500 hover:bg-blue-600'
            >
              🧪 Teste Básico
            </Button>

            <Button
              onClick={testToastSuccess}
              className='bg-green-500 hover:bg-green-600'
            >
              ✅ Teste Sucesso
            </Button>

            <Button
              onClick={testToastError}
              className='bg-red-500 hover:bg-red-600'
            >
              ❌ Teste Erro
            </Button>

            <Button
              onClick={testMultipleToasts}
              className='bg-purple-500 hover:bg-purple-600'
            >
              🔄 Múltiplos Toasts
            </Button>
          </div>

          <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
            <h3 className='font-bold mb-2'>✅ Correções Aplicadas:</h3>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>
                <strong>TOAST_LIMIT:</strong> 1 → 5 (permite múltiplos toasts)
              </li>
              <li>
                <strong>TOAST_REMOVE_DELAY:</strong> 1.000.000ms → 5.000ms (16
                min → 5 seg)
              </li>
              <li>
                <strong>Importações:</strong> Unificadas para usar
                @/hooks/use-toast
              </li>
              <li>
                <strong>Toaster:</strong> Verificado que está renderizado no
                layout.tsx
              </li>
              <li>
                <strong>Componentes:</strong> Todos os componentes Toast estão
                funcionais
              </li>
            </ul>
          </div>

          <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <h3 className='font-bold mb-2 text-blue-800'>💡 Como testar:</h3>
            <ol className='list-decimal list-inside space-y-1 text-sm text-blue-700'>
              <li>Abra o Console do Navegador (F12)</li>
              <li>Clique em qualquer botão de teste</li>
              <li>Veja os logs no console e o toast na tela</li>
              <li>Os toasts devem aparecer no canto superior direito</li>
              <li>Eles devem desaparecer automaticamente após 5 segundos</li>
            </ol>
          </div>

          <p className='text-sm text-gray-600'>
            📝 Verifique o console para logs de debug detalhados
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
