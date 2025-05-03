"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import { Briefcase, MapPin, Clock, Users, Coffee, Laptop, Heart, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/animated-section"

interface JobCardProps {
  title: string
  department: string
  location: string
  type: string
  slug: string
}

function JobCard({ title, department, location, type, slug }: JobCardProps) {
  return (
    <Link href={`/carreiras/${slug}`}>
      <motion.div whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}>
        <Card className="overflow-hidden h-full">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded mb-2">
                  {department}
                </span>
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
              <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{type}</span>
                </div>
              </div>
              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

export default function Carreiras() {
  const jobs = [
    {
      title: "Desenvolvedor(a) Full Stack",
      department: "Tecnologia",
      location: "São Paulo ou Remoto",
      type: "Tempo integral",
      slug: "desenvolvedor-full-stack",
      category: "tecnologia",
    },
    {
      title: "Especialista em Suporte ao Cliente",
      department: "Suporte",
      location: "Remoto",
      type: "Tempo integral",
      slug: "especialista-suporte-cliente",
      category: "suporte",
    },
    {
      title: "Designer de Produto",
      department: "Design",
      location: "São Paulo ou Remoto",
      type: "Tempo integral",
      slug: "designer-produto",
      category: "design",
    },
    {
      title: "Especialista em Marketing Digital",
      department: "Marketing",
      location: "Remoto",
      type: "Tempo integral",
      slug: "especialista-marketing-digital",
      category: "marketing",
    },
    {
      title: "Analista de Dados",
      department: "Tecnologia",
      location: "São Paulo ou Remoto",
      type: "Tempo integral",
      slug: "analista-dados",
      category: "tecnologia",
    },
    {
      title: "Gerente de Sucesso do Cliente",
      department: "Comercial",
      location: "São Paulo",
      type: "Tempo integral",
      slug: "gerente-sucesso-cliente",
      category: "comercial",
    },
  ]

  const benefits = [
    {
      icon: <Laptop className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Trabalho remoto",
      description: "Flexibilidade para trabalhar de onde quiser, com encontros presenciais ocasionais.",
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Plano de saúde",
      description: "Plano de saúde e odontológico de qualidade para você e seus dependentes.",
    },
    {
      icon: <Coffee className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Ambiente descontraído",
      description: "Cultura de trabalho colaborativa, sem dress code e com horários flexíveis.",
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Desenvolvimento contínuo",
      description: "Incentivo a cursos, certificações e participação em eventos da área.",
    },
  ]

  return (
    <ResourceLayout>
      <ResourceHero
        title="Carreiras"
        description="Junte-se ao nosso time e ajude a transformar a gestão de negócios no Brasil"
        icon={<Briefcase size={40} className="text-white" />}
      />

      {/* Company Culture */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Nossa <span className="text-blue-600 dark:text-blue-400">Cultura</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Na Facilize, acreditamos que pessoas felizes fazem produtos incríveis. Por isso, cultivamos um ambiente
                de trabalho colaborativo, transparente e focado em resultados, onde cada pessoa tem autonomia para
                contribuir com suas melhores ideias.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Valorizamos a diversidade de pensamentos e experiências, e estamos comprometidos em construir um time
                inclusivo que reflita a sociedade em que vivemos. Aqui, você encontrará espaço para crescer
                profissionalmente enquanto contribui para transformar a vida de milhares de empreendedores brasileiros.
              </p>
              <div className="flex items-center mt-8">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="font-medium">Mais de 50 colaboradores em todo o Brasil</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/team-culture.jpg"
                alt="Cultura da empresa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">
              Nossos <span className="text-blue-600 dark:text-blue-400">Benefícios</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold">
              Vagas <span className="text-blue-600 dark:text-blue-400">Abertas</span>
            </h2>
            <div className="mt-4 md:mt-0">
              <Tabs defaultValue="todas" className="w-full">
                <TabsList>
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="tecnologia">Tecnologia</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="marketing">Marketing</TabsTrigger>
                  <TabsTrigger value="suporte">Suporte</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </AnimatedSection>

        <Tabs defaultValue="todas" className="w-full">
          <TabsContent value="todas">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <JobCard {...job} />
                </AnimatedSection>
              ))}
            </div>
          </TabsContent>

          {["tecnologia", "design", "marketing", "suporte", "comercial"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs
                  .filter((job) => job.category === category)
                  .map((job, index) => (
                    <AnimatedSection key={index} delay={index * 0.05}>
                      <JobCard {...job} />
                    </AnimatedSection>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <AnimatedSection delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Não encontrou uma vaga que corresponda ao seu perfil? Envie seu currículo para nosso banco de talentos.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Cadastrar currículo
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-blue-50 dark:bg-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">
              O que nosso <span className="text-blue-600 dark:text-blue-400">time</span> diz
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1}>
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "Trabalhar na Facilize me permitiu crescer profissionalmente enquanto mantenho equilíbrio com
                        minha vida pessoal. O ambiente é colaborativo e todos estão sempre dispostos a ajudar."
                      </p>
                    </div>
                    <div className="mt-auto flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image
                          src="/images/team-1.jpg"
                          alt="Foto de perfil"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Ana Silva</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Desenvolvedora Front-end</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "O que mais gosto na Facilize é a autonomia que temos para propor e implementar novas ideias. A
                        empresa realmente valoriza a opinião de cada colaborador e isso faz toda a diferença."
                      </p>
                    </div>
                    <div className="mt-auto flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image
                          src="/images/team-2.jpg"
                          alt="Foto de perfil"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Carlos Mendes</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card className="overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "Entrei como estagiária e hoje lidero uma equipe. A Facilize investe no desenvolvimento dos
                        colaboradores e oferece oportunidades reais de crescimento para quem está comprometido."
                      </p>
                    </div>
                    <div className="mt-auto flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image
                          src="/images/team-3.jpg"
                          alt="Foto de perfil"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Juliana Costa</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gerente de Marketing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4">Pronto para fazer parte do nosso time?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Junte-se a nós e ajude a transformar a forma como os empreendedores brasileiros gerenciam seus negócios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Ver vagas abertas
              </Button>
              <Button variant="outline">Conhecer nossa cultura</Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </ResourceLayout>
  )
}
