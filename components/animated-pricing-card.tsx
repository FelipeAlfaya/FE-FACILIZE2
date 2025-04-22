'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface AnimatedPricingCardProps {
  title: string
  price: string
  period?: string
  features: string[]
  buttonText: string
  highlighted?: boolean
  discount?: string
}

export default function AnimatedPricingCard({
  title,
  price,
  period = 'por mês',
  features,
  buttonText,
  highlighted = false,
  discount,
}: AnimatedPricingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      viewport={{ once: true, margin: '-50px' }}
      className={`relative rounded-xl overflow-hidden flex flex-col h-full transition-all ${
        highlighted
          ? 'border-2 border-blue-500 dark:border-blue-400 shadow-lg dark:shadow-blue-900/20'
          : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -15,
        boxShadow: highlighted
          ? '0 20px 25px -5px rgba(59, 130, 246, 0.2)'
          : '0 10px 15px -5px rgba(0, 0, 0, 0.1)',
      }}
    >
      {highlighted && (
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800' />
      )}

      <div className='p-8 bg-white dark:bg-gray-800 flex flex-col h-full'>
        <div className='text-center mb-6'>
          <motion.h3
            className={`text-xl font-bold ${
              highlighted
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-900 dark:text-white'
            }`}
            animate={{
              color:
                isHovered && !highlighted
                  ? '#2563EB'
                  : highlighted
                  ? '#2563EB'
                  : '',
            }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
          {discount && (
            <motion.span
              className='inline-block bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs px-3 py-1 rounded-full mt-3'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {discount}
            </motion.span>
          )}
        </div>

        <div className='text-center mb-8'>
          <motion.div
            className={`text-4xl font-bold ${
              highlighted
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-900 dark:text-white'
            }`}
            animate={{
              scale: isHovered ? 1.03 : 1,
              color: isHovered && !highlighted ? '#2563EB' : '',
            }}
            transition={{ duration: 0.1 }}
          >
            <span className='text-lg align-top'>R$</span>
            {price}
          </motion.div>
          <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {period}
          </div>
        </div>

        <ul className='space-y-4 mb-8'>
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className='flex items-start'
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Check
                size={18}
                className={`mr-3 mt-0.5 flex-shrink-0 ${
                  highlighted
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                {feature}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className='mt-auto'>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className={`w-full text-lg py-4 ${
                highlighted
                  ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
              size='lg'
            >
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className='mt-auto p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-center'>
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={'/images/logo-color.svg'}
            alt='Logo Facilize'
            width={50}
            height={50}
            className='w-[50px] h-auto object-cover'
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
