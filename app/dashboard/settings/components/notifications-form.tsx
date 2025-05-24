'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type NotificationSettings = {
  emailEnabled: boolean
  pushEnabled: boolean
  inAppEnabled: boolean
  smsEnabled: boolean
  whatsappEnabled: boolean
  appointmentReminders: boolean
  paymentNotifications: boolean
  invoiceUpdates: boolean
  systemAlerts: boolean
  chatMessages: boolean
  taxReminders: boolean
}

const notificationLabels: {
  key: keyof NotificationSettings
  label: string
  description: string
}[] = [
  {
    key: 'emailEnabled',
    label: 'Notificações por E-mail',
    description: 'Receba notificações por e-mail.',
  },
  {
    key: 'pushEnabled',
    label: 'Notificações Push',
    description: 'Receba notificações push em seu dispositivo.',
  },
  {
    key: 'inAppEnabled',
    label: 'Notificações In-App',
    description: 'Receba notificações dentro do aplicativo.',
  },
  {
    key: 'smsEnabled',
    label: 'Notificações por SMS',
    description: 'Receba mensagens por SMS.',
  },
  {
    key: 'whatsappEnabled',
    label: 'Notificações por WhatsApp',
    description: 'Receba mensagens pelo WhatsApp.',
  },
  {
    key: 'appointmentReminders',
    label: 'Lembretes de Agendamento',
    description: 'Receba lembretes de consultas e compromissos.',
  },
  {
    key: 'paymentNotifications',
    label: 'Notificações de Pagamento',
    description: 'Receba notificações sobre pagamentos e faturas.',
  },
  {
    key: 'invoiceUpdates',
    label: 'Atualizações de Fatura',
    description: 'Receba notificações sobre mudanças em suas faturas.',
  },
  {
    key: 'systemAlerts',
    label: 'Alertas do Sistema',
    description: 'Receba alertas sobre manutenção ou problemas técnicos.',
  },
  {
    key: 'chatMessages',
    label: 'Mensagens de Chat',
    description: 'Receba notificações sobre novas mensagens.',
  },
  {
    key: 'taxReminders',
    label: 'Lembretes de Impostos',
    description: 'Receba lembretes sobre obrigações fiscais.',
  },
]

export function NotificationsForm() {
  const { user, token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    smsEnabled: false,
    whatsappEnabled: false,
    appointmentReminders: true,
    paymentNotifications: true,
    invoiceUpdates: true,
    systemAlerts: true,
    chatMessages: true,
    taxReminders: true,
  })
  const baseApi = `${process.env.NEXT_PUBLIC_API_URL}`

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id || !token) {
        console.error('Usuário não autenticado ou ID não disponível')
        return
      }

      try {
        const response = await fetch(
          `${baseApi}/users/${user.id}/notification-settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        const data = await response.json()
        setSettings({
          emailEnabled: data.emailEnabled,
          pushEnabled: data.pushEnabled,
          inAppEnabled: data.inAppEnabled,
          smsEnabled: data.smsEnabled,
          whatsappEnabled: data.whatsappEnabled,
          appointmentReminders: data.appointmentReminders,
          paymentNotifications: data.paymentNotifications,
          invoiceUpdates: data.invoiceUpdates,
          systemAlerts: data.systemAlerts,
          chatMessages: data.chatMessages,
          taxReminders: data.taxReminders,
        })
      } catch (error) {
        console.error('Erro ao buscar configurações:', error)
      }
    }

    fetchSettings()
  }, [user?.id, token, baseApi])

  const handleToggle = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id || !token) {
      console.error('Usuário não autenticado ou ID não disponível')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${baseApi}/users/${user.id}/notification-settings`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      )

      if (!response.ok) throw new Error('Falha ao salvar configurações')

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar loading se não tiver usuário ou token
  if (!user || !token) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <h2 className='text-xl font-bold mb-6'>Preferências de Notificações</h2>

      {showSuccess && (
        <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-6 flex items-center'>
          <Check className='h-5 w-5 mr-2' />
          Configurações salvas com sucesso!
        </div>
      )}

      {notificationLabels.map(({ key, label, description }) => (
        <div key={key} className='flex items-center justify-between'>
          <div>
            <Label htmlFor={key} className='font-medium'>
              {label}
            </Label>
            <p className='text-sm text-muted-foreground'>{description}</p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              id={key}
              checked={settings[key]}
              onChange={() => handleToggle(key)}
              className='sr-only peer'
            />
            <div
              className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
            ></div>
          </label>
        </div>
      ))}

      <div className='flex justify-end space-x-4 pt-4'>
        <Button type='button' variant='outline'>
          Cancelar
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}
