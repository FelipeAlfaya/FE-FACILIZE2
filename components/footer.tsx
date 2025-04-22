import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Logo from '@/components/logo'
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
} from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-200 dark:bg-slate-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Newsletter Section */}
        <div className='py-12 border-b border-gray-800'>
          <div className='grid md:grid-cols-2 gap-8 items-center'>
            <div>
              <h3 className='text-2xl font-bold mb-2'>
                Fique por dentro das novidades
              </h3>
              <p className='text-gray-400'>
                Assine nossa newsletter e receba dicas, novidades e ofertas
                exclusivas.
              </p>
            </div>
            <div>
              <form className='flex gap-2 max-w-md ml-auto'>
                <div className='relative flex-1 group'>
                  <Input
                    type='email'
                    placeholder='Seu melhor email'
                    className='bg-gray-800 border-gray-700 text-white pr-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-gray-500'
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300'>
                    <ArrowRight size={18} className='text-blue-400' />
                  </div>
                </div>
                <Button className='bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105'>
                  Assinar
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className='py-12 grid md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/logo-transparente.svg'
                alt='Logo Facilize'
                width={50}
                height={50}
                className='w-[130px] h-auto object-cover'
              />
            </div>
            <p className='text-gray-400 text-sm'>
              Simplificando a gestão de negócios para empreendedores e
              profissionais autônomos desde 2018.
            </p>
            <div className='flex gap-4 pt-2'>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                aria-label='Facebook'
              >
                <Facebook size={18} />
              </a>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                aria-label='Instagram'
              >
                <Instagram size={18} />
              </a>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                aria-label='LinkedIn'
              >
                <Linkedin size={18} />
              </a>
              <a
                href='#'
                className='bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300'
                aria-label='Twitter'
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className='font-bold text-lg mb-4'>Empresa</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/sobre'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href='/planos'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  href='/contato'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/carreiras'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-lg mb-4'>Recursos</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/recursos/notas-fiscais'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Notas Fiscais
                </Link>
              </li>
              <li>
                <Link
                  href='/recursos/agendamentos'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Agendamentos
                </Link>
              </li>
              <li>
                <Link
                  href='/recursos/chatbot'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Chatbot WhatsApp
                </Link>
              </li>
              <li>
                <Link
                  href='/recursos/relatorios'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Relatórios
                </Link>
              </li>
              <li>
                <Link
                  href='/recursos/integracao'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Integrações
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-lg mb-4'>Suporte</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/ajuda'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href='/tutoriais'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Tutoriais
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  href='/status'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Status do Sistema
                </Link>
              </li>
              <li>
                <Link
                  href='/contato'
                  className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block'
                >
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className='py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='text-sm text-gray-400'>
            &copy; {new Date().getFullYear()} Facilize. Todos os direitos
            reservados.
          </div>
          <div className='flex gap-6 text-sm'>
            <Link
              href='/termos'
              className='text-gray-400 hover:text-white transition-colors duration-300'
            >
              Termos de Uso
            </Link>
            <Link
              href='/privacidade'
              className='text-gray-400 hover:text-white transition-colors duration-300'
            >
              Política de Privacidade
            </Link>
            <Link
              href='/cookies'
              className='text-gray-400 hover:text-white transition-colors duration-300'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
