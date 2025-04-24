import { Card, CardContent } from '@/components/ui/card'

export function TermsOfService() {
  return (
    <Card>
      <CardContent className='p-6 space-y-6'>
        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>1. Termos de Serviço</h2>
          <p>
            Bem-vindo à Facilize. Ao acessar ou usar nossos serviços, você
            concorda com estes Termos de Serviço. Por favor, leia-os
            cuidadosamente.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>2. Uso do Serviço</h2>
          <p>
            A Facilize oferece uma plataforma para conectar usuários a
            prestadores de serviços. Você concorda em usar o serviço apenas para
            fins legais e de acordo com estes termos.
          </p>
          <h3 className='text-xl font-semibold mt-4'>2.1 Conta de Usuário</h3>
          <p>
            Para usar certos recursos do serviço, você precisará criar uma
            conta. Você é responsável por manter a confidencialidade de suas
            credenciais e por todas as atividades que ocorrem em sua conta.
          </p>
          <h3 className='text-xl font-semibold mt-4'>
            2.2 Prestadores de Serviço
          </h3>
          <p>
            Se você se registrar como prestador de serviços, você concorda em
            fornecer informações precisas sobre seus serviços, qualificações e
            disponibilidade.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>3. Pagamentos e Taxas</h2>
          <p>
            A Facilize pode cobrar taxas por certos serviços. Todos os
            pagamentos são processados por provedores de pagamento
            terceirizados. Você concorda em pagar todas as taxas aplicáveis e
            autoriza a cobrança usando os métodos de pagamento fornecidos.
          </p>
          <h3 className='text-xl font-semibold mt-4'>3.1 Reembolsos</h3>
          <p>
            Os reembolsos são processados de acordo com nossa política de
            reembolso, que pode variar dependendo do serviço e das
            circunstâncias.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>4. Conteúdo do Usuário</h2>
          <p>
            Você mantém todos os direitos sobre o conteúdo que envia à
            plataforma, mas concede à Facilize uma licença mundial, não
            exclusiva e isenta de royalties para usar, reproduzir e distribuir
            esse conteúdo em conexão com o serviço.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>
            5. Limitação de Responsabilidade
          </h2>
          <p>
            A Facilize não é responsável por quaisquer danos diretos, indiretos,
            incidentais, especiais ou consequentes resultantes do uso ou
            incapacidade de usar o serviço.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>6. Alterações nos Termos</h2>
          <p>
            A Facilize pode modificar estes termos a qualquer momento.
            Continuando a usar o serviço após tais modificações, você concorda
            com os termos revisados.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>7. Rescisão</h2>
          <p>
            A Facilize pode encerrar ou suspender sua conta e acesso ao serviço
            a qualquer momento, por qualquer motivo, sem aviso prévio.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>8. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis do Brasil, sem considerar suas
            disposições sobre conflitos de leis.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>9. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em
            contato conosco em suporte@facilize.com.
          </p>
        </section>
      </CardContent>
    </Card>
  )
}
