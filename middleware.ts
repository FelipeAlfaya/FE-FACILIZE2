import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lista manual de rotas em desenvolvimento (somente admins podem acessar)
const DEV_ROUTES = [
  '/dashboard/tax-calculator',
  '/dashboard/tax-comparison',
  '/dashboard/accounting',
  '/dashboard/chatbot',
]

// Função para verificar se uma rota está na lista de desenvolvimento
function isDevRoute(path: string): boolean {
  return DEV_ROUTES.some(
    (route) => path === route || (route !== '/' && path.startsWith(`${route}/`))
  )
}

// Função para verificar se o usuário é administrador
function isAdmin(request: NextRequest): boolean {
  try {
    const userDataCookie = request.cookies.get('user_data')?.value
    if (!userDataCookie) return false

    const userData = JSON.parse(userDataCookie)
    return userData?.isAdmin === true
  } catch (error) {
    console.error('Erro ao verificar status de administrador:', error)
    return false
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log(`Middleware executando para rota: ${path}`)

  // Verificar se é uma rota estática ou API (não precisa verificar)
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.includes('.') ||
    path === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Proteção para rotas admin (sempre requer autenticação)
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('access_token')?.value

    // Se não houver token, redirecionar para login
    if (!token) {
      console.log('Token não encontrado, redirecionando para login')
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  // Verificar se a rota atual está em desenvolvimento
  if (isDevRoute(path)) {
    console.log(
      `Rota ${path} está em desenvolvimento, verificando permissões...`
    )

    // 1. Verificar se está autenticado
    const token = request.cookies.get('access_token')?.value
    if (!token) {
      console.log(
        'Usuário não autenticado tentando acessar rota em desenvolvimento'
      )
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Verificar se é administrador
    const adminStatus = isAdmin(request)
    console.log(`Usuário é admin? ${adminStatus}`)

    // 3. Se não for admin, redirecionar para página de acesso negado
    if (!adminStatus) {
      console.log('Usuário não é admin, redirecionando para acesso negado')
      return NextResponse.redirect(new URL('/acesso-negado', request.url))
    }
  }

  return NextResponse.next()
}

// Configuração para definir em quais rotas o middleware será executado
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
