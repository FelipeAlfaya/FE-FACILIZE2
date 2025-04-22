'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, MessageSquare, BarChart } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileText className='h-8 w-8 text-blue-600' />,
      title: 'Emita notas fiscais',
      description:
        'Gere notas fiscais em segundos, em conformidade com a legislação brasileira.',
    },
    {
      icon: <Calendar className='h-8 w-8 text-purple-600' />,
      title: 'Gerencie agendamentos',
      description:
        'Organize sua agenda e envie lembretes automáticos para seus clientes.',
    },
    {
      icon: <MessageSquare className='h-8 w-8 text-green-600' />,
      title: 'Automatize atendimento',
      description:
        'Use nosso chatbot integrado ao WhatsApp para responder perguntas frequentes.',
    },
    {
      icon: <BarChart className='h-8 w-8 text-orange-600' />,
      title: 'Analise resultados',
      description:
        'Acompanhe o desempenho do seu negócio com relatórios detalhados.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4 md:px-8'>
        <div className='text-center mb-12'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-3xl font-bold'
          >
            Como a <span className='text-blue-600'>Facilize</span> funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-gray-600 mt-4 max-w-2xl mx-auto'
          >
            Uma plataforma completa para simplificar a gestão do seu negócio em
            apenas 4 passos
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
          className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='relative'
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className='bg-white rounded-lg p-6 shadow-lg border border-gray-100 h-full'>
                <div className='bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto'>
                  {step.icon}
                </div>
                <h3 className='text-xl font-bold text-center mb-2'>
                  {step.title}
                </h3>
                <p className='text-gray-600 text-center'>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className='hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10'>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className='h-0.5 w-8 bg-blue-200'
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
