'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
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
          <Input id='name' defaultValue='Felipe da Silva' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            defaultValue='felipe.silva@email.com'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone'>Telefone</Label>
          <Input id='phone' defaultValue='(11) 98765-4321' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='document'>CPF/CNPJ</Label>
          <Input id='document' defaultValue='123.456.789-00' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='profession'>Profissão</Label>
          <Input id='profession' defaultValue='Contador' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='specialty'>Especialidade</Label>
          <Select defaultValue='fiscal'>
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
      </div>

      <div className='space-y-2'>
        <Label htmlFor='bio'>Biografia</Label>
        <Textarea
          id='bio'
          rows={4}
          defaultValue='Contador com mais de 10 anos de experiência em contabilidade fiscal e tributária para pequenas e médias empresas.'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='address'>Endereço</Label>
        <Input id='address' defaultValue='Av. Paulista, 1000 - Bela Vista' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='city'>Cidade</Label>
          <Input id='city' defaultValue='São Paulo' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='state'>Estado</Label>
          <Select defaultValue='sp'>
            <SelectTrigger id='state'>
              <SelectValue placeholder='Selecione um estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='sp'>São Paulo</SelectItem>
              <SelectItem value='rj'>Rio de Janeiro</SelectItem>
              <SelectItem value='mg'>Minas Gerais</SelectItem>
              <SelectItem value='rs'>Rio Grande do Sul</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='zipcode'>CEP</Label>
          <Input id='zipcode' defaultValue='01310-100' />
        </div>
      </div>

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
