import Image from 'next/image'
import Header from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'

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

  return (
    <main className='min-h-screen bg-gray-50'>
      <Header />

      {/* Hero Section */}
      <section className='relative w-full h-[300px] bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white'>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.png')] bg-cover bg-center opacity-30" />
        <div className='relative z-10 text-center px-4'>
          <h1 className='text-4xl font-bold mb-4'>Sobre a Facilize</h1>
          <p className='max-w-2xl mx-auto text-lg'>
            Transformando a gestão de negócios com soluções inovadoras desde
            2018
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl font-bold mb-6'>
              Nossa <span className='text-blue-600'>História</span>
            </h2>
            <p className='text-gray-700 mb-4'>
              A Facilize nasceu da necessidade de simplificar a gestão de
              negócios para empreendedores e profissionais autônomos. Fundada em
              2018 por Ana Silva, nossa empresa começou com uma simples
              ferramenta de emissão de notas fiscais e evoluiu para uma
              plataforma completa de gestão empresarial.
            </p>
            <p className='text-gray-700 mb-4'>
              Após anos trabalhando como consultora para pequenas empresas, Ana
              identificou que muitos empreendedores perdiam tempo precioso com
              tarefas administrativas e burocráticas. Foi então que ela reuniu
              uma equipe de desenvolvedores para criar uma solução que
              simplificasse esses processos.
            </p>
            <p className='text-gray-700'>
              Hoje, atendemos mais de 10.000 clientes em todo o Brasil,
              ajudando-os a organizar seus negócios, aumentar a produtividade e
              focar no que realmente importa: o crescimento de suas empresas.
            </p>
          </div>
          <div className='relative h-[400px] rounded-lg overflow-hidden shadow-lg'>
            <Image
              src='/images/office.jpg'
              alt='Escritório da Facilize'
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Nossos <span className='text-purple-600'>Valores</span>
          </h2>

          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='border-t-4 border-t-blue-500'>
              <CardContent className='pt-6'>
                <h3 className='text-xl font-bold mb-3'>Simplicidade</h3>
                <p className='text-gray-600'>
                  Acreditamos que a tecnologia deve simplificar, não complicar.
                  Nossas soluções são intuitivas e fáceis de usar, permitindo
                  que nossos clientes foquem no que realmente importa: o
                  crescimento de seus negócios.
                </p>
              </CardContent>
            </Card>

            <Card className='border-t-4 border-t-purple-500'>
              <CardContent className='pt-6'>
                <h3 className='text-xl font-bold mb-3'>Inovação</h3>
                <p className='text-gray-600'>
                  Estamos constantemente buscando novas formas de melhorar
                  nossos produtos e serviços. Investimos em pesquisa e
                  desenvolvimento para criar soluções que antecipam as
                  necessidades do mercado e oferecem vantagens competitivas aos
                  nossos clientes.
                </p>
              </CardContent>
            </Card>

            <Card className='border-t-4 border-t-green-500'>
              <CardContent className='pt-6'>
                <h3 className='text-xl font-bold mb-3'>Confiança</h3>
                <p className='text-gray-600'>
                  Construímos relacionamentos duradouros baseados na confiança e
                  na transparência. Nossos clientes podem contar conosco para
                  fornecer soluções confiáveis, seguras e em conformidade com a
                  legislação brasileira.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16 px-4 md:px-8 max-w-7xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-12'>
          Nossa <span className='text-blue-600'>Equipe</span>
        </h2>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {teamMembers.map((member, index) => (
            <div key={index} className='text-center'>
              <div className='relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                <Image
                  src={member.image || '/placeholder.svg'}
                  alt={member.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 25vw'
                />
              </div>
              <h3 className='text-xl font-bold'>{member.name}</h3>
              <p className='text-gray-600'>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className='py-16 bg-gray-100'>
        <div className='max-w-4xl mx-auto px-4 md:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Nossa <span className='text-purple-600'>Trajetória</span>
          </h2>

          <div className='space-y-12'>
            <div className='flex flex-col md:flex-row'>
              <div className='md:w-1/3'>
                <div className='bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg inline-block'>
                  2018
                </div>
              </div>
              <div className='md:w-2/3 mt-4 md:mt-0'>
                <h3 className='text-xl font-bold mb-2'>Fundação da Facilize</h3>
                <p className='text-gray-600'>
                  Lançamento da primeira versão do sistema de emissão de notas
                  fiscais para profissionais autônomos, com foco em facilitar o
                  cumprimento das obrigações fiscais.
                </p>
              </div>
            </div>

            <div className='flex flex-col md:flex-row'>
              <div className='md:w-1/3'>
                <div className='bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg inline-block'>
                  2019
                </div>
              </div>
              <div className='md:w-2/3 mt-4 md:mt-0'>
                <h3 className='text-xl font-bold mb-2'>Expansão de Serviços</h3>
                <p className='text-gray-600'>
                  Adição de recursos de agendamento e gerenciamento de clientes
                  à plataforma. Alcançamos a marca de 1.000 usuários ativos e
                  expandimos nossa equipe de suporte.
                </p>
              </div>
            </div>

            <div className='flex flex-col md:flex-row'>
              <div className='md:w-1/3'>
                <div className='bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg inline-block'>
                  2021
                </div>
              </div>
              <div className='md:w-2/3 mt-4 md:mt-0'>
                <h3 className='text-xl font-bold mb-2'>
                  Integração com WhatsApp
                </h3>
                <p className='text-gray-600'>
                  Lançamento do chatbot integrado ao WhatsApp para melhorar a
                  comunicação com clientes. Implementação de recursos de
                  automação de marketing e sistema de lembretes.
                </p>
              </div>
            </div>

            <div className='flex flex-col md:flex-row'>
              <div className='md:w-1/3'>
                <div className='bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded-lg inline-block'>
                  2023
                </div>
              </div>
              <div className='md:w-2/3 mt-4 md:mt-0'>
                <h3 className='text-xl font-bold mb-2'>Plataforma Completa</h3>
                <p className='text-gray-600'>
                  Redesenho completo da plataforma com foco em usabilidade e
                  adição de recursos avançados de relatórios e análises.
                  Ultrapassamos a marca de 10.000 usuários e expandimos para
                  toda América Latina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white'>
        <div className='max-w-4xl mx-auto px-4 md:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-6'>
            Pronto para facilizar seu trabalho?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Junte-se a milhares de profissionais que já estão economizando tempo
            e organizando melhor seus negócios com a Facilize.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6'>
              Começar agora
            </Button>
            <Button
              variant='outline'
              className='border-white text-white hover:bg-blue-700 text-lg px-8 py-6'
            >
              Ver planos
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

