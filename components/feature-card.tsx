import { Receipt, Clock, MessageCircle } from "lucide-react"

interface FeatureCardProps {
  icon: "receipt" | "clock" | "message-circle"
  title: string
  description: string
  color: "blue" | "purple" | "green"
}

export default function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
  }

  const getIcon = () => {
    switch (icon) {
      case "receipt":
        return <Receipt size={24} />
      case "clock":
        return <Clock size={24} />
      case "message-circle":
        return <MessageCircle size={24} />
      default:
        return null
    }
  }

  return (
    <div className="text-center">
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}>
        {getIcon()}
      </div>
      <h3 className="font-bold mb-3">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
