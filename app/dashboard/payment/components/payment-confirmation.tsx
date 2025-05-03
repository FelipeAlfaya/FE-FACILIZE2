'use client'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Download, Home } from 'lucide-react'
import Link from 'next/link'
import type { PaymentDetails } from './payment-flow'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type PaymentConfirmationProps = {
  paymentDetails: PaymentDetails
  onNewPayment: () => void
}

export function PaymentConfirmation({
  paymentDetails,
  onNewPayment,
}: PaymentConfirmationProps) {
  const router = useRouter()
  const { plan, billingCycle, paymentMethod, subscription } = paymentDetails
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!subscription?.id) return

    const fetchSubscriptionDetails = async () => {
      try {
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}payments/subscription-status?subscriptionId=${subscription.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setSubscriptionDetails(data)

          // Se ainda estiver pendente, verificar novamente após 5 segundos
          if (data.status === 'incomplete' || data.status === 'pending') {
            setTimeout(fetchSubscriptionDetails, 5000)
          }
        }
      } catch (error) {
        console.error('Error fetching subscription details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptionDetails()

    // Configurar EventSource para atualizações em tempo real
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}payments/subscription-events?subscriptionId=${subscription.id}`
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.eventType === 'subscription.updated') {
        setSubscriptionDetails((prev: any) => ({
          ...prev,
          status: data.status,
          latestInvoiceId: data.latestInvoiceId || prev?.latestInvoiceId,
        }))
      }
    }

    return () => {
      eventSource.close()
    }
  }, [subscription?.id])

  if (!plan) return null

  const price = billingCycle === 'monthly' ? plan.price : plan.price * 12 * 0.9

  const orderId =
    subscriptionDetails?.subscriptionId ||
    `FAC${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')}`
  const date = new Date().toLocaleDateString('pt-BR')

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito'
      case 'pix':
        return 'PIX'
      case 'boleto':
        return 'Boleto Bancário'
      default:
        return method
    }
  }

  const handleDownloadReceipt = async () => {
    if (!subscriptionDetails?.latestInvoiceId) return

    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}payments/invoice-pdf?invoiceId=${subscriptionDetails.latestInvoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `recibo-${orderId}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading receipt:', error)
    }
  }

  return (
    <CardContent className='p-6'>
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <CheckCircle className='h-8 w-8 text-green-600' />
        </div>
        <h2 className='text-2xl font-bold mb-2'>Pagamento Confirmado!</h2>
        <p className='text-gray-600'>
          {subscriptionDetails?.status === 'active'
            ? 'Seu pagamento foi processado com sucesso e seu plano foi ativado.'
            : 'Seu pagamento está sendo processado. Você receberá uma confirmação por email.'}
        </p>
      </div>

      <div className='border p-6 rounded-lg mb-8 max-w-md mx-auto'>
        <h3 className='text-lg font-medium mb-4'>Detalhes da Compra</h3>

        <div className='space-y-4'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Número do Pedido:</span>
            <span className='font-medium'>{orderId}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Data:</span>
            <span>{date}</span>
          </div>

          <Separator />

          <div className='flex justify-between'>
            <span className='text-gray-600'>Plano:</span>
            <span>{plan.name}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Período:</span>
            <span>{billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-gray-600'>Método de Pagamento:</span>
            <span>{getPaymentMethodName(paymentMethod)}</span>
          </div>

          <Separator />

          <div className='flex justify-between font-bold'>
            <span>Total:</span>
            <span>R${price.toFixed(2)}</span>
          </div>

          {subscriptionDetails?.status && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Status:</span>
              <span className='capitalize'>{subscriptionDetails.status}</span>
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4 justify-center'>
        <Button
          variant='outline'
          className='gap-2'
          onClick={handleDownloadReceipt}
          disabled={!subscriptionDetails?.latestInvoiceId || isLoading}
        >
          <Download className='h-4 w-4' />
          {isLoading ? 'Carregando...' : 'Baixar Recibo'}
        </Button>

        <Button asChild className='gap-2'>
          <Link href='/dashboard'>
            <Home className='h-4 w-4' />
            Ir para o Dashboard
          </Link>
        </Button>

        <Button variant='ghost' onClick={onNewPayment}>
          Fazer Outro Pagamento
        </Button>
      </div>
    </CardContent>
  )
}
