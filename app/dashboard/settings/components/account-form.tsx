'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function AccountForm() {
  const { user, refreshUser } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    description: user?.provider?.description || '',
    specialty: user?.provider?.specialty || 'fiscal',
    language: 'pt-BR',
    marketingEmails: true,
    newsletter: true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: string, value: boolean) => {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        ...(user?.type === 'PROVIDER' && {
          description: formData.description,
          specialty: formData.specialty,
        }),
      }

      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user?.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Falha ao atualizar configurações')
      }

      await refreshUser()
      setShowSuccess(true)
      toast.success('Dados atualizados com sucesso!')
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao atualizar os dados'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div className='flex flex-col items-center'>Carregando...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-xl font-bold mb-6'>Configurações da Conta</h2>

      {showSuccess && (
        <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-md mb-6 flex items-center'>
          <Check className='h-5 w-5 mr-2' />
          Dados salvos com sucesso!
        </div>
      )}

      <div className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Informações Pessoais</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Atualize suas informações pessoais e de contato.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nome Completo</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Telefone</Label>
              <Input
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {user.type === 'PROVIDER' && (
              <div className='space-y-2'>
                <Label htmlFor='specialty'>Especialidade</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) =>
                    handleSelectChange('specialty', value)
                  }
                >
                  <SelectTrigger id='specialty'>
                    <SelectValue placeholder='Selecione uma especialidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='fiscal'>Contabilidade Fiscal</SelectItem>
                    <SelectItem value='tributaria'>
                      Contabilidade Tributária
                    </SelectItem>
                    <SelectItem value='empresarial'>
                      Contabilidade Empresarial
                    </SelectItem>
                    <SelectItem value='pessoal'>
                      Contabilidade Pessoal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='language'>Idioma</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleSelectChange('language', value)}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um idioma' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='pt-BR'>Português (Brasil)</SelectItem>
                  <SelectItem value='en-US'>English (US)</SelectItem>
                  <SelectItem value='es'>Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {user.type === 'PROVIDER' && (
          <>
            <Separator />
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-medium mb-2'>Biografia</h3>
                <p className='text-muted-foreground text-sm mb-4'>
                  Conte um pouco sobre você e seus serviços.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Biografia</Label>
                <Textarea
                  id='description'
                  name='description'
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Preferências de Conta</h3>
            <p className='text-muted-foreground text-sm mb-4'>
              Personalize suas preferências de conta e comunicação.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='marketingEmails' className='font-medium'>
                  Emails de Marketing
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba novidades, dicas e ofertas especiais.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={formData.marketingEmails}
                  onChange={(e) =>
                    handleToggle('marketingEmails', e.target.checked)
                  }
                  className='sr-only peer'
                  id='marketingEmails'
                  disabled
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='newsletter' className='font-medium'>
                  Newsletter Semanal
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Receba um resumo semanal com novidades e conteúdos relevantes.
                </p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={formData.newsletter}
                  onChange={(e) => handleToggle('newsletter', e.target.checked)}
                  className='sr-only peer'
                  id='newsletter'
                  disabled
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div> */}

        <div className='flex justify-end space-x-4 pt-4'>
          <Button type='button' variant='outline'>
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </form>
  )
}

