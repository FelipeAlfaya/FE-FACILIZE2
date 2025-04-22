import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Image from 'next/image'

interface PricingCardDetailedProps {
  title: string
  price: string
  period: string
  features: string[]
  buttonText: string
  highlighted?: boolean
  discount?: string
}

export default function PricingCardDetailed({
  title,
  price,
  period,
  features,
  buttonText,
  highlighted = false,
  discount,
}: PricingCardDetailedProps) {
  return (
    <div
      className={`border rounded-xl overflow-hidden flex flex-col transition-all duration-300 ${
        highlighted
          ? 'border-blue-500 dark:border-blue-400 shadow-lg dark:shadow-blue-900/20 scale-[1.02]'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className='p-6 bg-white dark:bg-gray-800 flex flex-col h-full'>
        <div className='text-center mb-4'>
          <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
            {title}
          </h3>
          {discount && (
            <span className='inline-block bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs px-2 py-1 rounded-full mt-2'>
              {discount}
            </span>
          )}
        </div>

        <div className='text-center mb-6'>
          <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
            <span className='text-sm align-top'>R$</span>
            {price}
          </div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {period}
          </div>
        </div>

        <ul className='space-y-3 mb-8'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-start'>
              <Check
                size={18}
                className='text-emerald-500 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className='mt-auto'>
          <Button
            className={`w-full ${
              highlighted
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
          >
            {buttonText}
          </Button>
        </div>
      </div>

      <div className='mt-auto p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-center'>
        <Image
          src={'/images/logo-color.svg'}
          alt='Logo Facilize'
          width={50}
          height={50}
          className='w-[50px] h-auto object-cover'
        />
      </div>
    </div>
  )
}
