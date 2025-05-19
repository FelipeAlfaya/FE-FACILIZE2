'use client'

import { Camera, Edit, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'

interface Plan {
  id: number
  name: string
  price: number
  description: string
}

export function ProfileHeader() {
  const { user, loading, error, refreshUser } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState<string>('')
  const [avatarLoading, setAvatarLoading] = useState(true)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [planLoading, setPlanLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setAvatarLoading(true)
      if (user.avatar) {
        if (user.avatar.startsWith('data:')) {
          setAvatarSrc(user.avatar)
          setAvatarLoading(false)
        } else {
          fetchAvatar(user.avatar)
        }
      } else {
        setAvatarLoading(false)
      }

      if (user.type === 'PROVIDER' && user.provider?.planId) {
        fetchPlan(user.provider.planId)
      }
    }
  }, [user])

  const getNameInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const fetchPlan = async (planId: number) => {
    setPlanLoading(true)
    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}plans/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch plan details')
      }

      const data = await response.json()
      setPlan(data)
    } catch (err) {
      console.error('Error fetching plan:', err)
      toast.error('Failed to load plan information')
    } finally {
      setPlanLoading(false)
    }
  }

  const fetchAvatar = async (avatarUrl: string) => {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${avatarUrl.replace(/^\/+/, '')}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarSrc(reader.result as string)
          setAvatarLoading(false)
        }
        reader.readAsDataURL(blob)
      }
    } catch (error) {
      console.error('Error fetching avatar:', error)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB')
      return
    }

    setIsUploading(true)
    toast.info('Uploading avatar...')

    try {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}users/${user.id}/avatar`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update avatar')
      }

      await refreshUser()
      toast.success('Avatar updated successfully!')
    } catch (err) {
      console.error('Error updating avatar:', err)
      toast.error(err instanceof Error ? err.message : 'Error updating avatar')
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center space-y-4'>
        <Skeleton className='w-24 h-24 rounded-full' />
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className='flex flex-col items-center space-y-4 text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20'>
        <div className='text-center'>
          <p className='font-medium'>{error || 'User not found'}</p>
          <Button
            variant='ghost'
            size='sm'
            onClick={refreshUser}
            className='mt-2'
          >
            Tente novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='relative group'>
        <div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative'>
          {avatarLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
            </div>
          ) : (
            <>
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt='Avatar'
                  className='rounded-full object-cover'
                />
              ) : (
                <div className='object-cover flex items-center justify-center w-full h-full text-gray-600 text-4xl text-bold'>
                  {user?.name ? getNameInitials(user.name) : 'U'}
                </div>
              )}
            </>
          )}
        </div>
        <Button
          size='icon'
          variant='secondary'
          className='absolute bottom-0 right-0 rounded-full w-8 h-8 group-hover:opacity-100 transition-opacity'
          onClick={handleAvatarClick}
          disabled={isUploading || avatarLoading}
        >
          {isUploading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Camera className='h-4 w-4' />
          )}
          <span className='sr-only'>Mudar de foto</span>
        </Button>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/png, image/jpeg, image/webp'
          className='hidden'
        />
      </div>

      <h1 className='text-2xl font-bold mt-4 text-center'>{user.name}</h1>
      <p className='text-gray-600 dark:text-gray-400 text-center'>
        {user.email}
      </p>

      {user.type === 'PROVIDER' && (
        <div className='flex items-center mt-2'>
          {planLoading ? (
            <Skeleton className='h-6 w-24 rounded-full' />
          ) : (
            <Badge
              variant='outline'
              className='bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            >
              {plan?.name || 'Professional Plan'}
            </Badge>
          )}
          <Button asChild variant='ghost' size='sm' className='ml-2'>
            <Link href='/dashboard/plans' className='flex items-center'>
              <Edit className='h-3 w-3 mr-1' />
              Alterar Plano
            </Link>
          </Button>
        </div>
      )}

      {user.type === 'CLIENT' && (
        <div className='mt-2'>
          <Badge
            variant='outline'
            className='bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          >
            Cliente
          </Badge>
        </div>
      )}
    </div>
  )
}

