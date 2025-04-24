import { Skeleton } from '@/components/ui/skeleton'

export default function LegalLoading() {
  return (
    <div className='container mx-auto py-8 px-4 md:px-6'>
      <div className='max-w-4xl mx-auto'>
        <Skeleton className='h-10 w-3/4 mx-auto mb-6' />
        <Skeleton className='h-6 w-1/2 mx-auto mb-8' />

        <div className='flex justify-center mb-6'>
          <Skeleton className='h-10 w-full max-w-md' />
        </div>

        <Skeleton className='h-[600px] w-full rounded-lg' />
      </div>
    </div>
  )
}
