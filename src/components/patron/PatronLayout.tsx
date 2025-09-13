'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layouts/header'
import PatronSidebar from '@/components/patron/PatronSidebar'

export default function PatronLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has patron role
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    if (parsedUser.role !== 'PATRON') {
      // Redirect to appropriate dashboard based on role
      switch (parsedUser.role) {
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
        case 'LIBRARIAN':
          router.push('/librarian/dashboard')
          break
        default:
          router.push('/login')
      }
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Patron Portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <PatronSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}