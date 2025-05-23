'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Home,
  Search,
  Compass,
  Calendar,
  Settings,
  AlertCircle,
  FileText,
  MessageSquare,
  Coffee,
} from 'lucide-react'

// Lista de mensagens divertidas para mostrar aleatoriamente
const funnyMessages = [
  'Ops! Parece que você entrou em uma sala vazia.',
  'Esta página saiu para tomar um café. Volte mais tarde!',
  'Página em construção. Os desenvolvedores estão trabalhando duro!',
  'Hmm... não encontramos esta página no nosso mapa.',
  'Você achou um portal secreto! Infelizmente, ele não leva a lugar nenhum.',
]

// Lista de sugestões de páginas comuns do dashboard
const suggestions = [
  { name: 'Dashboard', icon: <Home className='h-4 w-4' />, path: '/dashboard' },
  {
    name: 'Agenda',
    icon: <Calendar className='h-4 w-4' />,
    path: '/dashboard/schedule',
  },
  {
    name: 'Serviços',
    icon: <FileText className='h-4 w-4' />,
    path: '/dashboard/services',
  },
  {
    name: 'Chatbot',
    icon: <MessageSquare className='h-4 w-4' />,
    path: '/dashboard/chatbot',
  },
  {
    name: 'Configurações',
    icon: <Settings className='h-4 w-4' />,
    path: '/dashboard/settings',
  },
]

export default function NotFound() {
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isExploring, setIsExploring] = useState(false)

  // Escolher uma mensagem aleatória ao carregar a página
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funnyMessages.length)
    setMessage(funnyMessages[randomIndex])
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mx-auto flex w-full max-w-2xl flex-col items-center text-center'
      >
        <motion.div
          className='relative mb-8'
          animate={{ rotate: [0, 5, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <div className='text-9xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent'>
            404
          </div>
          <motion.div
            className='absolute -right-8 -top-4'
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Coffee className='h-12 w-12 text-muted-foreground' />
          </motion.div>
        </motion.div>

        <h1 className='mt-6 text-3xl font-bold tracking-tight'>
          Página não encontrada
        </h1>

        <p className='mt-4 text-xl text-muted-foreground'>{message}</p>

        <div className='mt-6 p-4 bg-muted/40 rounded-lg border w-full max-w-md'>
          {!isExploring ? (
            <div className='flex flex-col space-y-4'>
              <p className='text-sm text-muted-foreground mb-2'>
                <AlertCircle className='inline mr-2 h-4 w-4' />
                Esta página pode estar em desenvolvimento ou ter sido movida.
              </p>

              <Button
                variant='outline'
                onClick={() => setIsExploring(true)}
                className='w-full'
              >
                <Compass className='mr-2 h-4 w-4' />
                Explorar páginas disponíveis
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex flex-col space-y-3'
            >
              <p className='font-medium mb-2'>Páginas populares:</p>
              <div className='grid grid-cols-2 gap-2'>
                {suggestions.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant='ghost'
                      className='w-full justify-start'
                      asChild
                    >
                      <Link href={item.path}>
                        {item.icon}
                        <span className='ml-2'>{item.name}</span>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
              <Button
                variant='link'
                onClick={() => setIsExploring(false)}
                size='sm'
              >
                Voltar
              </Button>
            </motion.div>
          )}
        </div>

        <div className='mt-8 grid w-full gap-2 max-w-md'>
          <Button asChild>
            <Link href='/dashboard'>
              <Home className='mr-2 h-4 w-4' />
              Voltar para o Dashboard
            </Link>
          </Button>

          <Button variant='outline' onClick={() => window.history.back()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para a página anterior
          </Button>
        </div>

        <div className='mt-8 w-full max-w-md'>
          <div className='flex items-center rounded-lg border bg-background px-3 py-2'>
            <Search className='mr-2 h-4 w-4 text-muted-foreground' />
            <input
              className='flex-1 bg-transparent outline-none text-sm'
              placeholder='O que você estava procurando?'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() !== '') {
                  // Implementar a lógica de busca aqui, ou redirecionar para uma página de busca
                  alert('Funcionalidade de busca em desenvolvimento!')
                }
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
