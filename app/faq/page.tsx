"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import { HelpCircle, Search, FileText, Calendar, MessageSquare, BarChart3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import AnimatedSection from "@/components/animated-section"
import Link from "next/link"

interface FAQItem {
  question: string
  answer: string
  category: string
  id: string
}

export default function FAQ() {
  const faqItems: FAQItem[] = [
    {
      question: "Como emitir minha primeira nota fiscal?",
      answer:
        "Para emitir sua primeira nota fiscal, acesse o menu 'Notas Fiscais' e clique em 'Nova Nota'. Preencha os dados do cliente, descrição do serviço e valor. Verifique as informações e clique em 'Emitir'. A nota será processada e enviada automaticamente para o cliente e para os órgãos fiscais.",
      category: "notas",
      id: "emissao-nota",
    },
    {
      question: "Como cancelar uma nota fiscal emitida incorretamente?",
      answer:
        "Para cancelar uma nota fiscal, acesse o menu 'Notas Fiscais', localize a nota desejada e clique em 'Opções' > 'Cancelar'. Informe o motivo do cancelamento e confirme. Lembre-se que o cancelamento só é possível dentro do prazo estabelecido pela legislação (geralmente 24 horas após a emissão).",
      category: "notas",
      id: "cancelar-nota",
    },
    {
      question: "Quais impostos são calculados automaticamente nas notas fiscais?",
      answer:
        "O sistema calcula automaticamente os impostos conforme o regime tributário da sua empresa e o tipo de serviço prestado. Para MEI, são calculados o ISS municipal. Para Simples Nacional, são calculados ISS, PIS, COFINS e CSLL conforme a tabela do Simples. Para Lucro Presumido ou Real, são calculados ISS, PIS, COFINS, IRPJ e CSLL conforme as alíquotas aplicáveis.",
      category: "notas",
      id: "impostos-calculados",
    },
    {
      question: "Como configurar lembretes automáticos para clientes?",
      answer:
        "Para configurar lembretes automáticos, acesse 'Configurações' > 'Lembretes'. Você pode definir quando os lembretes serão enviados (ex: 24h antes, 1h antes), o canal de envio (WhatsApp, SMS, email) e personalizar a mensagem. Os lembretes serão enviados automaticamente conforme os agendamentos cadastrados.",
      category: "agendamentos",
      id: "lembretes",
    },
    {
      question: "Como bloquear horários na agenda?",
      answer:
        "Para bloquear horários na sua agenda, acesse o calendário e clique no horário desejado. Selecione a opção 'Bloquear horário' e informe o motivo (opcional). Você pode configurar bloqueios recorrentes para intervalos, almoço ou dias específicos em que não atende.",
      category: "agendamentos",
      id: "bloquear-horarios",
    },
    {
      question: "Como permitir que clientes agendem online?",
      answer:
        "Para permitir agendamentos online, acesse 'Configurações' > 'Agendamento Online' e ative a opção. Você receberá um link que pode ser compartilhado com seus clientes. Personalize os horários disponíveis, duração das consultas e informações necessárias para o agendamento.",
      category: "agendamentos",
      id: "agendamento-online",
    },
    {
      question: "Como integrar o chatbot ao meu WhatsApp Business?",
      answer:
        "Para integrar o chatbot, acesse 'Configurações' > 'Chatbot WhatsApp' e clique em 'Conectar WhatsApp'. Siga as instruções para vincular sua conta WhatsApp Business. Você precisará escanear um QR code com seu celular e confirmar a integração. Após a conexão, configure as respostas automáticas conforme sua necessidade.",
      category: "chatbot",
      id: "integracao-whatsapp",
    },
    {
      question: "Como personalizar as respostas do chatbot?",
      answer:
        "Para personalizar as respostas, acesse 'Configurações' > 'Chatbot WhatsApp' > 'Respostas'. Você pode criar respostas para perguntas frequentes, configurar menus interativos e definir fluxos de conversa. Use o editor visual para criar respostas sem precisar programar.",
      category: "chatbot",
      id: "personalizar-chatbot",
    },
    {
      question: "O chatbot consegue agendar consultas automaticamente?",
      answer:
        "Sim, o chatbot pode ser configurado para agendar consultas automaticamente. Acesse 'Configurações' > 'Chatbot WhatsApp' > 'Integrações' e ative a integração com o módulo de agendamentos. Configure os horários disponíveis e as informações necessárias para o agendamento.",
      category: "chatbot",
      id: "chatbot-agendamento",
    },
    {
      question: "Como exportar relatórios financeiros?",
      answer:
        "Para exportar relatórios, acesse o menu 'Relatórios', selecione o tipo de relatório desejado (financeiro, clientes, serviços) e o período. Clique em 'Gerar Relatório' e depois em 'Exportar'. Você pode escolher o formato de exportação (PDF, Excel, CSV) conforme sua necessidade.",
      category: "relatorios",
      id: "exportar-relatorios",
    },
    {
      question: "Como visualizar o faturamento mensal?",
      answer:
        "Para visualizar o faturamento mensal, acesse o Dashboard principal ou o menu 'Relatórios' > 'Financeiro'. Selecione o período desejado e você verá gráficos e tabelas com o faturamento detalhado, incluindo comparativos com períodos anteriores e projeções.",
      category: "relatorios",
      id: "faturamento-mensal",
    },
    {
      question: "Como configurar meu perfil de usuário?",
      answer:
        "Para configurar seu perfil, clique no seu avatar no canto superior direito e selecione 'Perfil'. Você pode atualizar suas informações pessoais, foto, dados de contato e preferências de notificação. Não se esqueça de clicar em 'Salvar' após fazer as alterações.",
      category: "geral",
      id: "configurar-perfil",
    },
    {
      question: "Como alterar meu plano de assinatura?",
      answer:
        "Para alterar seu plano, acesse 'Configurações' > 'Assinatura' e clique em 'Alterar Plano'. Você verá as opções disponíveis e poderá comparar os recursos de cada plano. Selecione o plano desejado e confirme a alteração. A mudança será aplicada no próximo ciclo de faturamento.",
      category: "geral",
      id: "alterar-plano",
    },
    {
      question: "Como adicionar novos usuários à minha conta?",
      answer:
        "Para adicionar usuários, acesse 'Configurações' > 'Usuários' e clique em 'Adicionar Usuário'. Informe o email da pessoa e defina o nível de permissão (administrador, editor ou visualizador). O novo usuário receberá um convite por email para acessar a plataforma.",
      category: "geral",
      id: "adicionar-usuarios",
    },
  ]

  return (
    <ResourceLayout>
      <ResourceHero
        title="Perguntas Frequentes"
        description="Encontre respostas para as dúvidas mais comuns sobre a plataforma Facilize"
        icon={<HelpCircle size={40} className="text-white" />}
      />

      {/* Search Section */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar nas perguntas frequentes..."
              className="pl-10 py-6 text-lg rounded-lg shadow-sm"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Buscar</Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <AnimatedSection>
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="mb-8 flex flex-wrap">
              <TabsTrigger value="todos">Todas as Perguntas</TabsTrigger>
              <TabsTrigger value="notas">
                <FileText className="h-4 w-4 mr-2" />
                Notas Fiscais
              </TabsTrigger>
              <TabsTrigger value="agendamentos">
                <Calendar className="h-4 w-4 mr-2" />
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="chatbot">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chatbot
              </TabsTrigger>
              <TabsTrigger value="relatorios">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="geral">Geral</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AnimatedSection key={index} delay={index * 0.05}>
                    <AccordionItem value={`item-${index}`} id={item.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start">
                          <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <span>{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-7">
                        <div className="text-gray-600 dark:text-gray-300">{item.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  </AnimatedSection>
                ))}
              </Accordion>
            </TabsContent>

            {["notas", "agendamentos", "chatbot", "relatorios", "geral"].map((category) => (
              <TabsContent key={category} value={category}>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <AnimatedSection key={index} delay={index * 0.05}>
                        <AccordionItem value={`item-${index}`} id={item.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-start">
                              <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <span>{item.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-7">
                            <div className="text-gray-600 dark:text-gray-300">{item.answer}</div>
                          </AccordionContent>
                        </AccordionItem>
                      </AnimatedSection>
                    ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </AnimatedSection>
      </section>

      {/* Still Need Help */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Se você não encontrou a resposta que procurava, nossa equipe de suporte está pronta para ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Contatar suporte
                </Button>
              </Link>
              <Link href="/tutoriais">
                <Button variant="outline">Ver tutoriais</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </ResourceLayout>
  )
}
