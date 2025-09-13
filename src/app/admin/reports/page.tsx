'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ReportData {
  overview: {
    totalBooks: number
    totalUsers: number
    activeBorrowings: number
    overdueBooks: number
    totalFines: number
    paidFines: number
  }
  topBooks: Array<{
    title: string
    author: string
    borrowCount: number
  }>
  topBorrowers: Array<{
    name: string
    email: string
    borrowCount: number
  }>
  monthlyStats: Array<{
    month: string
    borrowings: number
    returns: number
    newUsers: number
  }>
  genreDistribution: Array<{
    genre: string
    count: number
  }>
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days')

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod])

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reports?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        // If reports API doesn't exist, use stats API for basic data
        const statsResponse = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          // Create mock report data structure
          setReportData({
            overview: {
              totalBooks: statsData.stats.totalBooks || 0,
              totalUsers: statsData.stats.totalUsers || 0,
              activeBorrowings: statsData.stats.booksIssued || 0,
              overdueBooks: statsData.stats.overdueBooks || 0,
              totalFines: statsData.stats.totalFines || 0,
              paidFines: 0
            },
            topBooks: [],
            topBorrowers: [],
            monthlyStats: [],
            genreDistribution: []
          })
        }
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'csv' | 'pdf') => {
    // This would typically call an API endpoint to generate and download reports
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Failed to load report data</div>
          <Button onClick={fetchReportData}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="mt-2 text-gray-600">Comprehensive library system analytics</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="last-year">Last Year</option>
          </select>
          <Button variant="secondary" onClick={() => exportReport('csv')}>
            📊 Export CSV
          </Button>
          <Button variant="secondary" onClick={() => exportReport('pdf')}>
            📄 Export PDF
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{reportData.overview.totalBooks}</div>
            <div className="text-sm text-gray-600">Total Books</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{reportData.overview.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{reportData.overview.activeBorrowings}</div>
            <div className="text-sm text-gray-600">Active Borrowings</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{reportData.overview.overdueBooks}</div>
            <div className="text-sm text-gray-600">Overdue Books</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${reportData.overview.totalFines}</div>
            <div className="text-sm text-gray-600">Total Fines</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">${reportData.overview.paidFines}</div>
            <div className="text-sm text-gray-600">Paid Fines</div>
          </div>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📚 Most Popular Books</h2>
          {reportData.topBooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No borrowing data available for this period
            </div>
          ) : (
            <div className="space-y-3">
              {reportData.topBooks.slice(0, 10).map((book, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">by {book.author}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-600">{book.borrowCount}</div>
                    <div className="text-xs text-gray-500">borrows</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Borrowers */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">👥 Most Active Borrowers</h2>
          {reportData.topBorrowers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No borrower data available for this period
            </div>
          ) : (
            <div className="space-y-3">
              {reportData.topBorrowers.slice(0, 10).map((borrower, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium text-gray-900">{borrower.name}</div>
                    <div className="text-sm text-gray-500">{borrower.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{borrower.borrowCount}</div>
                    <div className="text-xs text-gray-500">books</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Genre Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📖 Genre Distribution</h2>
          {reportData.genreDistribution.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No genre data available
            </div>
          ) : (
            <div className="space-y-3">
              {reportData.genreDistribution.map((genre, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{genre.genre}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (genre.count / Math.max(...reportData.genreDistribution.map(g => g.count))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{genre.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Monthly Trends */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📈 Monthly Trends</h2>
          {reportData.monthlyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No trend data available for this period
            </div>
          ) : (
            <div className="space-y-3">
              {reportData.monthlyStats.map((stat, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-2 border-b">
                  <div className="font-medium text-gray-900">{stat.month}</div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{stat.borrowings}</div>
                    <div className="text-xs text-gray-500">borrows</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{stat.returns}</div>
                    <div className="text-xs text-gray-500">returns</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">{stat.newUsers}</div>
                    <div className="text-xs text-gray-500">new users</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Additional Reports */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Additional Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => alert('Overdue Books Report')}
          >
            <span className="text-2xl">⚠️</span>
            <span>Overdue Books</span>
          </Button>
          <Button 
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => alert('Fines Report')}
          >
            <span className="text-2xl">💰</span>
            <span>Fines Report</span>
          </Button>
          <Button 
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => alert('User Activity Report')}
          >
            <span className="text-2xl">📊</span>
            <span>User Activity</span>
          </Button>
          <Button 
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => alert('Inventory Report')}
          >
            <span className="text-2xl">📦</span>
            <span>Inventory Report</span>
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="primary"
            onClick={() => fetchReportData()}
          >
            🔄 Refresh Data
          </Button>
          <Button 
            variant="secondary"
            onClick={() => alert('Scheduling automated reports...')}
          >
            ⏰ Schedule Reports
          </Button>
          <Button 
            variant="secondary"
            onClick={() => alert('Configuring report settings...')}
          >
            ⚙️ Report Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}