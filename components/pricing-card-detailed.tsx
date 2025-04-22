import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingCardDetailedProps {
  title: string
  price: string
  period: string
  features: string[]
  buttonText: string
  highlighted?: boolean
  discount?: string
}

export default function PricingCardDetailed({
  title,
  price,
  period,
  features,
  buttonText,
  highlighted = false,
  discount,
}: PricingCardDetailedProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden flex flex-col ${highlighted ? "border-blue-500 shadow-md" : "border-gray-200"}`}
    >
      <div className="p-6 bg-white">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          {discount && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">{discount}</span>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-blue-600">
            <span className="text-sm align-top">R$</span>
            {price}
          </div>
          <div className="text-sm text-gray-500">{period}</div>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">{buttonText}</Button>
        </div>
      </div>

      <div className="mt-auto p-4 bg-gray-50 flex justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  )
}
