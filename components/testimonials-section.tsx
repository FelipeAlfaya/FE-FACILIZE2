'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    content:
      'A Facilize transformou completamente a gestão do meu consultório. Economizo horas por semana com a emissão automática de notas fiscais e o sistema de agendamentos.',
    author: 'Dra. Carla Mendes',
    role: 'Psicóloga',
    avatar: '/images/Carla.png',
  },
  {
    id: 2,
    content:
      'Como contador, recomendo a Facilize para todos os meus clientes. A plataforma é intuitiva e mantém tudo em conformidade com a legislação fiscal, facilitando muito o meu trabalho.',
    author: 'Ricardo Oliveira',
    role: 'Contador',
    avatar: '/images/Ricardo.png',
  },
  {
    id: 3,
    content:
      'O chatbot integrado ao WhatsApp melhorou muito a comunicação com meus clientes. As confirmações automáticas reduziram as faltas em mais de 70%!',
    author: 'Fernanda Costa',
    role: 'Fisioterapeuta',
    avatar: '/images/Fernanda.png',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  const next = () => {
    setDirection(1)
    setCurrent((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    )
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    )
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      next()
    }, 7000)

    return () => clearInterval(interval)
  }, [autoplay])

  return (
    <section className='py-16 bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 md:px-8'>
        <div className='text-center mb-12'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-3xl font-bold text-gray-900 dark:text-white'
          >
            O que nossos{' '}
            <span className='text-blue-600 dark:text-blue-400'>clientes</span>{' '}
            dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto'
          >
            Milhares de profissionais e pequenas empresas já transformaram seus
            negócios com a Facilize
          </motion.p>
        </div>

        <div
          className='relative max-w-4xl mx-auto'
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className='absolute -top-6 -right-6 z-10 hidden md:block'>
            <div className='bg-blue-600 text-white text-6xl font-bold py-2 px-6 rounded-lg opacity-10'>
              ”
            </div>
          </div>

          <div className='flex justify-between items-center absolute inset-0 z-10 pointer-events-none'>
            <button
              onClick={prev}
              className='bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 pointer-events-auto hover:scale-110'
              aria-label='Anterior'
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className='bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 pointer-events-auto hover:scale-110'
              aria-label='Próximo'
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className='overflow-hidden relative h-[400px] md:h-[300px]'>
            <AnimatePresence mode='popLayout' custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                }}
                className='absolute inset-0'
              >
                <div className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg h-full flex flex-col md:flex-row items-center gap-8 border border-gray-200 dark:border-gray-700'>
                  <div className='md:w-1/3 flex-shrink-0 flex justify-center relative'>
                    <div className='relative w-32 h-32'>
                      <Image
                        src={testimonials[current].avatar}
                        alt={testimonials[current].author}
                        fill
                        className='rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg'
                        sizes='(max-width: 768px) 128px, 150px'
                      />
                      <div className='absolute -top-3 -right-3 bg-blue-600 dark:bg-blue-700 rounded-full p-3 shadow-md'>
                        <Quote size={20} className='text-white' />
                      </div>
                    </div>
                  </div>
                  <div className='md:w-2/3 text-center md:text-left'>
                    <Quote
                      size={24}
                      className='text-gray-300 dark:text-gray-600 mb-4 mx-auto md:mx-0'
                    />
                    <p className='text-gray-700 dark:text-gray-300 text-lg italic mb-6'>
                      {testimonials[current].content}
                    </p>
                    <div>
                      <h4 className='font-bold text-xl text-gray-900 dark:text-white'>
                        {testimonials[current].author}
                      </h4>
                      <p className='text-gray-500 dark:text-gray-400'>
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className='flex justify-center mt-8 gap-2'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1)
                  setCurrent(index)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-blue-600 dark:bg-blue-400 w-6'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
