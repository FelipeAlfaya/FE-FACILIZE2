import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react'
import Footer from '@/components/footer'

export default function Contato() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <Header />

      {/* Hero Section */}
      <section className='relative w-full h-[300px] bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white'>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.png')] bg-cover bg-center opacity-30" />
        <div className='relative z-10 text-center px-4'>
          <h1 className='text-4xl font-bold mb-4'>Entre em Contato</h1>
          <p className='max-w-2xl mx-auto text-lg'>
            Estamos aqui para ajudar. Entre em contato conosco para tirar
            dúvidas ou solicitar uma demonstração.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div>
            <h2 className='text-2xl font-bold mb-6'>
              Envie uma <span className='text-blue-600'>Mensagem</span>
            </h2>
            <form className='space-y-6'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='text-sm font-medium'>
                    Nome completo
                  </label>
                  <Input id='name' placeholder='Seu nome' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium'>
                    Email
                  </label>
                  <Input id='email' type='email' placeholder='seu@email.com' />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='subject' className='text-sm font-medium'>
                  Assunto
                </label>
                <Input id='subject' placeholder='Assunto da mensagem' />
              </div>

              <div className='space-y-2'>
                <label htmlFor='message' className='text-sm font-medium'>
                  Mensagem
                </label>
                <Textarea id='message' placeholder='Sua mensagem' rows={6} />
              </div>

              <Button className='bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-8'>
                Enviar mensagem
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold mb-6'>
                Informações de <span className='text-blue-600'>Contato</span>
              </h2>
              <p className='text-gray-600 mb-8'>
                Prefere entrar em contato diretamente? Utilize um dos canais
                abaixo ou visite nosso escritório em São Paulo. Nossa equipe de
                suporte está disponível de segunda a sexta, das 8h às 18h.
              </p>
            </div>

            <div className='grid gap-6'>
              <Card>
                <CardContent className='flex items-start gap-4 p-6'>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <MapPin className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-bold mb-1'>Endereço</h3>
                    <p className='text-gray-600'>
                      Av. Paulista, 1000 - Bela Vista
                    </p>
                    <p className='text-gray-600'>
                      São Paulista, 1000 - Bela Vista
                    </p>
                    <p className='text-gray-600'>São Paulo - SP, 01310-100</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='flex items-start gap-4 p-6'>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <Mail className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-bold mb-1'>Email</h3>
                    <p className='text-gray-600'>contato@facilize.com.br</p>
                    <p className='text-gray-600'>suporte@facilize.com.br</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='flex items-start gap-4 p-6'>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <Phone className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-bold mb-1'>Telefone</h3>
                    <p className='text-gray-600'>(11) 3456-7890</p>
                    <p className='text-gray-600'>(11) 98765-4321 (WhatsApp)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className='font-bold mb-4'>Redes Sociais</h3>
              <div className='flex gap-4'>
                <a
                  href='#'
                  className='bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors'
                  aria-label='Facebook'
                >
                  <Facebook className='h-5 w-5 text-blue-600' />
                </a>
                <a
                  href='#'
                  className='bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors'
                  aria-label='Instagram'
                >
                  <Instagram className='h-5 w-5 text-blue-600' />
                </a>
                <a
                  href='#'
                  className='bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors'
                  aria-label='LinkedIn'
                >
                  <Linkedin className='h-5 w-5 text-blue-600' />
                </a>
                <a
                  href='#'
                  className='bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors'
                  aria-label='Twitter'
                >
                  <Twitter className='h-5 w-5 text-blue-600' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Nossa <span className='text-blue-600'>Localização</span>
          </h2>
          <div className='h-[400px] bg-gray-200 rounded-lg overflow-hidden relative'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center'>
                <MapPin className='h-12 w-12 text-blue-600 mx-auto mb-2' />
                <p className='text-gray-600'>
                  Mapa interativo seria exibido aqui
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-4 md:px-8'>
          <h2 className='text-2xl font-bold text-center mb-12'>
            Perguntas <span className='text-purple-600'>Frequentes</span>
          </h2>

          <div className='space-y-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-bold mb-2'>
                  Como posso começar a usar a Facilize?
                </h3>
                <p className='text-gray-600'>
                  Basta criar uma conta gratuita em nosso site e escolher o
                  plano que melhor atende às suas necessidades. Você pode
                  começar com o plano básico e fazer upgrade conforme seu
                  negócio cresce. Oferecemos um período de teste gratuito de 14
                  dias para todos os planos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-bold mb-2'>
                  A Facilize emite notas fiscais válidas?
                </h3>
                <p className='text-gray-600'>
                  Sim, todas as notas fiscais emitidas pela Facilize são válidas
                  e estão em conformidade com a legislação brasileira. Nosso
                  sistema está integrado com os sistemas da Receita Federal e
                  secretarias estaduais e municipais para garantir a validade de
                  todos os documentos fiscais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-bold mb-2'>
                  Posso cancelar minha assinatura a qualquer momento?
                </h3>
                <p className='text-gray-600'>
                  Sim, você pode cancelar sua assinatura a qualquer momento sem
                  taxas adicionais. Seus dados ficarão disponíveis por 30 dias
                  após o cancelamento, permitindo que você exporte todas as suas
                  informações caso decida retornar no futuro.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-bold mb-2'>
                  Como funciona o suporte técnico?
                </h3>
                <p className='text-gray-600'>
                  Oferecemos suporte por email, chat e telefone em horário
                  comercial para todos os planos. Os planos Pro e Pro+ contam
                  com suporte prioritário e atendimento estendido. Nossa equipe
                  de especialistas está pronta para ajudar com qualquer dúvida
                  técnica ou operacional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white'>
        <div className='max-w-4xl mx-auto px-4 md:px-8 text-center'>
          <h2 className='text-2xl font-bold mb-4'>Ainda tem dúvidas?</h2>
          <p className='text-lg mb-6'>
            Nossa equipe está pronta para ajudar. Agende uma demonstração
            gratuita e descubra como a Facilize pode transformar seu negócio.
          </p>
          <Button className='bg-white text-blue-600 hover:bg-blue-50'>
            Agendar demonstração
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}

