import { Card, CardContent } from '@/components/ui/card'

export function PrivacyPolicy() {
  return (
    <Card>
      <CardContent className='p-6 space-y-6'>
        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>1. Introdução</h2>
          <p>
            A Facilize está comprometida em proteger sua privacidade. Esta
            Política de Privacidade explica como coletamos, usamos, divulgamos e
            protegemos suas informações pessoais.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>2. Informações que Coletamos</h2>
          <h3 className='text-xl font-semibold mt-4'>
            2.1 Informações Fornecidas por Você
          </h3>
          <p>
            Coletamos informações que você fornece diretamente, como nome,
            endereço de e-mail, número de telefone, endereço, informações de
            pagamento e outras informações quando você se registra, cria um
            perfil ou usa nossos serviços.
          </p>
          <h3 className='text-xl font-semibold mt-4'>
            2.2 Informações Coletadas Automaticamente
          </h3>
          <p>
            Coletamos automaticamente certas informações quando você usa nosso
            serviço, incluindo endereço IP, tipo de navegador, páginas
            visitadas, tempo gasto no site e outras estatísticas de uso.
          </p>
          <h3 className='text-xl font-semibold mt-4'>
            2.3 Cookies e Tecnologias Semelhantes
          </h3>
          <p>
            Usamos cookies e tecnologias semelhantes para coletar informações
            sobre como você interage com nosso serviço e para melhorar sua
            experiência.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>
            3. Como Usamos Suas Informações
          </h2>
          <p>Usamos suas informações para:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Fornecer, manter e melhorar nossos serviços</li>
            <li>Processar transações e enviar notificações relacionadas</li>
            <li>Responder a comentários, perguntas e solicitações</li>
            <li>
              Enviar informações técnicas, atualizações e mensagens
              administrativas
            </li>
            <li>Comunicar sobre promoções, eventos e outras notícias</li>
            <li>Monitorar e analisar tendências, uso e atividades</li>
            <li>Detectar, prevenir e resolver fraudes e problemas técnicos</li>
            <li>Personalizar e melhorar sua experiência</li>
          </ul>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>
            4. Compartilhamento de Informações
          </h2>
          <p>Podemos compartilhar suas informações com:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Prestadores de serviços que realizam serviços em nosso nome</li>
            <li>
              Parceiros comerciais com os quais oferecemos produtos ou serviços
              em conjunto
            </li>
            <li>
              Outros usuários, quando você compartilha informações publicamente
            </li>
            <li>
              Em resposta a um processo legal ou solicitação governamental
            </li>
            <li>
              Se acreditarmos que a divulgação é necessária para proteger nossos
              direitos, propriedade ou segurança
            </li>
          </ul>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>5. Segurança de Dados</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações
            pessoais contra acesso não autorizado, alteração, divulgação ou
            destruição. No entanto, nenhum sistema é completamente seguro, e não
            podemos garantir a segurança absoluta de suas informações.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>6. Seus Direitos</h2>
          <p>
            Você tem o direito de acessar, corrigir, atualizar ou excluir suas
            informações pessoais. Você também pode se opor ao processamento de
            suas informações ou solicitar a portabilidade de seus dados.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais pelo tempo necessário para os
            fins estabelecidos nesta Política de Privacidade, a menos que um
            período de retenção mais longo seja exigido ou permitido por lei.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>8. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente.
            Notificaremos você sobre quaisquer alterações significativas
            publicando a nova política em nosso site ou por outros meios.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-bold'>9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em
            contato conosco em privacidade@facilize.com.
          </p>
        </section>
      </CardContent>
    </Card>
  )
}
