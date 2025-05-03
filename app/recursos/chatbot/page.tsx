"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import FeatureShowcase from "@/components/feature-showcase"
import { MessageCircle, Bot, Zap, Settings } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Chatbot() {
  return (
    <ResourceLayout>
      <ResourceHero
        title="Chatbot WhatsApp"
        description="Automatize o atendimento ao cliente com nosso chatbot inteligente integrado ao WhatsApp."
        icon={<MessageCircle size={40} className="text-white" />}
      />

      <FeatureShowcase
        title="Atendimento automatizado"
        description="Nosso chatbot inteligente responde às perguntas mais frequentes dos seus clientes, mesmo quando você não está disponível."
        image="/images/chatbot-dashboard.jpg"
        imageAlt="Dashboard do chatbot"
        icon={<Bot size={24} />}
        features={[
          "Respostas automáticas para perguntas frequentes",
          "Disponibilidade 24/7 para seus clientes",
          "Transferência para atendimento humano quando necessário",
          "Personalização completa das mensagens e fluxos de conversa",
        ]}
        ctaText="Experimente grátis"
        ctaLink="/signup"
      />

      <FeatureShowcase
        title="Integração com WhatsApp"
        description="Conecte-se com seus clientes onde eles já estão, sem precisar instalar novos aplicativos ou criar novas contas."
        image="/images/whatsapp-integration.jpg"
        imageAlt="Integração com WhatsApp"
        icon={<Zap size={24} />}
        features={[
          "Integração oficial com a API do WhatsApp Business",
          "Número comercial verificado para maior credibilidade",
          "Suporte a mensagens multimídia (imagens, documentos, etc.)",
          "Histórico completo de conversas para consulta",
        ]}
        ctaText="Ver planos"
        ctaLink="/planos"
        reversed={true}
      />

      <FeatureShowcase
        title="Personalização avançada"
        description="Configure seu chatbot de acordo com as necessidades específicas do seu negócio, sem precisar de conhecimentos técnicos."
        image="/images/chatbot-customization.jpg"
        imageAlt="Personalização do chatbot"
        icon={<Settings size={24} />}
        features={[
          "Editor visual de fluxos de conversa (sem programação)",
          "Criação de menus interativos e botões de resposta rápida",
          "Personalização de tom de voz e identidade da marca",
          "Integração com seu sistema de agendamentos e notas fiscais",
        ]}
        ctaText="Saiba mais"
        ctaLink="/contato"
      />

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 dark:from-green-800 dark:to-green-950 text-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Automatize seu atendimento e economize tempo</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Nossos clientes relatam uma redução de até 80% nas consultas básicas após implementar o chatbot,
              permitindo que foquem no que realmente importa.
            </p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" whileHover={{ scale: 1.02 }}>
              <Link href="/signup">
                <Button className="bg-white text-green-600 hover:bg-green-50 dark:hover:bg-white/90 text-lg px-8 py-6">
                  Começar agora
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>
    </ResourceLayout>
  )
}
