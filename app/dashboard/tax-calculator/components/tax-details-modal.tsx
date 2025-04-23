'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

type TaxDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function TaxDetailsModal({ isOpen, onClose }: TaxDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Detalhes do Cálculo de Impostos</DialogTitle>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>
        </DialogHeader>

        <Tabs defaultValue='calculation'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='calculation'>Cálculo</TabsTrigger>
            <TabsTrigger value='comparison'>Comparativo</TabsTrigger>
            <TabsTrigger value='history'>Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value='calculation' className='space-y-4 py-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <h3 className='mb-2 font-medium'>Parâmetros do Cálculo</h3>
                <div className='rounded-md bg-muted p-4'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Regime Tributário
                      </p>
                      <p className='font-medium'>Simples Nacional</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Atividade</p>
                      <p className='font-medium'>Prestação de Serviços</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Faturamento
                      </p>
                      <p className='font-medium'>R$ 10.000,00</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Despesas</p>
                      <p className='font-medium'>R$ 3.000,00</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Anexo Simples
                      </p>
                      <p className='font-medium'>Anexo III</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Alíquota Efetiva
                      </p>
                      <p className='font-medium'>6,00%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='mb-2 font-medium'>Resumo dos Impostos</h3>
                <div className='rounded-md bg-muted p-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm'>IRPJ (4,80%)</span>
                      <span className='font-medium'>R$ 480,00</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>CSLL (2,88%)</span>
                      <span className='font-medium'>R$ 288,00</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>PIS (0,65%)</span>
                      <span className='font-medium'>R$ 65,00</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>COFINS (3,00%)</span>
                      <span className='font-medium'>R$ 300,00</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>ISS (5,00%)</span>
                      <span className='font-medium'>R$ 500,00</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between font-bold'>
                      <span>Total</span>
                      <span>R$ 1.633,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-2 font-medium'>Memória de Cálculo</h3>
              <div className='rounded-md bg-muted p-4'>
                <div className='space-y-2'>
                  <p className='text-sm'>
                    <span className='font-medium'>
                      Faturamento Acumulado 12 meses:
                    </span>{' '}
                    R$ 120.000,00
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>Alíquota Nominal:</span>{' '}
                    11,20%
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>Parcela a Deduzir:</span> R$
                    9.360,00
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>
                      Cálculo da Alíquota Efetiva:
                    </span>{' '}
                    (11,20% × R$ 120.000,00 - R$ 9.360,00) ÷ R$ 120.000,00 =
                    6,00%
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>Valor do DAS:</span> R$
                    10.000,00 × 6,00% = R$ 600,00
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-2 font-medium'>Observações</h3>
              <div className='rounded-md bg-muted p-4'>
                <ul className='list-disc space-y-1 pl-5 text-sm'>
                  <li>
                    Este cálculo é uma estimativa baseada nas informações
                    fornecidas e na legislação vigente.
                  </li>
                  <li>
                    Consulte sempre um contador para validar os valores e obter
                    orientações específicas para o seu caso.
                  </li>
                  <li>
                    O ISS pode variar de acordo com o município onde o serviço é
                    prestado.
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='comparison' className='py-4'>
            <div className='space-y-4'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b'>
                      <th className='pb-2 text-left font-medium'>Regime</th>
                      <th className='pb-2 text-right font-medium'>Impostos</th>
                      <th className='pb-2 text-right font-medium'>
                        Alíquota Efetiva
                      </th>
                      <th className='pb-2 text-right font-medium'>
                        Lucro Líquido
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b'>
                      <td className='py-3'>
                        <div>
                          <p className='font-medium'>Simples Nacional</p>
                          <p className='text-xs text-muted-foreground'>
                            Anexo III
                          </p>
                        </div>
                      </td>
                      <td className='py-3 text-right'>R$ 600,00</td>
                      <td className='py-3 text-right'>6,00%</td>
                      <td className='py-3 text-right'>R$ 6.400,00</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='py-3'>
                        <div>
                          <p className='font-medium'>Lucro Presumido</p>
                          <p className='text-xs text-muted-foreground'>
                            Presunção 32%
                          </p>
                        </div>
                      </td>
                      <td className='py-3 text-right'>R$ 1.633,00</td>
                      <td className='py-3 text-right'>16,33%</td>
                      <td className='py-3 text-right'>R$ 5.367,00</td>
                    </tr>
                    <tr>
                      <td className='py-3'>
                        <div>
                          <p className='font-medium'>Lucro Real</p>
                          <p className='text-xs text-muted-foreground'>
                            Com despesas de R$ 3.000,00
                          </p>
                        </div>
                      </td>
                      <td className='py-3 text-right'>R$ 1.890,00</td>
                      <td className='py-3 text-right'>18,90%</td>
                      <td className='py-3 text-right'>R$ 5.110,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='rounded-md bg-muted p-4'>
                <h3 className='mb-2 font-medium'>Análise Comparativa</h3>
                <ul className='list-disc space-y-1 pl-5 text-sm'>
                  <li>
                    <span className='font-medium'>Simples Nacional:</span>{' '}
                    Melhor opção para o seu caso, com economia de R$ 1.033,00 em
                    relação ao Lucro Presumido.
                  </li>
                  <li>
                    <span className='font-medium'>Lucro Presumido:</span> Pode
                    ser vantajoso se houver retenções de impostos pelos clientes
                    ou créditos tributários.
                  </li>
                  <li>
                    <span className='font-medium'>Lucro Real:</span> Mais
                    vantajoso quando as despesas representam uma parcela
                    significativa do faturamento.
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='history' className='py-4'>
            <div className='space-y-4'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b'>
                      <th className='pb-2 text-left font-medium'>Data</th>
                      <th className='pb-2 text-left font-medium'>Regime</th>
                      <th className='pb-2 text-right font-medium'>
                        Faturamento
                      </th>
                      <th className='pb-2 text-right font-medium'>Impostos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b'>
                      <td className='py-3'>15/05/2023</td>
                      <td className='py-3'>Simples Nacional</td>
                      <td className='py-3 text-right'>R$ 10.000,00</td>
                      <td className='py-3 text-right'>R$ 600,00</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='py-3'>10/04/2023</td>
                      <td className='py-3'>Simples Nacional</td>
                      <td className='py-3 text-right'>R$ 9.500,00</td>
                      <td className='py-3 text-right'>R$ 570,00</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='py-3'>15/03/2023</td>
                      <td className='py-3'>Simples Nacional</td>
                      <td className='py-3 text-right'>R$ 11.200,00</td>
                      <td className='py-3 text-right'>R$ 672,00</td>
                    </tr>
                    <tr>
                      <td className='py-3'>12/02/2023</td>
                      <td className='py-3'>Simples Nacional</td>
                      <td className='py-3 text-right'>R$ 8.800,00</td>
                      <td className='py-3 text-right'>R$ 528,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={onClose}>
            Fechar
          </Button>
          <Button variant='outline'>Salvar PDF</Button>
          <Button>Exportar Detalhes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
