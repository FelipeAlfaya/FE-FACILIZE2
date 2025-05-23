import axios from 'axios'

// Função helper para garantir que a URL da API esteja formatada corretamente
const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
}

const API_URL = getBaseUrl()

interface RevenueBreakdownItem {
  id: number
  date: string
  amount: number
}

interface RevenueResponse {
  totalRevenue: number
  completedAppointments: number
  breakdown: RevenueBreakdownItem[]
}

interface ServiceAppointments {
  total: number
  confirmed: number
  cancelled: number
}

interface PersonalAppointments {
  total: number
}

interface AppointmentResponse {
  total: number
  serviceAppointments: ServiceAppointments
  personalAppointments: PersonalAppointments
}

export const StatsService = {
  async getAppointmentCountByRange(
    userId: number,
    startDate: Date,
    endDate: Date,
    token: string
  ): Promise<AppointmentResponse> {
    const response = await axios.get<AppointmentResponse>(
      `${API_URL}/appointments/stats/count-by-range`,
      {
        params: {
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },

  async getRevenueStats(
    userId: number,
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<RevenueResponse> {
    const params: any = { userId }
    if (startDate) params.startDate = startDate.toISOString()
    if (endDate) params.endDate = endDate.toISOString()

    const response = await axios.get<RevenueResponse>(
      `${API_URL}/appointments/stats/revenue`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },
}
