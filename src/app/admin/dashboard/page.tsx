'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface LibraryStats {
  totalBooks: number
  totalUsers: number
  booksIssued: number
  overdueBooks: number
  totalFines: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Raw API response:",data);
        
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your library system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBooks || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📖</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Books Issued</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.booksIssued || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overdueBooks || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Fines</p>
              <p className="text-2xl font-bold text-gray-900">${stats?.totalFines || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="primary">
              📚 Add New Book
            </Button>
            <Button className="w-full justify-start" variant="primary">
              👤 Add New User
            </Button>
            <Button className="w-full justify-start" variant="primary">
              📊 View Reports
            </Button>
            <Button className="w-full justify-start" variant="primary">
              ⚙️ System Settings
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b">
              <span>New book added: "Clean Code"</span>
              <span className="text-gray-500">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>User registered: John Doe</span>
              <span className="text-gray-500">4 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Book returned: "Effective Java"</span>
              <span className="text-gray-500">6 hours ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}