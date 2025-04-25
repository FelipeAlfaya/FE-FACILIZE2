'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScheduleModal } from '../../schedule/components/schedule.modal'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type Provider = {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  services: number
  price: number
  description?: string
  avatar?: string | null
}

export function ProvidersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}users/providers?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch providers')
        }

        const data = await response.json()

        const transformedProviders = data.data.map((provider: any) => ({
          id: provider.id.toString(),
          name: provider.name,
          specialty:
            provider.provider?.specialty || 'Especialidade não informada',
          location: provider.address
            ? `${provider.address.city}, ${provider.address.state}`
            : 'Localização não informada',
          rating: 4.5,
          services: provider.provider?.services?.length || 0,
          price: provider.provider?.services?.[0]?.price || 0,
          description: provider.provider?.description,
          avatar: provider.avatar,
        }))

        setProviders(transformedProviders)
        setTotalPages(data.meta.last_page)
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        )
        console.error('Error fetching providers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [currentPage])

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.location &&
        provider.location.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating
    } else if (sortBy === 'price_asc') {
      return a.price - b.price
    } else if (sortBy === 'price_desc') {
      return b.price - a.price
    } else if (sortBy === 'services') {
      return b.services - a.services
    }
    return 0
  })

  const handleSchedule = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p>Carregando provedores...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12 text-red-500'>
        <p>Erro ao carregar provedores: {error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <div className='relative flex-grow'>
          <Search className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
          <Input
            placeholder='Buscar por nome, especialidade ou localização...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='w-full md:w-48'>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder='Ordenar por' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='rating'>Melhor avaliação</SelectItem>
              <SelectItem value='price_asc'>Menor preço</SelectItem>
              <SelectItem value='price_desc'>Maior preço</SelectItem>
              <SelectItem value='services'>Mais serviços</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {sortedProviders.map((provider) => (
          <Card
            key={provider.id}
            className='overflow-hidden bg-card text-card-foreground'
          >
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

      {sortedProviders.length === 0 && !loading && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>
            Nenhum provedor encontrado{' '}
            {searchTerm ? `para "${searchTerm}"` : ''}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className='mt-8'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 && (
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                )}
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                {currentPage < totalPages && (
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
