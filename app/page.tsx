'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedPricingCard from '@/components/animated-pricing-card'
import FeatureCard from '@/components/feature-card'
import TestimonialsSection from '@/components/testimonials-section'
import HowItWorks from '@/components/how-it-works'
import AnimatedSection from '@/components/animated-section'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className='min-h-screen'>
      <Header />

      {/* Hero Section */}
      <section className='relative w-full h-[500px] bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white'>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.svg')] bg-cover bg-center opacity-50" />
        <div className='relative z-10 flex flex-col items-center justify-center space-y-6'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='flex items-center gap-2 mb-2'
          >
            {/* <div className='w-10 h-10 border-2 border-white flex items-center justify-center'>
              <div className='w-6 h-6 border-2 border-white'></div>
            </div> */}
            <Image
              src='/images/logo-transparente.svg'
              alt='Logo Facilize'
              width={50}
              height={50}
              className='w-full h-auto object-cover'
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              className='bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Work Organization Section */}
      <AnimatedSection>
        <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center'>
          <div className='rounded-lg overflow-hidden'>
            <Image
              src='/images/business-person.png'
              alt='Profissional trabalhando'
              width={450}
              height={450}
              className='w-[450px] h-auto object-cover'
            />
          </div>
          <div>
            <h2 className='text-3xl font-bold mb-4'>
              SEU TRABALHO MAIS{' '}
              <span className='text-blue-600'>ORGANIZADO!</span>
            </h2>
            <p className='text-gray-600 mb-6'>
              A Facilize é a plataforma completa para profissionais autônomos e
              pequenas empresas que desejam organizar seu negócio de forma
              simples e eficiente. Com nossa solução, você pode emitir notas
              fiscais, gerenciar clientes, controlar agendamentos e muito mais,
              tudo em um único lugar.
            </p>
            <p className='text-gray-600 mb-6'>
              Desenvolvida pensando nas necessidades reais dos empreendedores
              brasileiros, nossa plataforma elimina a burocracia e permite que
              você foque no que realmente importa: fazer seu negócio crescer.
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Advantages Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <AnimatedSection>
            <h2 className='text-2xl font-bold text-center mb-12'>
              NOSSAS <span className='text-purple-600'>VANTAGENS</span>
            </h2>
          </AnimatedSection>

          <div className='grid md:grid-cols-3 gap-8'>
            <AnimatedSection delay={0.1}>
              <FeatureCard
                icon='receipt'
                title='Emissão de NOTA FISCAL para Pessoa Jurídica'
                color='blue'
                description='Emita notas fiscais eletrônicas de forma rápida e segura, em conformidade com a legislação. Sistema integrado com a Receita Federal para validação automática.'
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <FeatureCard
                icon='clock'
                title='Controle de agendamentos em TEMPO REAL!'
                color='purple'
                description='Gerencie sua agenda de forma eficiente com nosso sistema de agendamentos. Receba notificações, envie lembretes automáticos e evite conflitos de horários.'
              />
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <FeatureCard
                icon='message-circle'
                title='Chatbot integrado ao WHATSAPP'
                color='green'
                description='Automatize o atendimento ao cliente com nosso chatbot integrado ao WhatsApp. Responda perguntas frequentes, confirme agendamentos e mantenha seus clientes informados.'
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <AnimatedSection>
          <h2 className='text-2xl font-bold text-center mb-12'>
            NOSSOS <span className='text-purple-600'>PLANOS</span>
          </h2>
        </AnimatedSection>

        <div className='grid md:grid-cols-3 gap-8'>
          <AnimatedPricingCard
            title='PLANO BÁSICO'
            price='49,90'
            features={[
              'Emissão de notas fiscais (até 50/mês)',
              'Controle de clientes (até 100)',
              'Chatbot integrado ao WhatsApp',
            ]}
            buttonText='Contratar'
          />

          <AnimatedPricingCard
            title='PLANO PRO'
            price='69,90'
            features={[
              'Emissão de notas fiscais (até 200/mês)',
              'Controle de clientes ilimitado',
              'Chatbot integrado ao WhatsApp',
              'Relatórios avançados',
            ]}
            buttonText='Contratar'
            highlighted={true}
          />

          <AnimatedPricingCard
            title='PLANO PRO+'
            price='89,90'
            features={[
              'Emissão de notas fiscais ilimitadas',
              'Controle de clientes ilimitado',
              'Chatbot integrado ao WhatsApp',
              'Relatórios avançados',
              'Suporte prioritário',
            ]}
            buttonText='Contratar'
          />
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection>
        <section className='py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white'>
          <div className='max-w-4xl mx-auto px-4 md:px-8 text-center'>
            <h2 className='text-3xl font-bold mb-6'>
              Pronto para facilizar seu trabalho?
            </h2>
            <p className='text-xl mb-8 max-w-2xl mx-auto'>
              Junte-se a milhares de profissionais que já estão economizando
              tempo e organizando melhor seus negócios.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/signup'>
                <Button className='bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6'>
                  Começar agora
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
    </main>
  )
}

