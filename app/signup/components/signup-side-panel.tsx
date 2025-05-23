import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SignupSidePanel() {
  return (
    <motion.div
      className='hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-teal-700 dark:from-blue-800 dark:to-teal-900 rounded-xl p-10 text-white h-full'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Image
        src='/images/logo-transparente.svg'
        alt='Logo Facilize'
        width={200}
        height={200}
        className='w-[180px] h-auto object-cover mx-auto mb-8'
        priority
      />
      <h2 className='text-2xl md:text-3xl font-bold text-center mb-6'>
        Simplifique a gestão do seu negócio
      </h2>
      <motion.ul className='space-y-4 text-left max-w-md'>
        {[
          'Emita notas fiscais em segundos',
          'Gerencie seus clientes em um só lugar',
          'Automatize agendamentos e lembretes',
          'Acesse relatórios detalhados do seu negócio',
        ].map((item, index) => (
          <motion.li key={index} className='flex items-start'>
            <svg
              className='mr-3 h-6 w-6 flex-shrink-0 text-blue-300'
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
            <span className='text-lg'>{item}</span>
          </motion.li>
        ))}
      </motion.ul>
      <p className='mt-8 text-sm opacity-90 text-center'>
        Mais de 10.000 profissionais já confiam na Facilize para gerenciar seus
        negócios
      </p>
    </motion.div>
  )
}
