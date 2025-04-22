import { Camera, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfileHeader() {
  return (
    <div className='flex flex-col items-center'>
      <div className='relative'>
        <div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden'>
          <img
            src='/placeholder.svg?height=96&width=96'
            alt='Foto de perfil'
            className='w-full h-full object-cover'
          />
        </div>
        <Button
          size='icon'
          variant='secondary'
          className='absolute bottom-0 right-0 rounded-full w-8 h-8'
        >
          <Camera className='h-4 w-4' />
          <span className='sr-only'>Alterar foto</span>
        </Button>
      </div>

      <h1 className='text-2xl font-bold mt-4'>Felipe da Silva</h1>
      <p className='text-gray-600'>felipe.silva@email.com</p>

      <div className='flex items-center mt-2'>
        <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
          Plano Básico
        </span>
        <Button variant='ghost' size='sm' className='ml-2'>
          <Edit className='h-3 w-3 mr-1' />
          Alterar plano
        </Button>
      </div>
    </div>
  )
}
