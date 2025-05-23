'use server'
// app/(dashboard)/schedule/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

export async function createPersonalAppointment(data: any, token: string) {
  try {
    const response = await fetch(`${API_URL}appointments/personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create personal appointment')
    }

    revalidatePath('/schedule')
    return await response.json()
  } catch (error) {
    console.error('Error creating personal appointment:', error)
    throw error
  }
}

export async function updatePersonalAppointment(
  id: number,
  data: any,
  token: string
) {
  try {
    const response = await fetch(`${API_URL}appointments/personal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update personal appointment')
    }

    revalidatePath('/schedule')
    return await response.json()
  } catch (error) {
    console.error('Error updating personal appointment:', error)
    throw error
  }
}

export async function deletePersonalAppointment(id: number, token: string) {
  try {
    const response = await fetch(`${API_URL}appointments/personal/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete personal appointment')
    }

    revalidatePath('/schedule')
    return await response.json()
  } catch (error) {
    console.error('Error deleting personal appointment:', error)
    throw error
  }
}

export async function getPersonalAppointments() {
  try {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')

    const response = await fetch(`${API_URL}appointments/personal`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch personal appointments')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching personal appointments:', error)
    throw error
  }
}

