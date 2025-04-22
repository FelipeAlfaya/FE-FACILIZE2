import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Logo from "@/components/logo"

export default function Portal() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header showProfile={true} />

      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size="large" />
          <h1 className="text-xl font-medium mt-4">Venda fácil portal</h1>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cliente" className="text-sm font-medium">
              Cliente
            </label>
            <Input id="cliente" type="text" placeholder="Nome do cliente" className="w-full" />
          </div>

          <div className="space-y-2">
            <label htmlFor="servico" className="text-sm font-medium">
              Serviço
            </label>
            <Input id="servico" type="text" placeholder="Descrição do serviço" className="w-full" />
          </div>

          <div className="space-y-2">
            <label htmlFor="valor" className="text-sm font-medium">
              Valor
            </label>
            <Input id="valor" type="text" placeholder="R$ 0,00" className="w-full" />
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Emitir nota fiscal</Button>
        </form>
      </div>
    </main>
  )
}
