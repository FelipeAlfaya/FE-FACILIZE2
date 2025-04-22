interface LogoProps {
  size?: "small" | "medium" | "large"
  color?: "blue" | "white"
}

export default function Logo({ size = "medium", color = "blue" }: LogoProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  const innerSizeClasses = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-7 h-7",
  }

  const colorClasses = {
    blue: "border-blue-600",
    white: "border-white",
  }

  return (
    <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} flex items-center justify-center`}>
      <div className={`${innerSizeClasses[size]} border-2 ${colorClasses[color]}`}></div>
    </div>
  )
}
