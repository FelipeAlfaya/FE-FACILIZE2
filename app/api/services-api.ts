import axios from 'axios'

// Garante que a URL base tenha uma barra no final
const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.endsWith('/')
    ? process.env.NEXT_PUBLIC_API_URL
    : `${process.env.NEXT_PUBLIC_API_URL}/`
  : 'http://localhost:3333/'

export interface Service {
  id?: number
  name: string
  description: string
  price: number
  duration: number
  providerId?: number
}

export interface ServiceResponse extends Service {
  id: number
  createdAt: string
  updatedAt: string
  provider: {
    id: number
    user: {
      id: number
      name: string
      email: string
    }
  }
}

export const createService = async (
  service: Omit<Service, 'providerId'>,
  token: string
): Promise<ServiceResponse> => {
  console.log('API URL:', API_URL)
  console.log('Criando serviço:', service)
  const response = await axios.post(`${API_URL}services`, service, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const getMyServices = async (
  token: string
): Promise<ServiceResponse[]> => {
  console.log('API URL:', API_URL)
  console.log('Buscando meus serviços')
  try {
    const response = await axios.get(`${API_URL}services/my-services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status)
      console.error('Dados:', error.response?.data)
    }
    throw error
  }
}

export const getServicesByProvider = async (
  providerId: number
): Promise<ServiceResponse[]> => {
  const response = await axios.get(`${API_URL}services/provider/${providerId}`)
  return response.data
}

export const getServiceById = async (id: number): Promise<ServiceResponse> => {
  const response = await axios.get(`${API_URL}services/${id}`)
  return response.data
}

export const updateService = async (
  id: number,
  service: Partial<Omit<Service, 'providerId'>>,
  token: string
): Promise<ServiceResponse> => {
  console.log('API URL:', API_URL)
  console.log('Atualizando serviço:', id, service)
  const response = await axios.patch(`${API_URL}services/${id}`, service, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const deleteService = async (
  id: number,
  token: string
): Promise<ServiceResponse> => {
  console.log('API URL:', API_URL)
  console.log('Excluindo serviço:', id)
  const response = await axios.delete(`${API_URL}services/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
