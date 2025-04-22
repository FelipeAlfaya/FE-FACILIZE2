import { DashboardHeader } from '../components/dashboard-header'
import { ScheduleCalendar } from '../components/schedule-calendar'

export default function SchedulePage() {
  return (
    <div className='min-h-screen bg-white'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2'>Minha Agenda</h1>
          <p className='text-gray-600'>
            Gerencie seus agendamentos e compromissos
          </p>
        </div>

        <ScheduleCalendar />
      </main>
    </div>
  )
}
