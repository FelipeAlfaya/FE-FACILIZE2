// context/DevelopmentContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface DevelopmentContextProps {
  isDevelopment: boolean
}

const DevelopmentContext = createContext<DevelopmentContextProps>({
  isDevelopment: false,
})

interface DevelopmentProviderProps {
  isDevelopment: boolean
  children: ReactNode
}

export const DevelopmentProvider = ({
  isDevelopment,
  children,
}: DevelopmentProviderProps) => {
  const router = useRouter()

  useEffect(() => {
    if (isDevelopment && router.pathname !== '/development') {
      router.replace('/dashboard/development')
    }
  }, [isDevelopment, router])

  return (
    <DevelopmentContext.Provider value={{ isDevelopment }}>
      {children}
    </DevelopmentContext.Provider>
  )
}

export const useDevelopment = () => useContext(DevelopmentContext)

