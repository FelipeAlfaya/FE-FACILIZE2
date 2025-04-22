'use client'

import type React from 'react'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Logo from '@/components/logo'
import AnimatedInput from '@/components/animated-input'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    if (!formData.terms) {
      newErrors.terms = 'Você deve aceitar os termos'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Submit form logic would go here
      console.log('Form submitted', formData)
    }
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <Header />

      <div className='w-full gap-10 lg:grid lg:min-h-[600px] lg:grid-cols-2 lg:gap-0 xl:min-h-[800px]'>
        <motion.div
          className='flex items-center justify-center p-6 xl:p-10'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='mx-auto w-[350px] space-y-6'>
            <div className='space-y-2 text-center'>
              <h1 className='text-3xl font-bold'>Crie sua conta</h1>
              <p className='text-muted-foreground'>
                Já tem uma conta?{' '}
                <Link href='/login' className='text-blue-600 hover:underline'>
                  Entrar
                </Link>
              </p>
            </div>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <AnimatedInput
                label='Nome completo'
                name='name'
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <AnimatedInput
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <AnimatedInput
                label='Senha'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <p className='text-xs text-gray-500 -mt-2'>
                A senha deve ter pelo menos 8 caracteres, incluindo letras e
                números
              </p>

              <AnimatedInput
                label='Confirmar senha'
                name='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />

              <div className='flex items-start space-x-2 pt-2'>
                <Checkbox
                  id='terms'
                  name='terms'
                  checked={formData.terms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      terms: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor='terms'
                  className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Eu concordo com os{' '}
                  <Link
                    href='/termos'
                    className='text-blue-600 hover:underline'
                  >
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link
                    href='/privacidade'
                    className='text-blue-600 hover:underline'
                  >
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className='text-xs text-red-500'>{errors.terms}</p>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700'
                >
                  Criar conta
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className='items-center justify-center p-6 lg:flex lg:bg-gradient-to-r lg:from-blue-500 lg:to-blue-700 lg:p-10'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='mx-auto items-center text-center text-white'>
            <Image
              src='/images/logo-transparente.svg'
              alt='Profissional trabalhando'
              width={50}
              height={50}
              className='w-[300px] h-auto object-cover mx-auto'
            />
            <h2 className='mt-6 text-3xl font-bold'>
              Simplifique a gestão do seu negócio
            </h2>
            <motion.ul
              className='mt-8 space-y-4 text-left'
              initial='hidden'
              animate='visible'
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                'Emita notas fiscais em segundos',
                'Gerencie seus clientes em um só lugar',
                'Automatize agendamentos e lembretes',
                'Acesse relatórios detalhados do seu negócio',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className='flex items-start'
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <svg
                    className='mr-2 h-6 w-6 flex-shrink-0 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    ></path>
                  </svg>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <p className='mt-8 text-sm opacity-90'>
              Mais de 10.000 profissionais já confiam na Facilize para gerenciar
              seus negócios
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

