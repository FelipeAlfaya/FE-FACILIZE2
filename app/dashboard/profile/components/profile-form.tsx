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

  const formatSpecialty = (specialty: string) => {
    const specialties: Record<string, string> = {
      fiscal: 'Contabilidade Fiscal',
      tributaria: 'Contabilidade Tributária',
      empresarial: 'Contabilidade Empresarial',
      pessoal: 'Contabilidade Pessoal',
      Desenvolvedor: 'Desenvolvedor',
      'Design e Marketing': 'Design e Marketing',
    }
    return specialties[specialty] || specialty
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
          <Label>Tipo de Usuário</Label>
          <Input
            value={
              user.type === 'PROVIDER'
                ? `Prestador de Serviços (${
                    user.provider?.providerType === 'TEAM'
                      ? 'Empresa'
                      : 'Autônomo'
                  })`
                : 'Cliente'
            }
            disabled
          />
        </div>

        {user.type === 'CLIENT' && (
          <div className='space-y-2'>
            <Label>CPF</Label>
            <Input value={user.client?.cpf || 'Não informado'} disabled />
          </div>
        )}

        {user.type === 'PROVIDER' && (
          <>
            <div className='space-y-2'>
              <Label>
                {user.provider?.providerType === 'TEAM' ? 'CNPJ' : 'CPF'}
              </Label>
              <Input
                value={
                  user.provider?.providerType === 'TEAM'
                    ? user.provider?.cnpj || 'Não informado'
                    : user.provider?.cpf || 'Não informado'
                }
                disabled
              />
            </div>

            <div className='space-y-2'>
              <Label>Especialidade</Label>
              <Input
                value={
                  formatSpecialty(user.provider?.specialty || '') ||
                  'Não informada'
                }
                disabled
              />
            </div>

            {user.provider?.providerType === 'TEAM' && (
              <>
                <div className='space-y-2'>
                  <Label>Nome Fantasia</Label>
                  <Input
                    value={user.provider?.tradeName || 'Não informado'}
                    disabled
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Tipo de Empresa</Label>
                  <Input
                    className='uppercase'
                    value={user.provider?.companyType || 'Não informado'}
                    disabled
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Representante Legal</Label>
                  <Input
                    value={
                      user.provider?.legalRepresentative || 'Não informado'
                    }
                    disabled
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Documento do Representante</Label>
                  <Input
                    value={
                      user.provider?.legalRepresentativeDocument ||
                      'Não informado'
                    }
                    disabled
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Data de Fundação</Label>
                  <Input
                    value={
                      user.provider?.foundationDate
                        ? new Date(
                            user.provider.foundationDate
                          ).toLocaleDateString()
                        : 'Não informada'
                    }
                    disabled
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Telefone da Empresa</Label>
                  <Input
                    value={user.provider?.companyPhone || 'Não informado'}
                    disabled
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {user.type === 'PROVIDER' && (
        <div className='space-y-2'>
          <Label>Biografia/Descrição</Label>
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

