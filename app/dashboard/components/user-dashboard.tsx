'use client'

import { useState } from 'react'
import { Search, Calendar, MapPin, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScheduleModal } from './schedule.modal'

type Provider = {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  services: number
  price: number
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Felipe da Silva',
    specialty: 'Contador',
    location: 'São Paulo, SP',
    rating: 4.8,
    services: 230,
    price: 49.9,
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    specialty: 'Advogada',
    location: 'Rio de Janeiro, RJ',
    rating: 4.9,
    services: 187,
    price: 69.9,
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    specialty: 'Consultor Financeiro',
    location: 'Belo Horizonte, MG',
    rating: 4.7,
    services: 156,
    price: 89.9,
  },
]

export function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProviders = mockProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSchedule = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-2'>Encontre Provedores</h1>
        <p className='text-gray-600'>
          Busque e agende serviços com os melhores profissionais
        </p>
      </div>

      <div className='relative mb-8'>
        <Search className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
        <Input
          placeholder='Buscar por nome, especialidade ou localização...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className='overflow-hidden'>
            <CardContent className='p-0'>
              <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='font-bold'>{provider.name}</h3>
                    <p className='text-sm text-gray-600'>
                      {provider.specialty}
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-blue-50 text-blue-600 border-blue-200'
                  >
                    R${provider.price.toFixed(2)}
                  </Badge>
                </div>

                <div className='flex items-center text-sm text-gray-600 mb-4'>
                  <MapPin className='h-4 w-4 mr-1' />
                  <span>{provider.location}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='flex'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(provider.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm ml-2'>{provider.rating}</span>
                  </div>
                  <span className='text-xs text-gray-500'>
                    {provider.services} serviços prestados
                  </span>
                </div>
              </div>

              <div className='border-t p-4'>
                <Button
                  onClick={() => handleSchedule(provider)}
                  className='w-full'
                >
                  <Calendar className='h-4 w-4 mr-2' />
                  Agendar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>
            Nenhum provedor encontrado para "{searchTerm}"
          </p>
        </div>
      )}

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={selectedProvider}
      />
    </div>
  )
}
