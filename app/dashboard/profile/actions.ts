'use server'

interface Session {
  id: string
  deviceInfo: string
  browser: string
  os: string
  ipAddress: string
  city: string | null
  region: string | null
  country: string | null
  lastActive: string
  createdAt: string
}

interface ApiResponse {
  data: Session[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`

export const fetchUserSessions = async (
  userId: number | undefined,
  token: string
) => {
  if (!userId) return { sessions: null, currentSessionToken: '', error: null }

  try {
    const response = await fetch(`${baseUrl}user-sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to load sessions')
    }

    const data: ApiResponse = await response.json()
    const sessions = data.data

    // We'll let the client handle current session detection
    return { sessions, currentSessionToken: '', error: null }
  } catch (error) {
    return {
      sessions: null,
      currentSessionToken: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const invalidateSession = async (sessionId: string, token: string) => {
  try {
    const response = await fetch(`${baseUrl}user-sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to disconnect session')
    }

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

