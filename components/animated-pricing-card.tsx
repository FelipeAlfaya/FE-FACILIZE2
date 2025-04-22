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
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`border rounded-lg overflow-hidden flex flex-col ${
        highlighted ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -10,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.3 },
      }}
    >
      <div className='p-6 bg-white'>
        <div className='text-center mb-4'>
          <motion.h3
            className='text-lg font-bold'
            animate={{
              color: isHovered && highlighted ? '#2563EB' : '#000000',
            }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
          {discount && (
            <motion.span
              className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {discount}
            </motion.span>
          )}
        </div>

        <div className='text-center mb-6'>
          <motion.div
            className='text-3xl font-bold text-blue-600'
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className='text-sm align-top'>R$</span>
            {price}
          </motion.div>
          <div className='text-sm text-gray-500'>{period}</div>
        </div>

        <ul className='space-y-3 mb-8'>
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
                className='text-green-500 mr-2 mt-0.5 flex-shrink-0'
              />
              <span className='text-sm'>{feature}</span>
            </motion.li>
          ))}
        </ul>

        <div className='mt-auto'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className={`w-full ${
                highlighted
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : isHovered
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className='mt-auto mb-7 flex justify-center max-w-[50px] mx-auto'>
        {/* <motion.div
          className="w-8 h-8 border-2 border-blue-600 flex items-center justify-center"
          animate={{ rotate: isHovered ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-blue-600"
            animate={{ rotate: isHovered ? -45 : 0 }}
            transition={{ duration: 0.3 }}
          /> */}
        {/* </motion.div> */}
        <Image
          src='/images/logo-color.svg'
          alt='Profissional trabalhando'
          width={50}
          height={50}
          className='w-full h-auto object-cover'
        />
      </div>
    </motion.div>
  )
}

