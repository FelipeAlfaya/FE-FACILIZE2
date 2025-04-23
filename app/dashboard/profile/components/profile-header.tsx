// components/profile-header.tsx
'use client'

import { Camera, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { toast } from 'sonner'

// Avatares padrão em base64 (pré-convertidos)
const defaultAvatars = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // profile-1 em base64
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // profile-2 em base64
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...', // profile-3 em base64
]

export function ProfileHeader() {
  const { user, loading, error, refreshUser } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState<string>('')

  useEffect(() => {
    if (user) {
      if (user.avatar) {
        // Se o avatar começar com 'data:', já está em base64
        if (user.avatar.startsWith('data:')) {
          setAvatarSrc(user.avatar)
        } else {
          // Se for uma URL, faz a chamada GET para obter a imagem
          fetchAvatar(user.avatar)
        }
      } else {
        // Seleciona um avatar padrão aleatório
        const randomIndex = Math.floor(Math.random() * defaultAvatars.length)
        setAvatarSrc(defaultAvatars[randomIndex])
      }
    }
  }, [user])

  const fetchAvatar = async (avatarUrl: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${avatarUrl.replace(/^\/+/, '')}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarSrc(reader.result as string)
        }
        reader.readAsDataURL(blob)
      } else {
        setRandomDefaultAvatar()
      }
    } catch (error) {
      console.error('Error fetching avatar:', error)
      setRandomDefaultAvatar()
    }
  }

  const setRandomDefaultAvatar = () => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length)
    setAvatarSrc(defaultAvatars[randomIndex])
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user.id}/avatar`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update avatar')
      }

      await refreshUser()
      toast.success('Avatar updated successfully!')
    } catch (err) {
      console.error('Error updating avatar:', err)
      toast.error('Error updating avatar')
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return <div className='flex flex-col items-center'>Loading...</div>
  }

  if (error || !user) {
    return (
      <div className='flex flex-col items-center text-red-500'>
        {error || 'User not found'}
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='relative'>
        <div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden'>
          <img
            src={avatarSrc || '/placeholder.svg?height=96&width=96'}
            alt='Profile picture'
            className='w-full h-full object-cover'
            onError={() => setRandomDefaultAvatar()}
          />
        </div>
        <Button
          size='icon'
          variant='secondary'
          className='absolute bottom-0 right-0 rounded-full w-8 h-8'
          onClick={handleAvatarClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className='animate-spin'>↻</div>
          ) : (
            <Camera className='h-4 w-4' />
          )}
          <span className='sr-only'>Change photo</span>
        </Button>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/*'
          className='hidden'
        />
      </div>

      <h1 className='text-2xl font-bold mt-4'>{user.name}</h1>
      <p className='text-gray-600'>{user.email}</p>

      {user.provider?.plan && (
        <div className='flex items-center mt-2'>
          <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
            {user.provider.plan.name}
          </span>
          <Button variant='ghost' size='sm' className='ml-2'>
            <Edit className='h-3 w-3 mr-1' />
            <Link href='/dashboard/plans'>Change plan</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
