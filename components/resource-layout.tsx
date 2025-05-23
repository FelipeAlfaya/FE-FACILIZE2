import Header from "@/components/header"
import Footer from "@/components/footer"
import type { ReactNode } from "react"

interface ResourceLayoutProps {
  children: ReactNode
}

export default function ResourceLayout({ children }: ResourceLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      {children}
      <Footer />
    </main>
  )
}
