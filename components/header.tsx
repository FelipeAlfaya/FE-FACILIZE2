'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from '@/components/logo'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  showProfile?: boolean
}

export default function Header({ showProfile = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center'>
              <Logo />
              <span className='ml-2 text-xl font-bold'>Facilize</span>
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            <nav className='flex space-x-6'>
              <Link href='/' className='text-gray-600 hover:text-gray-900'>
                Início
              </Link>
              <Link href='/' className='text-gray-600 hover:text-gray-900'>
                Planos
              </Link>
              <Link href='/' className='text-gray-600 hover:text-gray-900'>
                Sobre
              </Link>
              <Link href='/' className='text-gray-600 hover:text-gray-900'>
                Contato
              </Link>
            </nav>

            {showProfile ? (
              <Avatar>
                <AvatarImage src='/images/avatar.jpg' />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            ) : (
              <Link href='/'>
                <Button className='bg-blue-600 hover:bg-blue-700'>
                  Entrar
                </Button>
              </Link>
            )}
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

      {/* Mobile menu */}
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
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Planos
            </Link>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>

            {!showProfile && (
              <Link
                href='/'
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

