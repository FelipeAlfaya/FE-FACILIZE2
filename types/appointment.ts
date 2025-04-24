export type Appointment = {
  id: string
  clientName: string
  service: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
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
