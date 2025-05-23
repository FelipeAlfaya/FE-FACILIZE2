'use client'
import Image from 'next/image'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { CheckCircle, Rocket, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Sobre() {
  const teamMembers = [
    {
      name: 'Pedro Henrique',
      role: 'CEO & Fundador',
      image: '/images/team-1.jpg',
    },
    {
      name: 'Felipe Alfaya',
      role: 'CTO & Fundador',
      image: '/images/FelipeAlfaya.jpeg',
    },
    {
      name: 'João Paulo',
      role: 'CMO & Fundador',
      image: '/images/team-3.jpg',
    },
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Idealização da Facilize',
      description:
        'Idealização, prototipação, modelagem das regras de negócio e criação de telas da Facilize.',
    },
    {
      year: '2025 - Fevereiro',
      title: 'Início do desenvolvimento',
      description: 'Início no desenvolvimento da versão BETA da plataforma.',
    },
    {
      year: '2025 - Junho',
      title: 'Lançamento oficial do Beta',
      description:
        'Lançamento oficial da versão beta da plataforma com funcionalidades limitadas a gerenciamento de agendamento para clientes e prestadores de serviço.',
    },
    {
      year: '2026',
      title: 'Plataforma Completa',
      description:
        'Redesenho completo da plataforma com foco em usabilidade e recursos avançados.',
    },
  ]

  const values = [
    {
      title: 'Simplicidade',
      description:
        'Acreditamos que a tecnologia deve simplificar, não complicar. Nossas soluções são intuitivas e fáceis de usar.',
      icon: <Sparkles className='h-8 w-8 text-blue-600' />,
      color: 'border-blue-500',
    },
    {
      title: 'Inovação',
      description:
        'Estamos constantemente buscando novas formas de melhorar nossos produtos e serviços.',
      icon: <Rocket className='h-8 w-8 text-purple-600' />,
      color: 'border-purple-500',
    },
    {
      title: 'Confiança',
      description:
        'Construímos relacionamentos duradouros baseados na confiança e na transparência.',
      icon: <Shield className='h-8 w-8 text-emerald-600' />,
      color: 'border-emerald-500',
    },
    {
      title: 'Excelência',
      description:
        'Buscamos a excelência em tudo o que fazemos, desde o atendimento até o desenvolvimento de produtos.',
      icon: <CheckCircle className='h-8 w-8 text-amber-600' />,
      color: 'border-amber-500',
    },
  ]

  return (
    <main className='min-h-screen'>
      <Header />

      {/* Hero Section */}
      <section className='relative w-full py-24 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white overflow-hidden'>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-[size:100px_100px] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='relative z-10 text-center px-4 max-w-4xl mx-auto'
        >
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            Sobre a Facilize
          </h1>
          <p className='text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto'>
            Transformando a gestão de negócios com soluções inovadoras desde
            2025
          </p>
        </motion.div>
      </section>

      {/* Company Overview */}
      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='grid md:grid-cols-2 gap-12 items-center'
        >
          <div>
            <h2 className='text-3xl font-bold mb-6'>
              Nossa <span className='text-blue-600'>História</span>
            </h2>
            <p className='text-gray-700 dark:text-gray-300 mb-4'>
              A Facilize foi fundada em 2024 por Pedro Henrique, Felipe Alfaya e
              João Paulo, com a missão de simplificar a gestão de negócios para
              microempreendedores individuais (MEIs), pequenas e grandes
              empresas. Inspirada pela crescente demanda por ferramentas
              digitais no Brasil, a plataforma começou como uma solução para
              facilitar a formalização e a gestão financeira, evoluindo para um
              aplicativo completo de produtividade com funcionalidades como
              emissão de notas fiscais, calculadoras financeiras e chatbots com
              IA.
            </p>
            <p className='text-gray-700 dark:text-gray-300 mb-4'>
              Observando os desafios enfrentados por empreendedores,
              especialmente os 13,2 milhões de MEIs brasileiros, os fundadores
              uniram suas expertises para criar uma ferramenta que reduzisse a
              burocracia e otimizasse processos administrativos. A Facilize foi
              projetada para atender desde autônomos até grandes empresas,
              oferecendo planos de assinatura que variam de R$ 49 a R$ 999 por
              mês, com soluções personalizadas para cada segmento.
            </p>
          </div>
          <div className='relative h-[400px] rounded-xl overflow-hidden shadow-lg'>
            <Image
              src='/images/office.png'
              alt='Escritório da Facilize'
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 50vw'
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className='py-16 bg-gray-50 dark:bg-slate-900'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold mb-4 '>
              Nossos <span className='text-blue-600'>Valores</span>
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Princípios que guiam tudo o que fazemos na Facilize
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full border-t-4 ${value.color} hover:shadow-md transition-shadow`}
                >
                  <CardContent className='p-6'>
                    <div className='mb-4'>{value.icon}</div>
                    <h3 className='text-xl font-bold mb-3'>{value.title}</h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='text-center mb-12'
        >
          <h2 className='text-3xl font-bold mb-4 dark:text-white'>
            Nossa <span className='text-blue-600'>Equipe</span>
          </h2>
          <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Conheça os fundadores que estão transformando a gestão empresarial
            no Brasil
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='text-center'
            >
              <div className='relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg'>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 25vw'
                />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                {member.name}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className='py-16 bg-gray-50 dark:bg-slate-900/50'>
        <div className='max-w-4xl mx-auto px-4 md:px-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold mb-4'>
              Nossa <span className='text-blue-600'>Trajetória</span>
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Marcos importantes na história da Facilize
            </p>
          </motion.div>

          <div className='space-y-8 relative'>
            {/* Timeline line */}
            <div className='absolute left-4 md:left-1/2 h-full w-1 bg-blue-200 dark:bg-blue-900/50 transform -translate-x-1/2'></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-start`}
              >
                <div className='md:w-1/2 mb-4 md:mb-0 md:px-8'>
                  <div className='bg-blue-600 text-white text-lg font-bold py-2 px-4 rounded-lg inline-block shadow-md'>
                    {milestone.year}
                  </div>
                </div>
                <div className='md:w-1/2 md:px-8'>
                  <Card className='shadow-sm'>
                    <CardContent className='p-6'>
                      <h3 className='text-xl font-bold mb-2'>
                        {milestone.title}
                      </h3>
                      <p className='text-gray-600 dark:text-gray-300'>
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='max-w-4xl mx-auto px-4 md:px-8 text-center'
        >
          <h2 className='text-3xl font-bold mb-6'>
            Pronto para facilizar seu trabalho?
          </h2>
          <p className='text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto'>
            Junte-se a milhares de profissionais que já estão economizando tempo
            e organizando melhor seus negócios.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/signup'>
              <Button
                className='bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-100 px-8 py-4 text-lg'
                size='lg'
              >
                Começar agora
              </Button>
            </Link>
            <Button
              variant='outline'
              className='border-white text-blue-600 hover:bg-blue-700 hover:text-white px-8 py-4 text-lg dark:text-white'
              size='lg'
            >
              Ver planos
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

