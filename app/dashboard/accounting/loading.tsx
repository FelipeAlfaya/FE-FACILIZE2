import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='mt-2 h-4 w-96' />
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className='h-32 rounded-lg' />
          ))}
      </div>

      <div className='mt-8 grid gap-6 md:grid-cols-2'>
        <Skeleton className='h-80 rounded-lg' />
        <Skeleton className='h-80 rounded-lg' />
      </div>

      <div className='mt-8'>
        <Skeleton className='mb-4 h-8 w-48' />
        <Skeleton className='h-64 rounded-lg' />
      </div>
    </div>
  )
}
