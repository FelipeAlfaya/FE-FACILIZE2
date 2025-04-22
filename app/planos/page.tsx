import Header from "@/components/header"
import PricingCardDetailed from "@/components/pricing-card-detailed"

export default function Planos() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold text-center mb-8">Nossos Planos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Monthly Plans */}
          <PricingCardDetailed
            title="PLANO BÁSICO MENSAL"
            price="49,90"
            period="por mês"
            features={["Emissão de notas fiscais ilimitadas", "Controle de clientes", "Chatbot integrado ao WhatsApp"]}
            buttonText="Contratar"
          />

          <PricingCardDetailed
            title="PLANO PRO MENSAL"
            price="69,90"
            period="por mês"
            features={[
              "Emissão de notas fiscais ilimitadas",
              "Controle de clientes avançado",
              "Chatbot integrado ao WhatsApp",
              "Relatórios avançados",
            ]}
            buttonText="Contratar"
            highlighted={true}
          />

          <PricingCardDetailed
            title="PLANO PRO+ MENSAL"
            price="89,90"
            period="por mês"
            features={[
              "Emissão de notas fiscais ilimitadas",
              "Controle de clientes avançado",
              "Chatbot integrado ao WhatsApp",
              "Relatórios avançados",
              "Suporte prioritário",
            ]}
            buttonText="Contratar"
          />

          {/* Annual Plans */}
          <PricingCardDetailed
            title="PLANO BÁSICO ANUAL"
            price="508,80"
            period="por ano"
            features={["Emissão de notas fiscais ilimitadas", "Controle de clientes", "Chatbot integrado ao WhatsApp"]}
            buttonText="Contratar"
            discount="15% de desconto"
          />

          <PricingCardDetailed
            title="PLANO PRO ANUAL"
            price="712,80"
            period="por ano"
            features={[
              "Emissão de notas fiscais ilimitadas",
              "Controle de clientes avançado",
              "Chatbot integrado ao WhatsApp",
              "Relatórios avançados",
            ]}
            buttonText="Contratar"
            discount="15% de desconto"
          />

          <PricingCardDetailed
            title="PLANO PRO+ ANUAL"
            price="916,80"
            period="por ano"
            features={[
              "Emissão de notas fiscais ilimitadas",
              "Controle de clientes avançado",
              "Chatbot integrado ao WhatsApp",
              "Relatórios avançados",
              "Suporte prioritário",
            ]}
            buttonText="Contratar"
            discount="15% de desconto"
          />
        </div>
      </div>
    </main>
  )
}
