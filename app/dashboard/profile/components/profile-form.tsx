'use client'

import { useUser } from '@/context/UserContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ProfileForm() {
  const { user, loading } = useUser()

  if (loading || !user) {
    return <div className='flex flex-col items-center'>Carregando...</div>
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold mb-6'>Dados Pessoais</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label>Nome Completo</Label>
          <Input value={user.name} disabled />
        </div>

        <div className='space-y-2'>
          <Label>Email</Label>
          <Input value={user.email} disabled />
        </div>

        <div className='space-y-2'>
          <Label>Telefone</Label>
          <Input value={user.phone || 'Não informado'} disabled />
        </div>

        <div className='space-y-2'>
          <Label>CPF/CNPJ</Label>
          <Input
            value={
              user.type === 'PROVIDER'
                ? user.provider?.cpf || user.provider?.cnpj || 'Não informado'
                : user.client?.cpf || 'Não informado'
            }
            disabled
          />
        </div>

        <div className='space-y-2'>
          <Label>Tipo de Usuário</Label>
          <Input
            value={
              user.type === 'PROVIDER' ? 'Prestador de Serviços' : 'Cliente'
            }
            disabled
          />
        </div>

        {user.type === 'PROVIDER' && (
          <div className='space-y-2'>
            <Label>Especialidade</Label>
            <Input
              value={
                {
                  fiscal: 'Contabilidade Fiscal',
                  tributaria: 'Contabilidade Tributária',
                  empresarial: 'Contabilidade Empresarial',
                  pessoal: 'Contabilidade Pessoal',
                }[user.provider?.specialty || 'fiscal'] || 'Não informada'
              }
              disabled
            />
          </div>
        )}
      </div>

      {user.type === 'PROVIDER' && (
        <div className='space-y-2'>
          <Label>Biografia</Label>
          <Textarea
            rows={4}
            value={user.provider?.description || 'Não informada'}
            disabled
          />
        </div>
      )}
    </div>
  )
}
