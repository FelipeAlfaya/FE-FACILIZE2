"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import FeatureShowcase from "@/components/feature-showcase"
import { Calendar, Bell, Users } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Agendamentos() {
  return (
    <ResourceLayout>
      <ResourceHero
        title="Sistema de Agendamentos"
        description="Gerencie sua agenda de forma eficiente, automatize lembretes e evite conflitos de horários."
        icon={<Calendar size={40} className="text-white" />}
      />

      <FeatureShowcase
        title="Agenda inteligente"
        description="Nossa plataforma de agendamentos foi desenvolvida para otimizar seu tempo e evitar conflitos de horário."
        image="/images/calendar-dashboard.jpg"
        imageAlt="Dashboard de agendamentos"
        icon={<Calendar size={24} />}
        features={[
          "Visualização diária, semanal e mensal da agenda",
          "Agendamentos recorrentes com um clique",
          "Bloqueio de horários para intervalos e compromissos pessoais",
          "Sincronização com Google Calendar e outros serviços",
        ]}
        ctaText="Experimente grátis"
        ctaLink="/signup"
      />

      <FeatureShowcase
        title="Lembretes automáticos"
        description="Reduza faltas e atrasos com nosso sistema de lembretes automáticos para seus clientes."
        image="/images/reminders-system.jpg"
        imageAlt="Sistema de lembretes"
        icon={<Bell size={24} />}
        features={[
          "Lembretes por WhatsApp, SMS ou email",
          "Personalização de mensagens e horários de envio",
          "Confirmação automática de presença",
          "Reagendamento simplificado em caso de imprevistos",
        ]}
        ctaText="Ver planos"
        ctaLink="/planos"
        reversed={true}
      />

      <FeatureShowcase
        title="Gestão de clientes"
        description="Mantenha um histórico completo de cada cliente, incluindo todos os agendamentos e serviços prestados."
        image="/images/client-management.jpg"
        imageAlt="Gestão de clientes"
        icon={<Users size={24} />}
        features={[
          "Cadastro completo de clientes com histórico de atendimentos",
          "Preferências e observações para personalizar o serviço",
          "Categorização de clientes por frequência ou valor",
          "Integração com sistema de notas fiscais",
        ]}
        ctaText="Saiba mais"
        ctaLink="/contato"
      />

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-800 dark:to-purple-950 text-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Otimize sua agenda e reduza faltas em até 70%</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Nossa plataforma de agendamentos já ajudou milhares de profissionais a organizar melhor seu tempo e
              melhorar a experiência de seus clientes.
            </p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" whileHover={{ scale: 1.02 }}>
              <Link href="/signup">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 dark:hover:bg-white/90 text-lg px-8 py-6">
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
