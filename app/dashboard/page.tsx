import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header showProfile={true} />

      <div className="max-w-6xl mx-auto mt-8 p-4 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-3">
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">Nome: </span>
                  <span>Felipe da Silva</span>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Novo</div>
              </div>
              <div>
                <span className="font-medium">Serviço: </span>
                <span>Corte de cabelo</span>
              </div>
              <div className="mt-4 bg-gray-100 h-16 rounded"></div>
            </div>

            <div className="border rounded-md p-3">
              <div className="bg-gray-100 h-16 rounded"></div>
            </div>

            <div className="border rounded-md p-3">
              <div className="bg-gray-100 h-16 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between">
                <span className="font-medium">PLANO: </span>
                <span className="text-blue-600 font-medium">BÁSICO MENSAL</span>
              </div>

              <div className="mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Serviços prestados esse mês: </span>
                  <span>20</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Serviços prestados esse ano: </span>
                  <span>230</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Valor total de serviços: </span>
                  <span>R$ 12.500,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Notas emitidas até o momento: </span>
                  <span>30</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Números de clientes: </span>
                  <span>50</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-medium">Dias mais movimentados:</div>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="text-center">
                    <div className="font-medium">Terça</div>
                    <div className="text-sm text-gray-500">25%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Quinta</div>
                    <div className="text-sm text-gray-500">30%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Sexta</div>
                    <div className="text-sm text-gray-500">45%</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <span className="font-medium mr-2">Relação com cliente: </span>
                <StarRating rating={4} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
