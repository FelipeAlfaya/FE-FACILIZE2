'use client'

import { Button } from '@/components/ui/button'
import { useReviewNotification } from '@/components/reviews/review-notification'

export function TestNotification() {
  const { showNotification, NotificationComponent } = useReviewNotification()

  const handleTestNotification = () => {
    console.log('🧪 Teste: forçando notificação')
    showNotification(123)
  }

  return (
    <div className='p-4'>
      <h3 className='text-lg font-bold mb-4'>Teste de Notificação de Review</h3>

      <Button
        onClick={handleTestNotification}
        className='bg-blue-500 hover:bg-blue-600'
      >
        🧪 Testar Notificação
      </Button>

      <div className='mt-4 text-sm text-gray-600'>
        <p>1. Clique no botão para testar a notificação</p>
        <p>2. Verifique o console para logs</p>
        <p>3. A notificação deve aparecer no canto inferior direito</p>
      </div>

      {/* Componente de notificação */}
      <NotificationComponent />
    </div>
  )
}
