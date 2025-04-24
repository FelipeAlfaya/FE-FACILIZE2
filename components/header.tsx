'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu, Moon, Sun, X, LogOut, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  showProfile?: boolean
}

export default function Header({ showProfile = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    // Verifica se há token no localStorage quando o componente monta
    const token = localStorage.getItem('access_token')
    setIsAuthenticated(!!token)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <header className='shadow-sm bg-white dark:bg-slate-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center'>
              <Image
                src={
                  theme === 'dark'
                    ? '/images/logo-transparente.svg'
                    : '/images/logo-2.svg'
                }
                alt='Logo Facilize'
                width={50}
                height={50}
                className='w-[150px] h-auto object-cover'
              />
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            <nav className='flex space-x-6'>
              <Link
                href='/'
                className='text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-slate-950'
              >
                Início
              </Link>
              <Link
                href='/planos'
                className='text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-slate-950'
              >
                Planos
              </Link>
              <Link
                href='/sobre'
                className='text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-slate-950'
              >
                Sobre
              </Link>
              <Link
                href='/contato'
                className='text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-slate-950'
              >
                Contato
              </Link>
            </nav>

            {isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                <Link href='/dashboard'>
                  <Button variant='outline' className='flex items-center'>
                    <LayoutDashboard className='h-4 w-4 mr-2' />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  onClick={handleLogout}
                  className='flex items-center'
                >
                  <LogOut className='h-4 w-4 mr-2' />
                  Sair
                </Button>
              </div>
            ) : (
              <Link href='/login'>
                <Button className='bg-blue-600 hover:bg-blue-700'>
                  Entrar
                </Button>
              </Link>
            )}

            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              className='relative'
            >
              {theme === 'dark' ? (
                <Sun className='h-5 w-5' />
              ) : (
                <Moon className='h-5 w-5' />
              )}
            </Button>
          </div>

          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-gray-600 hover:text-gray-900'
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href='/planos'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Planos
            </Link>
            <Link
              href='/sobre'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href='/contato'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href='/dashboard'
                  className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className='h-4 w-4 mr-2' />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className='w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center'
                >
                  <LogOut className='h-4 w-4 mr-2' />
                  Sair
                </button>
              </>
            ) : (
              <Link
                href='/login'
                className='block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700'
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
