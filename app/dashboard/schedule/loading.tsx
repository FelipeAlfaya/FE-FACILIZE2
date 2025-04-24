import { DashboardHeader } from '../components/dashboard-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function ScheduleLoading() {
  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-6'>
        <div className='mb-8'>
          <Skeleton className='h-8 w-48 mb-2' />
          <Skeleton className='h-4 w-72' />
        </div>

        <div className='mb-6'>
          <Skeleton className='h-10 w-96' />
        </div>

        <div className='space-y-4'>
          <Skeleton className='h-[400px] w-full rounded-lg' />
        </div>
      </main>
    </div>
  )
}
