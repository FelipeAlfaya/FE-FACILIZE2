'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  HelpCircle,
  CheckCircle,
} from 'lucide-react'
import Footer from '@/components/footer'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de envio do formulário
    console.log('Formulário enviado:', formData)
  }

  const faqs = [
    {
      question: 'Como posso começar a usar a Facilize?',
      answer:
        'Basta criar uma conta gratuita em nosso site e escolher o plano que melhor atende às suas necessidades. Oferecemos um período de teste gratuito de 14 dias para todos os planos.',
      icon: <CheckCircle className='h-5 w-5 text-emerald-500' />,
    },
    {
      question: 'A Facilize emite notas fiscais válidas?',
      answer:
        'Sim, todas as notas fiscais emitidas pela Facilize são válidas e estão em conformidade com a legislação brasileira. Nosso sistema está integrado com os sistemas da Receita Federal.',
      icon: <HelpCircle className='h-5 w-5 text-blue-500' />,
    },
    {
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer:
        'Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Seus dados ficarão disponíveis por 30 dias após o cancelamento.',
      icon: <MessageCircle className='h-5 w-5 text-purple-500' />,
    },
    {
      question: 'Como funciona o suporte técnico?',
      answer:
        'Oferecemos suporte por email, chat e telefone em horário comercial para todos os planos. Os planos Pro e Pro+ contam com suporte prioritário e atendimento estendido.',
      icon: <Clock className='h-5 w-5 text-amber-500' />,
    },
  ]

  const contactItems = [
    {
      icon: <MapPin className='h-6 w-6 text-blue-600' />,
      title: 'Endereço',
      items: ['Av. Paulista, 1000 - Bela Vista', 'São Paulo - SP, 01310-100'],
      bgColor: 'bg-blue-50',
    },
    {
      icon: <Mail className='h-6 w-6 text-blue-600' />,
      title: 'Email',
      items: ['contato@facilize.com.br', 'suporte@facilize.com.br'],
      bgColor: 'bg-blue-50',
    },
    {
      icon: <Phone className='h-6 w-6 text-blue-600' />,
      title: 'Telefone',
      items: ['(11) 3456-7890', '(11) 98765-4321 (WhatsApp)'],
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
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
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>Fale conosco</h1>
          <p className='text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto'>
            Estamos aqui para ajudar. Entre em contato para tirar dúvidas ou
            solicitar uma demonstração.
          </p>
        </motion.div>
      </section>

      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='grid lg:grid-cols-2 gap-12'
        >
          <div>
            <Card className='border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-2xl'>
                  Envie uma <span className='text-blue-600'>mensagem</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label htmlFor='name' className='text-sm font-medium'>
                        Nome completo
                      </label>
                      <Input
                        id='name'
                        placeholder='Seu nome'
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <label htmlFor='email' className='text-sm font-medium'>
                        Email
                      </label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='seu@email.com'
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='subject' className='text-sm font-medium'>
                      Assunto
                    </label>
                    <Input
                      id='subject'
                      placeholder='Assunto da mensagem'
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='message' className='text-sm font-medium'>
                      Mensagem
                    </label>
                    <Textarea
                      id='message'
                      placeholder='Sua mensagem'
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type='submit'
                    className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 w-full md:w-auto px-8'
                  >
                    Enviar mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold mb-6'>
                Informações de <span className='text-blue-600'>contato</span>
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-8'>
                Nossa equipe está disponível de segunda a sexta, das 8h às 18h,
                para ajudar com qualquer dúvida ou solicitação.
              </p>
            </div>

            <div className='grid gap-4'>
              {contactItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className='hover:shadow-md transition-shadow'>
                    <CardContent className='flex items-start gap-4 p-6'>
                      <div className={`${item.bgColor} p-3 rounded-full`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className='font-bold mb-2'>{item.title}</h3>
                        {item.items.map((text, i) => (
                          <p
                            key={i}
                            className='text-gray-600 dark:text-gray-300'
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className='pt-4'>
              <h3 className='font-bold mb-4'>Horário de atendimento</h3>
              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-4'>
                    <Clock className='h-6 w-6 text-blue-600' />
                    <div>
                      <p className='text-gray-600 dark:text-gray-300'>
                        Segunda a Sexta: 8h - 18h
                      </p>
                      <p className='text-gray-600 dark:text-gray-300'>
                        Sábado: 9h - 12h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 bg-gray-100 dark:bg-gray-800'>
        <div className='max-w-4xl mx-auto px-4 md:px-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold mb-4'>
              Perguntas <span className='text-blue-600'>frequentes</span>
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Confira as dúvidas mais comuns sobre nossos produtos e serviços.
            </p>
          </motion.div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className='hover:shadow-md transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex gap-4'>
                      <div className='mt-1'>{faq.icon}</div>
                      <div>
                        <h3 className='text-lg font-bold mb-2'>
                          {faq.question}
                        </h3>
                        <p className='text-gray-600 dark:text-gray-300'>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          <h2 className='text-2xl md:text-3xl font-bold mb-4'>
            Pronto para transformar seu negócio?
          </h2>
          <p className='text-lg text-blue-100 dark:text-blue-200 mb-6 max-w-2xl mx-auto'>
            Agende uma demonstração gratuita e descubra como a Facilize pode
            simplificar sua gestão.
          </p>
          <Button
            className='bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-100 px-8 py-4 text-lg'
            size='lg'
          >
            Agendar demonstração
          </Button>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
