"use client"

import ResourceLayout from "@/components/resource-layout"
import ResourceHero from "@/components/resource-hero"
import FeatureShowcase from "@/components/feature-showcase"
import { FileText, BarChart3, Shield } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotasFiscais() {
  return (
    <ResourceLayout>
      <ResourceHero
        title="Emissão de Notas Fiscais"
        description="Simplifique a emissão de notas fiscais eletrônicas com nossa plataforma intuitiva e em conformidade com a legislação."
        icon={<FileText size={40} className="text-white" />}
      />

      <FeatureShowcase
        title="Emissão simplificada"
        description="Nossa plataforma torna a emissão de notas fiscais um processo simples e rápido, permitindo que você se concentre no seu negócio."
        image="/images/invoice-dashboard.jpg"
        imageAlt="Dashboard de emissão de notas fiscais"
        icon={<FileText size={24} />}
        features={[
          "Emissão de NF-e, NFS-e e NFC-e em poucos cliques",
          "Preenchimento automático de dados recorrentes",
          "Validação em tempo real para evitar erros",
          "Integração com a Receita Federal e secretarias municipais",
        ]}
        ctaText="Experimente grátis"
        ctaLink="/signup"
      />

      <FeatureShowcase
        title="Gestão completa"
        description="Mantenha o controle total sobre suas notas fiscais emitidas, com histórico completo e relatórios detalhados."
        image="/images/invoice-management.jpg"
        imageAlt="Gestão de notas fiscais"
        icon={<BarChart3 size={24} />}
        features={[
          "Histórico completo de todas as notas emitidas",
          "Filtros avançados para localização rápida",
          "Relatórios gerenciais e financeiros",
          "Exportação em diversos formatos (PDF, CSV, XML)",
        ]}
        ctaText="Ver planos"
        ctaLink="/planos"
        reversed={true}
      />

      <FeatureShowcase
        title="Segurança e conformidade"
        description="Tenha a tranquilidade de saber que suas notas fiscais estão em conformidade com a legislação e armazenadas com segurança."
        image="/images/invoice-security.jpg"
        imageAlt="Segurança de notas fiscais"
        icon={<Shield size={24} />}
        features={[
          "Armazenamento seguro em nuvem por até 5 anos",
          "Backup automático de todas as notas emitidas",
          "Atualizações automáticas conforme mudanças na legislação",
          "Suporte especializado para questões fiscais",
        ]}
        ctaText="Saiba mais"
        ctaLink="/contato"
      />

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para simplificar suas obrigações fiscais?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já economizam tempo e evitam dores de cabeça com a emissão de
              notas fiscais.
            </p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" whileHover={{ scale: 1.02 }}>
              <Link href="/signup">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-white/90 text-lg px-8 py-6">
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
