'use server'
const baseUrl = `${process.env.NEXT_API_PUBLIC_URL}`

export const fetchChangePassword = async (
  userId: number,
  token: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await fetch(`${baseUrl}/users/${userId}/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.message || 'Erro ao alterar senha' }
    }

    return { success: true }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
    }
  }
}
