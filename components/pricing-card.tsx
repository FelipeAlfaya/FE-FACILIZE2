import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  buttonText: string
  highlighted?: boolean
  logoColor?: 'blue' | 'gray'
}

export default function PricingCard({
  title,
  price,
  features,
  buttonText,
  highlighted = false,
  logoColor = 'blue',
}: PricingCardProps) {
  return (
    <div
      className={`border rounded-xl p-6 flex flex-col h-full transition-all duration-300 ${
        highlighted
          ? 'border-blue-500 dark:border-blue-400 shadow-lg dark:shadow-blue-900/20 bg-white dark:bg-gray-800'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
      }`}
    >
      <div className='text-center mb-6'>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
          {title}
        </h3>
      </div>

      <div className='text-center mb-6'>
        <div
          className={`text-3xl font-bold ${
            highlighted
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          <span className='text-sm align-top'>R$</span>
          {price}
        </div>
      </div>

      <ul className='space-y-3 mb-8'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-start'>
            <Check
              size={18}
              className={`mr-2 mt-0.5 flex-shrink-0 ${
                highlighted
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            />
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className='mt-auto text-center'>
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

      <div className='mt-6 flex justify-center'>
        <div
          className={`w-8 h-8 rounded-full border-2 ${
            highlighted
              ? 'border-blue-500 dark:border-blue-400'
              : 'border-gray-300 dark:border-gray-600'
          } flex items-center justify-center`}
        >
          <div
            className={`w-4 h-4 rounded-full ${
              highlighted
                ? 'bg-blue-500 dark:bg-blue-400'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          ></div>
        </div>
      </div>
    </div>
  )
}
