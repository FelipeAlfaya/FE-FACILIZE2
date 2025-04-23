'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { SelectContent, SelectItem } from '@radix-ui/react-select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function ProfileForm() {
  const { user, loading, refreshUser } = useUser()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    description: user?.provider?.description || '',
    specialty: 'fiscal',
    state: 'sp',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user?.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            description: formData.description,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Falha ao atualizar perfil')
      }

      await refreshUser()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return <div className='flex flex-col items-center'>Carregando...</div>
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <h2 className='text-xl font-bold mb-6'>Dados Pessoais</h2>

      {showSuccess && (
        <div className='bg-green-50 text-green-800 p-4 rounded-md mb-6'>
          Perfil atualizado com sucesso!
        </div>
      )}

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
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' value={user.email} disabled />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone'>Telefone</Label>
          <Input
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='Não informado'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='document'>CPF/CNPJ</Label>
          <Input
            id='document'
            value={user.provider?.cpf || user.provider?.cnpj || ''}
            disabled
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='type'>Tipo de Usuário</Label>
          <Input
            id='type'
            value={
              user.type === 'PROVIDER' ? 'Prestador de Serviços' : 'Cliente'
            }
            disabled
          />
        </div>

        {user.type === 'PROVIDER' && (
          <div className='space-y-2'>
            <Label htmlFor='specialty'>Especialidade</Label>
            <Select
              value={formData.specialty}
              onValueChange={(value) => handleSelectChange('specialty', value)}
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
                <SelectItem value='pessoal'>Contabilidade Pessoal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {user.type === 'PROVIDER' && (
        <div className='space-y-2'>
          <Label htmlFor='bio'>Biografia</Label>
          <Textarea
            id='bio'
            name='description'
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder='Não informada'
          />
        </div>
      )}

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
