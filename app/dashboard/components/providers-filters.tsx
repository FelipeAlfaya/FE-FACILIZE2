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
              <div className='flex items-center space-x-2'>
                <Checkbox id='fiscal' />
                <Label htmlFor='fiscal'>Contabilidade Fiscal</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='tributaria' />
                <Label htmlFor='tributaria'>Contabilidade Tributária</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='empresarial' />
                <Label htmlFor='empresarial'>Contabilidade Empresarial</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='pessoal' />
                <Label htmlFor='pessoal'>Contabilidade Pessoal</Label>
              </div>
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
              <div className='flex items-center space-x-2'>
                <Checkbox id='rating5' />
                <Label htmlFor='rating5'>5 estrelas</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='rating4' />
                <Label htmlFor='rating4'>4+ estrelas</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='rating3' />
                <Label htmlFor='rating3'>3+ estrelas</Label>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-medium text-sm'>Localização</h3>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='sp' />
                <Label htmlFor='sp'>São Paulo</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='rj' />
                <Label htmlFor='rj'>Rio de Janeiro</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='mg' />
                <Label htmlFor='mg'>Minas Gerais</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='rs' />
                <Label htmlFor='rs'>Rio Grande do Sul</Label>
              </div>
            </div>
          </div>

          <div className='pt-4 flex space-x-2'>
            <Button variant='outline' className='w-full'>
              Limpar
            </Button>
            <Button className='w-full'>Aplicar</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
