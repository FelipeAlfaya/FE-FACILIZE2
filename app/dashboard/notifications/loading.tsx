import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='container mx-auto px-4 py-8 animate-pulse'>
      {/* Page header */}
      <Skeleton className='h-8 w-1/3 mb-8 rounded-lg' />

      {/* Filters/controls row */}
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <div className='flex gap-2 flex-1 flex-wrap'>
          <Skeleton className='h-10 w-24 rounded-md' />
          <Skeleton className='h-10 w-24 rounded-md' />
          <Skeleton className='h-10 w-24 rounded-md' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-32 rounded-md' />
          <Skeleton className='h-10 w-32 rounded-md' />
        </div>
      </div>

      {/* Content list */}
      <div className='space-y-6'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='border rounded-xl p-6 bg-background/50'>
            <div className='flex flex-col sm:flex-row justify-between gap-4 mb-4'>
              <Skeleton className='h-6 w-2/3 sm:w-1/3 rounded-md' />
              <Skeleton className='h-5 w-20 rounded-full' />
            </div>

            {/* Multi-line text simulation */}
            <div className='space-y-2 mb-6'>
              <Skeleton className='h-4 w-full rounded-md' />
              <Skeleton className='h-4 w-4/5 rounded-md' />
              <Skeleton className='h-4 w-3/5 rounded-md' />
            </div>

            {/* Action buttons */}
            <div className='flex flex-wrap gap-3 justify-between items-center'>
              <div className='flex gap-2'>
                <Skeleton className='h-9 w-20 rounded-md' />
                <Skeleton className='h-9 w-20 rounded-md' />
              </div>
              <Skeleton className='h-4 w-24 rounded-md' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
