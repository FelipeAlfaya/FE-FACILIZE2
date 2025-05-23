export type AppointmentStatus =
  | 'CONFIRMED'
  | 'PENDING'
  | 'CANCELLED'
  | 'COMPLETED'
export type AppointmentType = 'PRESENTIAL' | 'VIRTUAL' | 'NOT_SPECIFIED'
export type ProviderType = 'INDIVIDUAL' | 'TEAM'

export type Appointment = {
  id: number
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  type: AppointmentType
  clientId: number | null
  providerId: number
  serviceId: number
  location: string | null
  notes: string | null
  isProviderToProvider: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
  cancelledAt: string | null
  confirmedAt: string | null
  userId: number | null
  client: null | ClientData
  provider: ProviderData
  service: Service
  User: User | null
}

export type ClientData = {
  id: number
  user: User
}

export type AppointmentResponse = {
  id: number
  date: string
  status: string
  client: {
    user: {
      name: string
    }
  }
  service: {
    name: string
  }
}

export type Plan = {
  id: number
  name: string
  price: number
  description: string
  billingInterval: string
  trialPeriodDays: number
  stripeProductId: string
  stripePriceId: string
  isActive: boolean
  serviceLimit: number
  monthlyAppointmentsLimit: number
  createdAt: string
  deletedAt: string | null
  updatedAt: string
}

export type User = {
  id: number
  email: string
  name: string
  avatar: string | null
  phone: string | null
  stripeCustomerId: string
  type: 'PROVIDER' | 'CLIENT'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  provider: ProviderData | null
  client: ClientData | null
  address: Address | null
}

export type TransformedProvider = {
  id: string
  providerId: number
  name: string
  email: string
  avatar: string | null
  specialty: string | null
  location: string
  rating: number | null
  servicesCount: number
  price: number
  description: string | null
  providerType: ProviderType | null
  services: Service[]
}

export type Address = {
  id: number
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  userId: number
  createdAt: string
  updatedAt: string
}

export type ApiResponse<T> = {
  data: T[]
}

export type Service = {
  id: number
  name: string
  description: string
  price: number
  duration: number
  providerId: number
}

export type ProviderData = {
  id: number
  cpf: string
  cnpj: string | null
  description: string
  userId: number
  planId: number
  provider_rating: number | null
  stripeSubscriptionId: string
  subscriptionStatus: string
  lastPaymentDate: string | null
  nextPaymentDate: string | null
  specialty: string | null
  providerType: ProviderType
  companyName: string | null
  tradeName: string | null
  companyType: string | null
  legalRepresentative: string | null
  legalRepresentativeDocument: string | null
  foundationDate: string | null
  companyPhone: string | null
  companyDescription: string | null
  plan: Plan
  services: Service[]
}

