'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Star, Calendar, Mail } from 'lucide-react'
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
import { ProviderData, Service, TransformedProvider } from '@/types/appointment'
import React from 'react'

interface ProvidersListProps {
  filters?: any
}

export function ProvidersList({ filters }: ProvidersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<
    'rating' | 'price_asc' | 'price_desc' | 'services'
  >('rating')
  const [selectedProvider, setSelectedProvider] =
    useState<TransformedProvider | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [providers, setProviders] = useState<TransformedProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [isSorting, setIsSorting] = useState(false)

  const handleSearch = useCallback(() => {
    setActiveSearchTerm(searchTerm)
    setCurrentPage(1) // Resetar para primeira página
  }, [searchTerm])

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setActiveSearchTerm('')
    setCurrentPage(1)
  }, [])

  // Função para lidar com mudança de ordenação
  const handleSortChange = useCallback((newSortBy: string) => {
    setIsSorting(true)
    setSortBy(newSortBy as typeof sortBy)

    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      setIsSorting(false)
    }, 200)
  }, [])

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

        // Construir URL com filtros
        let url = `${process.env.NEXT_PUBLIC_API_URL}users/providers`
        const queryParams = new URLSearchParams()

        queryParams.append('page', currentPage.toString())
        queryParams.append('limit', '6')

        // Adicionar filtros se existirem
        if (filters && Object.keys(filters).length > 0) {
          url += '/filter'
          if (filters.search || activeSearchTerm) {
            queryParams.append('search', filters.search || activeSearchTerm)
          }
          if (filters.specialty) {
            if (Array.isArray(filters.specialty)) {
              // Enviar múltiplas especialidades como string separada por vírgula
              queryParams.append('specialty', filters.specialty.join(','))
            } else {
              // Enviar especialidade única
              queryParams.append('specialty', filters.specialty)
            }
          }
          if (filters.minPrice !== undefined) {
            queryParams.append('minPrice', filters.minPrice.toString())
          }
          if (filters.maxPrice !== undefined) {
            queryParams.append('maxPrice', filters.maxPrice.toString())
          }
          if (filters.minRating !== undefined) {
            queryParams.append('minRating', filters.minRating.toString())
          }
          if (filters.availability) {
            if (Array.isArray(filters.availability)) {
              // Enviar múltiplas availabilities como string separada por vírgula
              queryParams.append('availability', filters.availability.join(','))
            } else {
              // Enviar availability única
              queryParams.append('availability', filters.availability)
            }
          }
        } else if (activeSearchTerm) {
          url += '/filter'
          queryParams.append('search', activeSearchTerm)
        }

        const finalUrl = `${url}?${queryParams.toString()}`

        console.log('🔍 DEBUG - Sending request with filters:', {
          url: finalUrl,
          filters: filters,
          availability: filters?.availability,
          queryParams: queryParams.toString(),
        })

        const response = await fetch(finalUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch providers')
        }

        const data = await response.json()

        console.log('🔍 DEBUG - API Response:', {
          totalItems: data.meta?.total,
          currentPage: data.meta?.page,
          lastPage: data.meta?.last_page,
          limit: data.meta?.limit,
          providersCount: data.data?.length,
          hasFilters: filters && Object.keys(filters).length > 0,
          activeSearchTerm: activeSearchTerm,
          filtersApplied: filters,
        })

        const transformedProviders: TransformedProvider[] = data.data.map(
          (provider: any) => {
            console.log(
              'DEBUG - Provider raw data:',
              JSON.stringify({
                userId: provider.id,
                providerId: provider.provider.id,
              })
            )

            return {
              id: provider.id.toString(),
              providerId: provider.provider.id,
              name: provider.name,
              email: provider.email,
              avatar: provider.avatar,
              specialty: provider.provider?.specialty || null,
              location: provider.address
                ? `${provider.address.city || ''}, ${
                    provider.address.state || ''
                  }`.trim()
                : 'Localização não informada',
              rating: provider.provider?.provider_rating || null,
              servicesCount: provider.provider?.services?.length || 0,
              price:
                provider.provider?.services &&
                provider.provider.services.length > 0
                  ? Math.min(
                      ...provider.provider.services.map(
                        (service: any) => service.price
                      )
                    )
                  : 0,
              description: provider.provider?.description || null,
              providerType: provider.provider?.providerType || null,
              services:
                provider.provider?.services?.map((service: any) => ({
                  id: service.id,
                  name: service.name,
                  price: service.price,
                  duration: service.duration,
                })) || [],
            }
          }
        )

        setProviders(transformedProviders)
        setTotalPages(data.meta.last_page)
        console.log('📄 DEBUG - Pagination updated:', {
          totalPages: data.meta.last_page,
          currentPage: currentPage,
          willShowPagination: data.meta.last_page > 1,
        })
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
  }, [currentPage, filters, activeSearchTerm])

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') {
        return // Não interferir quando usuário está digitando
      }

      if (event.key === 'ArrowLeft' && currentPage > 1) {
        event.preventDefault()
        handlePageChange(currentPage - 1)
      } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
        event.preventDefault()
        handlePageChange(currentPage + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages])

  // Resetar página quando filtros mudam
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      console.log('📄 DEBUG - Filters changed, resetting to page 1')
      setCurrentPage(1)
    }
  }, [filters])

  const filteredProviders = providers // Remove filtragem local pois agora é feita no backend

  // Função para aplicar filtros locais (especialmente preço)
  const applyLocalFilters = useCallback(
    (providers: TransformedProvider[], filters: any) => {
      let filtered = [...providers]

      // Filtro de preço local (pelo menor preço dos serviços)
      if (
        filters &&
        (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      ) {
        console.log('💰 DEBUG - Aplicando filtro de preço local:', {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          totalProviders: providers.length,
        })

        filtered = filtered.filter((provider) => {
          const minServicePrice = provider.price

          const passesMinPrice =
            filters.minPrice === undefined ||
            minServicePrice >= filters.minPrice
          const passesMaxPrice =
            filters.maxPrice === undefined ||
            minServicePrice <= filters.maxPrice

          return passesMinPrice && passesMaxPrice
        })

        console.log('💰 DEBUG - Resultado filtro preço:', {
          providersAfterFilter: filtered.length,
          removedProviders: providers.length - filtered.length,
        })
      }

      return filtered
    },
    []
  )

  // Aplicar filtros locais
  const locallyFilteredProviders = applyLocalFilters(filteredProviders, filters)

  // Função para ordenar providers localmente
  const sortProviders = useCallback(
    (providers: TransformedProvider[], sortBy: string) => {
      console.log(
        '🔄 DEBUG - Aplicando ordenação local:',
        sortBy,
        'em',
        providers.length,
        'providers'
      )
      const sorted = [...providers]

      switch (sortBy) {
        case 'rating':
          return sorted.sort((a, b) => {
            const ratingA = a.rating || 0
            const ratingB = b.rating || 0
            return ratingB - ratingA // Maior avaliação primeiro
          })

        case 'price_asc':
          return sorted.sort((a, b) => a.price - b.price) // Menor preço primeiro

        case 'price_desc':
          return sorted.sort((a, b) => b.price - a.price) // Maior preço primeiro

        case 'services':
          return sorted.sort((a, b) => b.servicesCount - a.servicesCount) // Mais serviços primeiro

        default:
          return sorted.sort((a, b) => {
            const ratingA = a.rating || 0
            const ratingB = b.rating || 0
            return ratingB - ratingA // Default: melhor avaliação
          })
      }
    },
    []
  )

  // Aplicar ordenação local
  const sortedProviders = sortProviders(locallyFilteredProviders, sortBy)

  // Função para descrever o tipo de ordenação
  const getSortDescription = (sortBy: string) => {
    switch (sortBy) {
      case 'rating':
        return 'Ordenado por: melhor avaliação ⭐'
      case 'price_asc':
        return 'Ordenado por: menor preço 💰'
      case 'price_desc':
        return 'Ordenado por: maior preço 💎'
      case 'services':
        return 'Ordenado por: mais serviços 🔧'
      default:
        return 'Ordenado por: melhor avaliação ⭐'
    }
  }

  const handleSchedule = (provider: TransformedProvider) => {
    console.log(
      'DEBUG - Agendando com provider:',
      JSON.stringify({
        userId: provider.id,
        providerId: provider.providerId,
      })
    )
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setIsChangingPage(true)
      setCurrentPage(newPage)
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Reset loading state after a brief moment
      setTimeout(() => {
        setIsChangingPage(false)
      }, 300)
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
            placeholder='Buscar por nome, email, telefone, especialidade, serviços ou localização...'
            className='pl-10 pr-12'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            onClick={handleSearch}
            size='sm'
            className={`absolute right-1 top-1 h-8 w-8 p-0 ${
              activeSearchTerm ? 'text-blue-600 hover:bg-muted' : ''
            }`}
            variant='ghost'
            title={
              activeSearchTerm
                ? `Buscando por: "${activeSearchTerm}"`
                : 'Clique para buscar'
            }
          >
            <Search className='h-4 w-4' />
          </Button>
        </div>
        <div className='w-full md:w-48'>
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
            disabled={isSorting}
          >
            <SelectTrigger className={isSorting ? 'opacity-50' : ''}>
              <SelectValue placeholder='Ordenar por' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='rating'>⭐ Melhor avaliação</SelectItem>
              <SelectItem value='price_asc'>💰 Menor preço</SelectItem>
              <SelectItem value='price_desc'>💎 Maior preço</SelectItem>
              <SelectItem value='services'>🔧 Mais serviços</SelectItem>
            </SelectContent>
          </Select>
          {isSorting && (
            <p className='text-xs text-blue-600 mt-1 animate-pulse'>
              🔄 Aplicando ordenação...
            </p>
          )}
        </div>
      </div>

      {/* Indicação de busca ativa */}
      {activeSearchTerm && (
        <div className='flex items-center justify-between mb-4 p-3 border border-blue-400 rounded-lg'>
          <div className='flex items-center text-sm text-blue-700'>
            <Search className='h-4 w-4 mr-2' />
            <span>
              Buscando por: <strong>"{activeSearchTerm}"</strong>
            </span>
          </div>
          <Button
            onClick={handleClearSearch}
            size='sm'
            variant='ghost'
            className='text-blue-600 hover:bg-muted h-6 px-2'
          >
            Limpar busca
          </Button>
        </div>
      )}

      {/* Informações de paginação */}
      {!loading && sortedProviders.length > 0 && (
        <div className='flex justify-between items-center mb-4 text-sm text-gray-600'>
          <p>
            Mostrando {sortedProviders.length} provedores na página{' '}
            {currentPage}
            {isSorting && (
              <span className='text-blue-600 ml-2'>🔄 Reordenando...</span>
            )}
          </p>
          {totalPages > 1 && (
            <p>
              Página {currentPage} de {totalPages}
              <span className='block text-xs text-gray-400 mt-1'>
                {getSortDescription(sortBy)}
              </span>
            </p>
          )}
        </div>
      )}

      <div
        className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${
          isSorting || isChangingPage ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {sortedProviders.map((provider) => (
          <Card
            key={provider.id}
            className={`overflow-hidden bg-card text-card-foreground flex flex-col h-full transition-all duration-300 ${
              isChangingPage || isSorting
                ? 'opacity-70 scale-[0.99]'
                : 'opacity-100 scale-100'
            }`}
          >
            <CardContent className='p-0 flex flex-col flex-grow'>
              <div className='p-6 flex flex-col flex-grow'>
                <div className='flex justify-between items-start mb-4 gap-2'>
                  <div className='min-w-0 flex-1'>
                    {' '}
                    <h3 className='font-bold truncate'>{provider.name}</h3>
                    <div className='flex items-center text-sm text-gray-600 mt-1'>
                      <Mail className='h-4 w-4 mr-1 flex-shrink-0' />
                      <span className='truncate'>{provider.email}</span>
                    </div>
                    {provider.specialty && (
                      <p className='text-sm text-gray-600 mt-1 truncate'>
                        {provider.specialty}
                      </p>
                    )}
                    {/* {provider.services.length > 0 && (
                      <p className='text-xs text-gray-500 mt-1 truncate'>
                        Serviços:{' '}
                        {provider.services.map((s) => s.name).join(', ')}
                      </p>
                    )} */}
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-blue-50 text-blue-600 border-blue-200 flex-shrink-0 mt-1'
                  >
                    R${provider.price.toFixed(2)}
                  </Badge>
                </div>

                <div className='flex items-center text-sm text-gray-600 mb-4'>
                  <MapPin className='h-4 w-4 mr-1 flex-shrink-0' />
                  <span className='truncate'>{provider.location}</span>
                </div>

                <div className='flex justify-between items-center mt-auto'>
                  <div className='flex items-center'>
                    {provider.rating !== null ? (
                      <>
                        <div className='flex'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(provider.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className='text-sm ml-2'>
                          {provider.rating?.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className='text-sm text-gray-500'>
                        Sem avaliação
                      </span>
                    )}
                  </div>
                  <span className='text-xs text-gray-500'>
                    {provider.servicesCount}{' '}
                    {provider.servicesCount === 1 ? 'serviço' : 'serviços'}
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
            Nenhum provedor encontrado
            {activeSearchTerm && (
              <>
                {' '}
                para "<strong>{activeSearchTerm}</strong>"
                <br />
                <Button
                  onClick={handleClearSearch}
                  variant='link'
                  className='text-blue-600 mt-2'
                >
                  Limpar busca e ver todos os provedores
                </Button>
              </>
            )}
          </p>
        </div>
      )}

      {(totalPages > 1 ||
        (filters && Object.keys(filters).length > 0) ||
        activeSearchTerm) && (
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

              {(() => {
                const maxVisiblePages = 5
                const halfVisible = Math.floor(maxVisiblePages / 2)
                let startPage = Math.max(1, currentPage - halfVisible)
                let endPage = Math.min(totalPages, currentPage + halfVisible)

                // Ajustar para sempre mostrar 5 páginas (quando possível)
                if (endPage - startPage + 1 < maxVisiblePages) {
                  if (startPage === 1) {
                    endPage = Math.min(
                      totalPages,
                      startPage + maxVisiblePages - 1
                    )
                  } else if (endPage === totalPages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1)
                  }
                }

                const pages = []

                // Primeira página e reticências se necessário
                if (startPage > 1) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        isActive={1 === currentPage}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )
                  if (startPage > 2) {
                    pages.push(
                      <PaginationItem key='start-ellipsis'>
                        <span className='px-3 py-2 text-gray-500'>...</span>
                      </PaginationItem>
                    )
                  }
                }

                // Páginas do meio
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={i === currentPage}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                // Última página e reticências se necessário
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <PaginationItem key='end-ellipsis'>
                        <span className='px-3 py-2 text-gray-500'>...</span>
                      </PaginationItem>
                    )
                  }
                  pages.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        isActive={totalPages === currentPage}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                return pages
              })()}

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
