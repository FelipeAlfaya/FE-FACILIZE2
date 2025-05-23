'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Filter, X } from 'lucide-react'

interface ProviderFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function ProviderFilters({ onFiltersChange }: ProviderFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [availableTimeslots, setAvailableTimeslots] = useState<any[]>([])
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<
    string[]
  >([])
  const [isLoadingTimeslots, setIsLoadingTimeslots] = useState(false)
  const [apiSpecialties, setApiSpecialties] = useState<string[]>([])
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(false)

  const specialties =
    apiSpecialties.length > 0
      ? apiSpecialties
      : [
          'Contabilidade Fiscal',
          'Contabilidade Tributária',
          'Contabilidade Empresarial',
          'Contabilidade Pessoal',
        ]

  useEffect(() => {
    const currentSpecialties = apiSpecialties || []

    if (currentSpecialties.length > 0) {
      setSelectedSpecialties((prev) => {
        const filteredSpecialties = prev.filter((specialty) =>
          currentSpecialties.includes(specialty)
        )
        if (filteredSpecialties.length !== prev.length) {
          return filteredSpecialties
        }
        return prev
      })
    }
  }, [apiSpecialties])

  // Buscar horários disponíveis
  useEffect(() => {
    const fetchTimeslots = async () => {
      try {
        setIsLoadingTimeslots(true)
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        if (!token) return

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}users/availabilities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setAvailableTimeslots(data.data || [])
        }
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error)
      } finally {
        setIsLoadingTimeslots(false)
      }
    }

    fetchTimeslots()
  }, [])

  // Buscar especialidades disponíveis
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setIsLoadingSpecialties(true)
        const token =
          localStorage.getItem('access_token') ||
          sessionStorage.getItem('access_token')

        if (!token) return

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}users/specialties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setApiSpecialties(data.data || [])
        }
      } catch (error) {
        console.error('Erro ao buscar especialidades disponíveis:', error)
      } finally {
        setIsLoadingSpecialties(false)
      }
    }

    fetchSpecialties()
  }, [])

  const handleSpecialtyChange = useCallback((specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
  }, [])

  const handleRatingChange = useCallback((rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    )
  }, [])

  const handleAvailabilityChange = useCallback((timeRange: string) => {
    setSelectedAvailabilities((prev) =>
      prev.includes(timeRange)
        ? prev.filter((a) => a !== timeRange)
        : [...prev, timeRange]
    )
  }, [])

  const clearFilters = useCallback(() => {
    console.log('🧹 DEBUG - Clearing filters')
    setPriceRange([0, 500])
    setSelectedSpecialties([])
    setSelectedRatings([])
    setSelectedAvailabilities([])
    onFiltersChange({})
  }, [onFiltersChange])

  const applyFilters = useCallback(() => {
    const filters = {
      specialty:
        selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
      minRating:
        selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
      availability:
        selectedAvailabilities.length > 0 ? selectedAvailabilities : undefined,
    }
    console.log('🎯 DEBUG - Applying filters:', filters)
    onFiltersChange(filters)
  }, [
    selectedSpecialties,
    priceRange,
    selectedRatings,
    selectedAvailabilities,
    onFiltersChange,
  ])

  return (
    <>
      <Button
        variant='outline'
        className='w-full mb-4 md:hidden flex items-center justify-between'
        onClick={() => setShowFilters(!showFilters)}
      >
        <span className='flex items-center'>
          <Filter className='mr-2 h-4 w-4' />
          Filtros
        </span>
        {showFilters && <X className='h-4 w-4' />}
      </Button>

      <Card className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <CardHeader>
          <CardTitle className='text-lg'>Filtros</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <h3 className='font-medium text-sm'>
              Especialidades
              {apiSpecialties.length > 0 && (
                <span className='text-xs text-gray-500'>
                  {' '}
                  ({apiSpecialties.length} disponíveis)
                </span>
              )}
              {selectedSpecialties.length > 0 && (
                <span className='text-xs text-blue-600 ml-1 font-medium'>
                  ({selectedSpecialties.length} selecionadas)
                </span>
              )}
            </h3>
            <div className='space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2 pl-3 pt-2'>
              {isLoadingSpecialties ? (
                <div className='py-2'>
                  <p className='text-xs text-gray-500 italic'>
                    Carregando especialidades da API...
                  </p>
                </div>
              ) : specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <div
                    key={specialty}
                    className='flex items-center space-x-2 py-1'
                  >
                    <Checkbox
                      id={specialty.replace(/\s+/g, '-').toLowerCase()}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyChange(specialty)}
                    />
                    <Label
                      htmlFor={specialty.replace(/\s+/g, '-').toLowerCase()}
                      className='text-sm leading-relaxed cursor-pointer'
                    >
                      {specialty}
                    </Label>
                  </div>
                ))
              ) : (
                <div className='py-2'>
                  <p className='text-xs text-gray-500 italic'>
                    Nenhuma especialidade encontrada
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-sm'>Preço</h3>
              <span className='text-sm text-gray-500'>
                R${priceRange[0]} - R${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 500]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>

          <div className='space-y-4'>
            <h3 className='font-medium text-sm'>Avaliação</h3>
            <div className='space-y-2'>
              {[5, 4, 3].map((rating) => (
                <div key={rating} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`rating${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => handleRatingChange(rating)}
                  />
                  <Label htmlFor={`rating${rating}`}>
                    {rating === 5 ? '5 estrelas' : `${rating}+ estrelas`}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-medium text-sm'>
              Horários Disponíveis
              {selectedAvailabilities.length > 0 && (
                <span className='text-xs text-blue-600 ml-1 font-medium'>
                  ({selectedAvailabilities.length} selecionados)
                </span>
              )}
            </h3>
            <div className='space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2 pl-3 pt-2'>
              {isLoadingTimeslots ? (
                <div className='py-2'>
                  <p className='text-xs text-gray-500 italic'>
                    Carregando horários...
                  </p>
                </div>
              ) : availableTimeslots.length > 0 ? (
                availableTimeslots.map((timeslot, index) => (
                  <div
                    key={`${timeslot.weekday}-${timeslot.timeRange}-${index}`}
                    className='flex items-center space-x-2 py-1 '
                  >
                    <Checkbox
                      id={`timeslot-${index}`}
                      checked={selectedAvailabilities.includes(
                        timeslot.timeRange
                      )}
                      onCheckedChange={() =>
                        handleAvailabilityChange(timeslot.timeRange)
                      }
                    />
                    <Label
                      htmlFor={`timeslot-${index}`}
                      className='text-xs leading-relaxed cursor-pointer'
                    >
                      <span className='font-medium'>
                        {timeslot.weekdayName}:
                      </span>{' '}
                      <span className='text-muted-foreground'>
                        {timeslot.timeRange}
                      </span>
                    </Label>
                  </div>
                ))
              ) : (
                <div className='py-2'>
                  <p className='text-xs text-gray-500 italic'>
                    Nenhum horário encontrado
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='pt-4 flex space-x-2'>
            <Button variant='outline' className='w-full' onClick={clearFilters}>
              Limpar
            </Button>
            <Button className='w-full' onClick={applyFilters}>
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
