'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ResourceHeroProps {
  title: string
  description: string
  icon?: ReactNode
}

export default function ResourceHero({
  title,
  description,
  icon,
}: ResourceHeroProps) {
  return (
    <section className='relative w-full py-16 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950'>
      <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpeg')] bg-cover bg-center opacity-20" />
      <div className='relative z-10 max-w-4xl mx-auto px-4 text-center text-white'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col items-center'
        >
          {icon && (
            <div className='mb-4 bg-white/10 p-4 rounded-full'>{icon}</div>
          )}
          <h1 className='text-4xl font-bold mb-4'>{title}</h1>
          <p className='text-xl max-w-2xl mx-auto text-white/90'>
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

