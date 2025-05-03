"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import { BookOpen, Search, Tag, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/animated-section"

interface BlogPostCardProps {
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  author: string
  authorImage?: string
  slug: string
  featured?: boolean
}

function BlogPostCard({
  title,
  excerpt,
  image,
  category,
  date,
  author,
  authorImage,
  slug,
  featured = false,
}: BlogPostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        className={`h-full ${featured ? "md:col-span-2" : ""}`}
      >
        <Card className="overflow-hidden h-full flex flex-col">
          <div className={`relative ${featured ? "h-64 md:h-80" : "h-48"} w-full`}>
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">{category}</div>
          </div>
          <CardContent className="p-5 flex flex-col flex-grow">
            <h3 className={`${featured ? "text-2xl" : "text-xl"} font-bold mb-2`}>{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{excerpt}</p>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={authorImage || "/images/avatar.jpg"}
                    alt={author}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{author}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{date}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

export default function Blog() {
  const featuredPost = {
    title: "Como a automação pode aumentar a produtividade do seu negócio",
    excerpt:
      "Descubra como a automação de processos pode ajudar a reduzir custos, aumentar a eficiência e melhorar a experiência dos seus clientes.",
    image: "/images/blog-automation.jpg",
    category: "Produtividade",
    date: "12 de abril de 2023",
    author: "Ana Silva",
    authorImage: "/images/team-1.jpg",
    slug: "como-automacao-pode-aumentar-produtividade",
    featured: true,
  }

  const blogPosts = [
    {
      title: "5 dicas para emitir notas fiscais sem dor de cabeça",
      excerpt: "Aprenda como simplificar o processo de emissão de notas fiscais e evitar problemas com o fisco.",
      image: "/images/blog-invoice.jpg",
      category: "Notas Fiscais",
      date: "5 de abril de 2023",
      author: "Carlos Mendes",
      authorImage: "/images/team-2.jpg",
      slug: "5-dicas-para-emitir-notas-fiscais",
      tab: "fiscal",
    },
    {
      title: "Como reduzir faltas de clientes com lembretes automáticos",
      excerpt: "Estratégias eficientes para reduzir o número de faltas e cancelamentos de última hora.",
      image: "/images/blog-reminders.jpg",
      category: "Agendamentos",
      date: "28 de março de 2023",
      author: "Juliana Costa",
      authorImage: "/images/team-3.jpg",
      slug: "como-reduzir-faltas-clientes-lembretes",
      tab: "agendamentos",
    },
    {
      title: "Chatbots: o futuro do atendimento ao cliente",
      excerpt: "Como os chatbots estão revolucionando o atendimento ao cliente e como implementá-los no seu negócio.",
      image: "/images/blog-chatbot.jpg",
      category: "Chatbot",
      date: "15 de março de 2023",
      author: "Roberto Alves",
      authorImage: "/images/team-4.jpg",
      slug: "chatbots-futuro-atendimento-cliente",
      tab: "chatbot",
    },
    {
      title: "Entendendo as obrigações fiscais do MEI em 2023",
      excerpt: "Um guia completo sobre as obrigações fiscais do Microempreendedor Individual para o ano de 2023.",
      image: "/images/blog-mei.jpg",
      category: "Fiscal",
      date: "8 de março de 2023",
      author: "Ana Silva",
      authorImage: "/images/team-1.jpg",
      slug: "entendendo-obrigacoes-fiscais-mei-2023",
      tab: "fiscal",
    },
    {
      title: "Como organizar sua agenda para maximizar a produtividade",
      excerpt:
        "Técnicas e ferramentas para organizar sua agenda de forma eficiente e aumentar sua produtividade diária.",
      image: "/images/blog-calendar.jpg",
      category: "Produtividade",
      date: "1 de março de 2023",
      author: "Carlos Mendes",
      authorImage: "/images/team-2.jpg",
      slug: "como-organizar-agenda-maximizar-produtividade",
      tab: "agendamentos",
    },
    {
      title: "Relatórios financeiros: como tomar decisões baseadas em dados",
      excerpt:
        "Aprenda a interpretar relatórios financeiros e tomar decisões estratégicas para o crescimento do seu negócio.",
      image: "/images/blog-reports.jpg",
      category: "Finanças",
      date: "20 de fevereiro de 2023",
      author: "Juliana Costa",
      authorImage: "/images/team-3.jpg",
      slug: "relatorios-financeiros-decisoes-baseadas-dados",
      tab: "relatorios",
    },
  ]

  const categories = [
    { name: "Notas Fiscais", count: 8 },
    { name: "Agendamentos", count: 12 },
    { name: "Chatbot", count: 5 },
    { name: "Produtividade", count: 15 },
    { name: "Finanças", count: 9 },
    { name: "Marketing", count: 7 },
  ]

  return (
    <ResourceLayout>
      <ResourceHero
        title="Blog"
        description="Dicas, tutoriais e novidades para ajudar você a gerenciar melhor seu negócio"
        icon={<BookOpen size={40} className="text-white" />}
      />

      {/* Search Section */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input type="text" placeholder="Buscar no blog..." className="pl-10 py-6 text-lg rounded-lg shadow-sm" />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Buscar</Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Post */}
      <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-2xl font-bold mb-8">
            Artigo <span className="text-blue-600 dark:text-blue-400">Destacado</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <BlogPostCard {...featuredPost} />
        </AnimatedSection>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold">
              Artigos <span className="text-blue-600 dark:text-blue-400">Recentes</span>
            </h2>
            <div className="mt-4 md:mt-0">
              <Tabs defaultValue="todos" className="w-full">
                <TabsList>
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                  <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
                  <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
                  <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </AnimatedSection>

        <Tabs defaultValue="todos" className="w-full">
          <TabsContent value="todos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <BlogPostCard {...post} />
                </AnimatedSection>
              ))}
            </div>
          </TabsContent>

          {["fiscal", "agendamentos", "chatbot", "relatorios"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter((post) => post.tab === tab)
                  .map((post, index) => (
                    <AnimatedSection key={index} delay={index * 0.05}>
                      <BlogPostCard {...post} />
                    </AnimatedSection>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <AnimatedSection delay={0.3}>
          <div className="mt-12 text-center">
            <Button variant="outline" className="px-8">
              Carregar mais artigos
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Categories and Newsletter */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Categorias
                </h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <Link key={index} href={`/blog/categoria/${category.name.toLowerCase()}`}>
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span>{category.name}</span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Inscreva-se na nossa newsletter</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Receba as últimas novidades, dicas e tutoriais diretamente na sua caixa de entrada.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input type="email" placeholder="Seu email" className="flex-grow" />
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Inscrever-se
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Ao se inscrever, você concorda com nossa política de privacidade. Não enviamos spam.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </ResourceLayout>
  )
}
