import type React from 'react'
export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>{children}</div>
  )
}
