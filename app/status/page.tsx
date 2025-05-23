"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import { Activity, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedSection from "@/components/animated-section"
import { useState } from "react"

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance"

interface ServiceStatusProps {
  name: string
  status: ServiceStatus
  description?: string
  lastUpdated?: string
}

function ServiceStatusIndicator({ status, name, description, lastUpdated }: ServiceStatusProps) {
  const statusConfig = {
    operational: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      label: "Operacional",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-900",
    },
    degraded: {
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      label: "Desempenho Reduzido",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-900",
    },
    outage: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      label: "Indisponível",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-900",
    },
    maintenance: {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      label: "Em Manutenção",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-900",
    },
  }

  const config = statusConfig[status]

  return (
    <div
      className={`p-4 rounded-lg border ${config.bg} ${config.border} flex items-center justify-between transition-colors duration-300`}
    >
      <div className="flex items-center">
        <div className="mr-3">{config.icon}</div>
        <div>
          <h3 className="font-medium">{name}</h3>
          {description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>}
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm mr-2">{config.label}</span>
        {lastUpdated && <span className="text-xs text-gray-500 dark:text-gray-400">{lastUpdated}</span>}
      </div>
    </div>
  )
}

export default function Status() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState("Há 5 minutos")

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated("Agora")
    }, 1000)
  }

  const services = [
    {
      name: "API de Notas Fiscais",
      status: "operational" as ServiceStatus,
      description: "Emissão e consulta de notas fiscais",
    },
    {
      name: "Sistema de Agendamentos",
      status: "operational" as ServiceStatus,
      description: "Agendamentos e lembretes automáticos",
    },
    {
      name: "Chatbot WhatsApp",
      status: "operational" as ServiceStatus,
      description: "Integração com WhatsApp Business",
    },
    {
      name: "Painel de Controle",
      status: "operational" as ServiceStatus,
      description: "Interface web para gerenciamento",
    },
    {
      name: "Relatórios e Análises",
      status: "operational" as ServiceStatus,
      description: "Geração de relatórios e dashboards",
    },
    {
      name: "Banco de Dados",
      status: "operational" as ServiceStatus,
      description: "Armazenamento e processamento de dados",
    },
  ]

  const incidents = [
    {
      date: "15/04/2023",
      title: "Lentidão no sistema de agendamentos",
      status: "Resolvido",
      description:
        "Identificamos uma lentidão no sistema de agendamentos devido a um aumento inesperado de tráfego. O problema foi resolvido com a adição de mais recursos ao servidor.",
      timeline: [
        {
          time: "10:15",
          status: "Identificado",
          description: "Detectamos lentidão no sistema de agendamentos.",
        },
        {
          time: "10:30",
          status: "Investigando",
          description: "Equipe técnica iniciou a investigação do problema.",
        },
        {
          time: "11:45",
          status: "Resolvido",
          description: "Problema resolvido com a adição de mais recursos ao servidor.",
        },
      ],
    },
    {
      date: "03/03/2023",
      title: "Indisponibilidade temporária da API de Notas Fiscais",
      status: "Resolvido",
      description:
        "A API de Notas Fiscais ficou indisponível por aproximadamente 45 minutos devido a uma manutenção não programada no servidor da Receita Federal.",
      timeline: [
        {
          time: "14:20",
          status: "Identificado",
          description: "API de Notas Fiscais reportada como indisponível.",
        },
        {
          time: "14:25",
          status: "Investigando",
          description: "Identificamos que o problema está relacionado ao servidor da Receita Federal.",
        },
        {
          time: "15:05",
          status: "Resolvido",
          description: "Serviço normalizado após conclusão da manutenção no servidor da Receita Federal.",
        },
      ],
    },
  ]

  return (
    <ResourceLayout>
      <ResourceHero
        title="Status do Sistema"
        description="Verifique o status atual de todos os serviços da plataforma Facilize"
        icon={<Activity size={40} className="text-white" />}
      />

      {/* Current Status */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">Status Atual</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Última atualização: <span className="font-medium">{lastUpdated}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Todos os sistemas operacionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Todos os serviços da Facilize estão funcionando normalmente.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        <div className="mt-8 space-y-4">
          {services.map((service, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <ServiceStatusIndicator {...service} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Incident History */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">Histórico de Incidentes</h2>
          </AnimatedSection>

          {incidents.length > 0 ? (
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{incident.date}</p>
                          <CardTitle className="text-lg mt-1">{incident.title}</CardTitle>
                        </div>
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            incident.status === "Resolvido"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {incident.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{incident.description}</p>
                      <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-4">
                        {incident.timeline.map((item, timelineIndex) => (
                          <div key={timelineIndex} className="relative">
                            <div className="flex items-baseline">
                              <span className="text-sm font-medium">{item.time}</span>
                              <span className="mx-2 text-gray-500 dark:text-gray-400">—</span>
                              <span
                                className={`text-sm font-medium ${
                                  item.status === "Resolvido"
                                    ? "text-green-600 dark:text-green-400"
                                    : item.status === "Investigando"
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <Card>
                <CardContent className="py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">Nenhum incidente nos últimos 90 dias</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Todos os sistemas têm operado normalmente nos últimos 90 dias.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Uptime Stats */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">Estatísticas de Disponibilidade</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedSection delay={0.1}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Últimos 30 dias</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">99.98%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tempo de atividade</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Últimos 90 dias</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">99.95%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tempo de atividade</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Último ano</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">99.92%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tempo de atividade</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-12 bg-blue-50 dark:bg-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4">Receba atualizações de status</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Inscreva-se para receber notificações em tempo real sobre o status dos serviços da Facilize.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu email"
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex-grow"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Inscrever-se
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </ResourceLayout>
  )
}
