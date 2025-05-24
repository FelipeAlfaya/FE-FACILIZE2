import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'

export interface Review {
  id: number
  rating: number
  comment?: string
  type: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
  appointmentId: number
  reviewerId: number
  reviewedId: number
  createdAt: string
  updatedAt: string
  reviewer: {
    id: number
    name: string
    avatar?: string
  }
  reviewed: {
    id: number
    name: string
    avatar?: string
  }
  appointment: {
    id: number
    date: string
    service: {
      id: number
      name: string
    }
  }
}

export interface CreateReviewData {
  rating: number
  comment?: string
  appointmentId: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface PendingReview {
  appointment: {
    id: number
    date: string
    startTime: string
    endTime: string
    completedAt: string
    service: {
      id: number
      name: string
      description: string
      price: number
    }
  }
  reviewedUser: {
    id: number
    name: string
    avatar?: string
  }
  reviewType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
}

export interface GetReviewsParams {
  type?: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
  reviewerId?: number
  reviewedId?: number
  minRating?: number
  page?: number
  limit?: number
}

export interface ReviewsResponse {
  reviews: Review[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Função auxiliar para obter token
const getAuthToken = () => {
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')
  )
}

// Função auxiliar para configurar headers de autenticação
const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const createReview = async (
  reviewData: CreateReviewData
): Promise<Review> => {
  const response = await axios.post(`${API_BASE_URL}reviews`, reviewData, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getReviews = async (
  params?: GetReviewsParams
): Promise<ReviewsResponse> => {
  const response = await axios.get(`${API_BASE_URL}reviews`, {
    params,
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getMyReviews = async (
  type?: 'given' | 'received'
): Promise<Review[]> => {
  const response = await axios.get(`${API_BASE_URL}reviews/my-reviews`, {
    params: { type },
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getReviewStats = async (userId: number): Promise<ReviewStats> => {
  const response = await axios.get(`${API_BASE_URL}reviews/stats/${userId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const canReviewAppointment = async (
  appointmentId: number
): Promise<{ canReview: boolean; appointmentId: number }> => {
  const response = await axios.get(
    `${API_BASE_URL}reviews/can-review/${appointmentId}`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const getUserReviews = async (
  userId: number,
  type?: 'given' | 'received'
): Promise<Review[]> => {
  const response = await axios.get(`${API_BASE_URL}reviews/user/${userId}`, {
    params: { type },
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getPendingReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: PendingReview[]
  total: number
  currentPage: number
  totalPages: number
}> => {
  const response = await axios.get(`${API_BASE_URL}reviews/pending-reviews`, {
    params: { page, limit },
    headers: getAuthHeaders(),
  })
  return response.data
}
