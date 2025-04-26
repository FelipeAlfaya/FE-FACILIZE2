import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ResetPasswordLoading() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <Skeleton className='h-8 w-3/4 mb-2' />
            <Skeleton className='h-4 w-full' />
          </CardHeader>

          <CardContent className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-10 w-full' />
          </CardContent>

          <CardFooter className='flex justify-center border-t pt-4'>
            <Skeleton className='h-4 w-40' />
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
