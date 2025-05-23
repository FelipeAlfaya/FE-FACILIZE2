import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-96' />
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Skeleton className='h-[500px] rounded-lg' />
        <Skeleton className='h-[500px] rounded-lg' />
      </div>
    </div>
  )
}
