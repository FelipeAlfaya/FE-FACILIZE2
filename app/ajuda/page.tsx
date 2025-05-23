'use client'

import ResourceLayout from '@/components/resource-layout'
import ResourceHero from '@/components/resource-hero'
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Video,
  FileText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/animated-section'

export default function Ajuda() {
  const helpCategories = [
    {
      icon: <FileText className='h-8 w-8 text-blue-600 dark:text-blue-400' />,
      title: 'Notas Fiscais',
      description: 'Aprenda a emitir e gerenciar notas fiscais eletrônicas',
      link: '/tutoriais#notas-fiscais',
    },
    {
      icon: <Book className='h-8 w-8 text-purple-600 dark:text-purple-400' />,
      title: 'Agendamentos',
      description: 'Gerencie sua agenda e configure lembretes automáticos',
      link: '/tutoriais#agendamentos',
    },
    {
      icon: (
        <MessageSquare className='h-8 w-8 text-green-600 dark:text-green-400' />
      ),
      title: 'Chatbot WhatsApp',
      description: 'Configure e personalize seu chatbot para WhatsApp',
      link: '/tutoriais#chatbot',
    },
    {
      icon: <Video className='h-8 w-8 text-red-600 dark:text-red-400' />,
      title: 'Vídeos Tutoriais',
      description:
        'Assista a vídeos explicativos sobre todas as funcionalidades',
      link: '/tutoriais#videos',
    },
  ]

  const popularQuestions = [
    {
      question: 'Como emitir minha primeira nota fiscal?',
      link: '/faq#emissao-nota',
    },
    {
      question: 'Como configurar lembretes automáticos para clientes?',
      link: '/faq#lembretes',
    },
    {
      question: 'Como integrar o chatbot ao meu WhatsApp Business?',
      link: '/faq#integracao-whatsapp',
    },
    {
      question: 'Como cancelar uma nota fiscal emitida incorretamente?',
      link: '/faq#cancelar-nota',
    },
    {
      question: 'Como exportar relatórios financeiros?',
      link: '/faq#exportar-relatorios',
    },
  ]

  return (
    <ResourceLayout>
      <ResourceHero
        title='Central de Ajuda'
        description='Encontre respostas para suas dúvidas e aprenda a utilizar todos os recursos da Facilize'
        icon={<HelpCircle size={40} className='text-white' />}
      />

      {/* Search Section */}
      <section className='py-12 px-4 md:px-8 max-w-4xl mx-auto'>
        <AnimatedSection>
          <div className='relative'>
            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <Input
              type='text'
              placeholder='Buscar na central de ajuda...'
              className='pl-10 py-6 text-lg rounded-lg shadow-sm'
            />
            <div className='absolute inset-y-0 right-2 flex items-center'>
              <Button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
                Buscar
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Help Categories */}
      <section className='py-12 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <AnimatedSection>
            <h2 className='text-2xl font-bold text-center mb-12'>
              Categorias de{' '}
              <span className='text-blue-600 dark:text-blue-400'>Ajuda</span>
            </h2>
          </AnimatedSection>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {helpCategories.map((category, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Link href={category.link}>
                  <motion.div
                    whileHover={{
                      y: -5,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                    className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center text-center'
                  >
                    <div className='bg-gray-50 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mb-4'>
                      {category.icon}
                    </div>
                    <h3 className='text-xl font-bold mb-2'>{category.title}</h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      {category.description}
                    </p>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className='py-12 px-4 md:px-8 max-w-4xl mx-auto'>
        <AnimatedSection>
          <h2 className='text-2xl font-bold mb-8'>
            Perguntas{' '}
            <span className='text-purple-600 dark:text-purple-400'>
              Frequentes
            </span>
          </h2>
        </AnimatedSection>

        <div className='space-y-4'>
          {popularQuestions.map((item, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <Link href={item.link}>
                <Card className='overflow-hidden'>
                  <CardContent className='p-0'>
                    <motion.div
                      className='p-4 flex items-center justify-between'
                      whileHover={{
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      }}
                    >
                      <div className='flex items-center'>
                        <div className='bg-blue-100 dark:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-4'>
                          <HelpCircle className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <span>{item.question}</span>
                      </div>
                      <div className='text-blue-600 dark:text-blue-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-5 w-5'
                        >
                          <path d='m9 18 6-6-6-6' />
                        </svg>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className='mt-8 text-center'>
            <Link href='/faq'>
              <Button variant='outline' className='mt-4'>
                Ver todas as perguntas frequentes
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Contact Support */}
      <section className='py-12 bg-blue-50 dark:bg-blue-900/20'>
        <div className='max-w-4xl mx-auto px-4 md:px-8 text-center'>
          <AnimatedSection>
            <h2 className='text-2xl font-bold mb-4'>
              Não encontrou o que procurava?
            </h2>
            <p className='text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300'>
              Nossa equipe de suporte está pronta para ajudar você com qualquer
              dúvida ou problema que possa ter.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/contato'>
                <Button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
                  Contatar suporte
                </Button>
              </Link>
              <Link href='/tutoriais'>
                <Button variant='outline'>Ver tutoriais</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </ResourceLayout>
  )
}
