import { Appointment, AppointmentResponse } from '@/types/appointment'

export const mapAppointmentResponse = (
  appointment: AppointmentResponse
): Appointment => {
  const statusMap: Record<string, Appointment['status']> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }

  const date = new Date(appointment.date)

  return {
    id: appointment.id.toString(),
    clientName: appointment.client.user.name,
    service: appointment.service.name,
    date: appointment.date, // ISO string
    time: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: statusMap[appointment.status] || 'pending',
  }
}
