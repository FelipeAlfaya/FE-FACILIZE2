'use client'

import type React from 'react'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Logo from '@/components/logo'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Submit form logic would go here
      console.log('Form submitted', { email, password })
    }
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <Header />

      <div className='max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-sm'>
        <motion.div
          className='flex flex-col items-center mb-8'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src='/images/logo-color.svg'
            alt='Profissional trabalhando'
            width={50}
            height={50}
            className='w-[50px] h-auto object-cover'
          />
          <h1 className='text-xl font-medium mt-4'>Entre na sua conta</h1>
        </motion.div>

        <motion.form
          className='space-y-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          <div className='space-y-4'>
            <AnimatedInput
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div>
              <AnimatedInput
                label='Senha'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <div className='flex justify-end mt-1'>
                <Link
                  href='/forgot-password'
                  className='text-sm text-blue-600 hover:underline'
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700'
            >
              Entrar
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          className='mt-6 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className='text-sm text-gray-600'>
            Não tem uma conta?{' '}
            <Link href='/signup' className='text-blue-600 hover:underline'>
              Cadastre-se
            </Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

