import Cookies from 'js-cookie'

export async function getToken() {
  if (typeof window === 'undefined') return null

  // Verificar nas storages primeiro (para compatibilidade)
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')

  // Se não encontrado nas storages, verificar nos cookies
  if (!token) {
    const cookieToken = Cookies.get('access_token')
    if (cookieToken) {
      return cookieToken
    }
  }

  if (!token) {
    throw new Error('Sessão expirada. Por favor, faça login novamente.')
  }

  return token
}

export function isAdmin() {
  if (typeof window === 'undefined') return false

  let isAdminUser = false

  try {
    // Verificar nas storages primeiro
    const userStr =
      localStorage.getItem('user') || sessionStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user?.isAdmin === true) {
          console.log('Admin verificado via localStorage')
          isAdminUser = true
        }
      } catch (e) {
        console.error('Erro ao analisar dados do usuário em localStorage', e)
      }
    }

    // Se não encontrado nas storages, verificar nos cookies
    if (!isAdminUser) {
      const cookieUserStr = Cookies.get('user_data')
      if (cookieUserStr) {
        try {
          const user = JSON.parse(cookieUserStr)
          if (user?.isAdmin === true) {
            console.log('Admin verificado via cookies')
            isAdminUser = true
          }
        } catch (e) {
          console.error('Erro ao analisar cookie de usuário', e)
        }
      }
    }
  } catch (e) {
    console.error('Erro ao verificar status de admin', e)
  }

  console.log('Resultado final da verificação de admin:', isAdminUser)
  return isAdminUser
}

export function isDevRoute(pathname: string) {
  if (typeof window === 'undefined') return false

  try {
    // Verificação especial para dashboard
    const isDashboard =
      pathname === '/dashboard' || pathname.startsWith('/dashboard/')

    // Verificar tanto nos cookies quanto no localStorage
    const devRoutesStr =
      Cookies.get('devRoutes') || localStorage.getItem('devRoutes')
    if (devRoutesStr) {
      const devRoutes = JSON.parse(devRoutesStr)
      // Verificar se a rota atual está na lista de desenvolvimento
      if (Array.isArray(devRoutes)) {
        // Verificação especial para a rota do dashboard
        if (isDashboard) {
          // Verificar tanto o path exato quanto as variações de '/dashboard' e '/dashboard/*'
          return devRoutes.some(
            (route) =>
              route === '/dashboard' ||
              pathname === route ||
              pathname.startsWith(`${route}/`)
          )
        }

        // Verificação normal para outras rotas
        const isDev = devRoutes.some(
          (route) => pathname === route || pathname.startsWith(`${route}/`)
        )
        return isDev
      }
    }
  } catch (e) {
    console.error('Erro ao verificar rotas em desenvolvimento', e)
  }

  return false
}

export function shouldBlockRoute(pathname: string) {
  // Verificação especial para dashboard
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    const isDev = isDevRoute(pathname)
    const isUserAdmin = isAdmin()
    console.log(
      `Verificação especial - Dashboard: isDev=${isDev}, isAdmin=${isUserAdmin}`
    )
    return isDev && !isUserAdmin
  }

  // Verificação padrão para outras rotas
  // Se é uma rota em desenvolvimento e o usuário não é admin, deve bloquear
  return isDevRoute(pathname) && !isAdmin()
}

export function syncAuthCookies() {
  if (typeof window === 'undefined') return

  // Sincronizar token
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')
  if (token) {
    Cookies.set('access_token', token, { expires: 30, path: '/' })
  }

  // Sincronizar dados do usuário
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (userStr) {
    Cookies.set('user_data', userStr, { expires: 30, path: '/' })
  }

  // Sincronizar rotas em desenvolvimento
  const devRoutesStr = localStorage.getItem('devRoutes')
  if (devRoutesStr) {
    Cookies.set('devRoutes', devRoutesStr, { expires: 30, path: '/' })
  }
}
