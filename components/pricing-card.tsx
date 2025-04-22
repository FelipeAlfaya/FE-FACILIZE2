import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  buttonText: string
  highlighted?: boolean
  logoColor?: "blue" | "white"
}

export default function PricingCard({
  title,
  price,
  features,
  buttonText,
  highlighted = false,
  logoColor = "blue",
}: PricingCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 flex flex-col ${highlighted ? "border-blue-500 shadow-md" : "border-gray-200"}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold">
          <span className="text-sm align-top">R$</span>
          {price}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto text-center">
        <Button className={`w-full ${highlighted ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"}`}>
          {buttonText}
        </Button>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  )
}
