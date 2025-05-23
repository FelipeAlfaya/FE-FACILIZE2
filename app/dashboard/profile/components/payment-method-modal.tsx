'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CreditCard, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

type PaymentMethod = {
  id: string
  type: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

type PaymentMethodModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddCard: (card: PaymentMethod) => void
  existingCards: PaymentMethod[]
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  onAddCard,
  existingCards,
}: PaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [makeDefault, setMakeDefault] = useState(existingCards.length === 0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setCardNumber('')
    setCardName('')
    setExpiry('')
    setCvc('')
    setMakeDefault(existingCards.length === 0)
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const formatCardNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    // Add space every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19)
  }

  const formatExpiry = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
    }
    return digits
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Número de cartão inválido'
    }

    if (!cardName.trim()) {
      newErrors.cardName = 'Nome no cartão é obrigatório'
    }

    if (!expiry.trim() || !expiry.includes('/') || expiry.length !== 5) {
      newErrors.expiry = 'Data de expiração inválida'
    } else {
      const [month, year] = expiry.split('/')
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiry = 'Mês inválido'
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear &&
          Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiry = 'Cartão expirado'
      }
    }

    if (!cvc.trim() || cvc.length < 3) {
      newErrors.cvc = 'CVC inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '')

    if (cleanNumber.startsWith('4')) {
      return 'visa'
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return 'mastercard'
    } else if (/^3[47]/.test(cleanNumber)) {
      return 'amex'
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      return 'discover'
    } else {
      return 'generic'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const cleanNumber = cardNumber.replace(/\s/g, '')
      const last4 = cleanNumber.slice(-4)
      const [month, year] = expiry.split('/')

      const newCard: PaymentMethod = {
        id: `card_${Date.now()}`,
        type: detectCardType(cardNumber),
        last4,
        expMonth: Number.parseInt(month),
        expYear: Number.parseInt(year) + 2000, // Convert 2-digit year to 4-digit
        isDefault: makeDefault,
      }

      onAddCard(newCard)
      setIsSubmitting(false)
      handleClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='cardNumber'>Número do Cartão</Label>
            <div className='relative'>
              <Input
                id='cardNumber'
                placeholder='1234 5678 9012 3456'
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                maxLength={19}
              />
              <CreditCard className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500' />
            </div>
            {errors.cardNumber && (
              <p className='text-sm text-red-500'>{errors.cardNumber}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='cardName'>Nome no Cartão</Label>
            <Input
              id='cardName'
              placeholder='NOME COMPLETO'
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              className={errors.cardName ? 'border-red-500' : ''}
            />
            {errors.cardName && (
              <p className='text-sm text-red-500'>{errors.cardName}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='expiry'>Validade (MM/AA)</Label>
              <Input
                id='expiry'
                placeholder='MM/AA'
                value={expiry}
                onChange={handleExpiryChange}
                className={errors.expiry ? 'border-red-500' : ''}
                maxLength={5}
              />
              {errors.expiry && (
                <p className='text-sm text-red-500'>{errors.expiry}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cvc'>CVC</Label>
              <Input
                id='cvc'
                placeholder='123'
                value={cvc}
                onChange={(e) =>
                  setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                className={errors.cvc ? 'border-red-500' : ''}
                maxLength={4}
              />
              {errors.cvc && (
                <p className='text-sm text-red-500'>{errors.cvc}</p>
              )}
            </div>
          </div>

          {existingCards.length > 0 && (
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='makeDefault'
                checked={makeDefault}
                onCheckedChange={(checked) => setMakeDefault(checked === true)}
              />
              <Label htmlFor='makeDefault' className='text-sm font-normal'>
                Definir como método de pagamento padrão
              </Label>
            </div>
          )}

          <Alert
            variant='default'
            className='bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Seus dados de cartão são criptografados e processados com
              segurança.
            </AlertDescription>
          </Alert>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Adicionar Cartão'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
