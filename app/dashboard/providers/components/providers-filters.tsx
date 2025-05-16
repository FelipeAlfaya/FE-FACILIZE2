'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Filter, X } from 'lucide-react'

export function ProviderFilters() {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const specialties = [
    'Contabilidade Fiscal',
    'Contabilidade Tributária',
    'Contabilidade Empresarial',
    'Contabilidade Pessoal',
  ]

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 100])
    setSelectedSpecialties([])
    setSelectedRatings([])
  }

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
            <h3 className='font-medium text-sm'>Especialidades</h3>
            <div className='space-y-2'>
              {specialties.map((specialty) => (
                <div key={specialty} className='flex items-center space-x-2'>
                  <Checkbox
                    id={specialty.replace(/\s+/g, '-').toLowerCase()}
                    checked={selectedSpecialties.includes(specialty)}
                    onCheckedChange={() => handleSpecialtyChange(specialty)}
                  />
                  <Label htmlFor={specialty.replace(/\s+/g, '-').toLowerCase()}>
                    {specialty}
                  </Label>
                </div>
              ))}
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
              defaultValue={[0, 100]}
              max={200}
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

          <div className='pt-4 flex space-x-2'>
            <Button variant='outline' className='w-full' onClick={clearFilters}>
              Limpar
            </Button>
            <Button className='w-full'>Aplicar</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

