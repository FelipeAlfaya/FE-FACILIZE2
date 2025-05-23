"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import { Book, Video, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/animated-section"

interface TutorialCardProps {
  title: string
  description: string
  image: string
  category: string
  time: string
  difficulty: "Iniciante" | "Intermediário" | "Avançado"
  link: string
}

function TutorialCard({ title, description, image, category, time, difficulty, link }: TutorialCardProps) {
  const difficultyColor = {
    Iniciante: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Intermediário: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Avançado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Link href={link}>
      <motion.div whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} className="h-full">
        <Card className="overflow-hidden h-full flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">{category}</div>
          </div>
          <CardContent className="p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{description}</p>
            <div className="flex justify-between items-center mt-auto">
              <div className="text-sm text-gray-500 dark:text-gray-400">{time}</div>
              <div className={`text-xs px-2 py-1 rounded ${difficultyColor[difficulty]}`}>{difficulty}</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

export default function Tutoriais() {
  const tutorials = [
    {
      title: "Emitindo sua primeira nota fiscal",
      description: "Aprenda o passo a passo para emitir uma nota fiscal eletrônica de serviço (NFS-e).",
      image: "/images/tutorial-invoice.jpg",
      category: "Notas Fiscais",
      time: "5 min",
      difficulty: "Iniciante" as const,
      link: "/tutoriais/emitindo-primeira-nota",
      tab: "notas",
    },
    {
      title: "Configurando agendamentos recorrentes",
      description: "Saiba como configurar agendamentos que se repetem semanalmente ou mensalmente.",
      image: "/images/tutorial-calendar.jpg",
      category: "Agendamentos",
      time: "7 min",
      difficulty: "Intermediário" as const,
      link: "/tutoriais/agendamentos-recorrentes",
      tab: "agendamentos",
    },
    {
      title: "Personalizando seu chatbot",
      description: "Aprenda a personalizar as mensagens e fluxos de conversa do seu chatbot WhatsApp.",
      image: "/images/tutorial-chatbot.jpg",
      category: "Chatbot",
      time: "10 min",
      difficulty: "Intermediário" as const,
      link: "/tutoriais/personalizando-chatbot",
      tab: "chatbot",
    },
    {
      title: "Cancelando uma nota fiscal",
      description: "Saiba como cancelar uma nota fiscal emitida incorretamente dentro do prazo legal.",
      image: "/images/tutorial-cancel-invoice.jpg",
      category: "Notas Fiscais",
      time: "3 min",
      difficulty: "Iniciante" as const,
      link: "/tutoriais/cancelando-nota-fiscal",
      tab: "notas",
    },
    {
      title: "Criando lembretes automáticos",
      description: "Configure lembretes automáticos para reduzir faltas e atrasos de clientes.",
      image: "/images/tutorial-reminders.jpg",
      category: "Agendamentos",
      time: "6 min",
      difficulty: "Iniciante" as const,
      link: "/tutoriais/lembretes-automaticos",
      tab: "agendamentos",
    },
    {
      title: "Integrando com WhatsApp Business",
      description: "Passo a passo para integrar o chatbot com sua conta WhatsApp Business.",
      image: "/images/tutorial-whatsapp.jpg",
      category: "Chatbot",
      time: "15 min",
      difficulty: "Avançado" as const,
      link: "/tutoriais/integracao-whatsapp-business",
      tab: "chatbot",
    },
    {
      title: "Gerando relatórios financeiros",
      description: "Aprenda a gerar e interpretar relatórios financeiros detalhados.",
      image: "/images/tutorial-reports.jpg",
      category: "Relatórios",
      time: "8 min",
      difficulty: "Intermediário" as const,
      link: "/tutoriais/relatorios-financeiros",
      tab: "relatorios",
    },
    {
      title: "Configurando perfil de usuário",
      description: "Personalize seu perfil e configure preferências de notificação.",
      image: "/images/tutorial-profile.jpg",
      category: "Geral",
      time: "4 min",
      difficulty: "Iniciante" as const,
      link: "/tutoriais/configurando-perfil",
      tab: "geral",
    },
    {
      title: "Exportando dados para Excel",
      description: "Saiba como exportar seus dados para planilhas Excel para análises avançadas.",
      image: "/images/tutorial-export.jpg",
      category: "Relatórios",
      time: "5 min",
      difficulty: "Intermediário" as const,
      link: "/tutoriais/exportando-excel",
      tab: "relatorios",
    },
  ]

  return (
    <ResourceLayout>
      <ResourceHero
        title="Tutoriais"
        description="Aprenda a utilizar todos os recursos da Facilize com nossos tutoriais passo a passo"
        icon={<Book size={40} className="text-white" />}
      />

      {/* Tutorials Section */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Nossos <span className="text-blue-600 dark:text-blue-400">Tutoriais</span>
            </h2>
            <div className="flex items-center mt-4 md:mt-0">
              <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Filtrar por:</span>
              <select className="text-sm border rounded-md py-1 px-3 bg-transparent">
                <option>Todos os níveis</option>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </div>
          </div>
        </AnimatedSection>

        <Tabs defaultValue="todos" className="w-full">
          <AnimatedSection>
            <TabsList className="mb-8 flex flex-wrap">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="notas" id="notas-fiscais">
                Notas Fiscais
              </TabsTrigger>
              <TabsTrigger value="agendamentos" id="agendamentos">
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="chatbot" id="chatbot">
                Chatbot
              </TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="videos" id="videos">
                Vídeos
              </TabsTrigger>
            </TabsList>
          </AnimatedSection>

          <TabsContent value="todos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <TutorialCard {...tutorial} />
                </AnimatedSection>
              ))}
            </div>
          </TabsContent>

          {["notas", "agendamentos", "chatbot", "relatorios", "geral"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials
                  .filter((tutorial) => tutorial.tab === tab)
                  .map((tutorial, index) => (
                    <AnimatedSection key={index} delay={index * 0.05}>
                      <TutorialCard {...tutorial} />
                    </AnimatedSection>
                  ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="videos">
            <div className="text-center py-12">
              <Video className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">Vídeos tutoriais em breve</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Estamos preparando vídeos tutoriais detalhados para ajudar você a aproveitar ao máximo a plataforma
                Facilize.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Video Tutorials Teaser */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Tutoriais em <span className="text-purple-600 dark:text-purple-400">Vídeo</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Aprenda visualmente com nossos tutoriais em vídeo. Assista às demonstrações passo a passo de como
                utilizar cada recurso da plataforma.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 aspect-video">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Vídeos tutoriais em breve</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Inscreva-se para ser notificado quando novos vídeos tutoriais forem lançados.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                Inscrever-se
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Need Help CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4">Precisa de mais ajuda?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Se você não encontrou o que procurava em nossos tutoriais, nossa equipe de suporte está pronta para
              ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Contatar suporte
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline">Ver perguntas frequentes</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </ResourceLayout>
  )
}
