import axios from 'axios'
import { io } from 'socket.io-client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface Notification {
  id: string
  title: string
  message: string
  type: 'APPOINTMENT' | 'SYSTEM' | 'INVOICE' | 'TRANSACTION' | 'TAX' | 'MESSAGE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  userId: number
  read: boolean
  data?: Record<string, any>
  createdAt: string
  link?: string
  actionable?: boolean
}

export const fetchNotifications = async (
  userId: number
): Promise<Notification[]> => {
  const response = await axios.get(`${API_BASE_URL}notifications`, {
    params: { userId },
  })
  return response.data
}

export const markAllAsRead = async (userId: number): Promise<void> => {
  await axios.patch(
    `${API_BASE_URL}notifications/mark-all-read?userId=${userId}`
  )
}

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await axios.patch(`${API_BASE_URL}notifications/${id}`, {
    read: true,
  })
  return response.data
}

export const deleteNotification = async (
  id: string,
  token: string
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}notifications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const deleteMultipleNotifications = async (
  ids: string[],
  token: string
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}notifications`, {
    data: { ids },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const subscribeToNotifications = (
  userId: number,
  callback: (notification: Notification) => void
) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')

  if (!token || !process.env.NEXT_PUBLIC_WS_URL) {
    console.error('Token or WebSocket URL not defined')
    return () => {}
  }

  const socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`, {
    auth: { token },
    transports: ['websocket'],
  })

  socket.on('connect', () => {
    console.log('Connected to notifications socket')
  })

  socket.on('notification', (data: Notification) => {
    callback(data)
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from notifications socket')
  })

  return () => socket.disconnect()
}
