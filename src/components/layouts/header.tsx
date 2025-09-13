'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'LIBRARIAN': return 'bg-blue-100 text-blue-800'
      case 'PATRON': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              📚 Library Management System
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <Button 
                onClick={handleLogout}
                variant="primary"
                size="sm"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}