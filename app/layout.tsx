import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@/context/UserContext'
import { DevRouteOverlay } from '@/components/dev-route-overlay'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Facilize',
  description: 'Plataforma para encontrar e agendar serviços com profissionais',
  icons: {
    icon: '/images/logo-2.png',
    shortcut: '/images/logo-2.png',
    apple: '/images/logo-2.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/logo-2.png',
    },
  },
  openGraph: {
    images: '/images/logo-2.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
      themes={[
        'light',
        'dark',
        'dracula',
        'solarized',
        'dimmed',
        'nord',
        'monokai',
        'onedark',
      ]}
    >
      <html lang='pt-BR' suppressHydrationWarning>
        <head>
          <link rel='icon' href='/images/logo-color.svg' sizes='any' />
        </head>
        <body className={inter.className}>
          <AuthProvider>
            <UserProvider>
              {children}
              <DevRouteOverlay />
            </UserProvider>
          </AuthProvider>
          <Toaster />
        </body>
      </html>
    </ThemeProvider>
  )
}
