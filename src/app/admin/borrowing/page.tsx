'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Borrowing {
  id: string
  dueDate: string
  renewalCount: number
  returnDate?: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  book: {
    id: string
    title: string
    author: string
    isbn: string
  }
  fine?: {
    id: string
    amount: number
    isPaid: boolean
  }
}

export default function BorrowingPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchBorrowings()
  }, [])

  const fetchBorrowings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/borrowing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        setBorrowings(data || [])
      } else {
        console.error('Failed to fetch borrowings')
      }
    } catch (error) {
      console.error('Error fetching borrowings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturnBook = async (borrowingId: string) => {
    if (!confirm('Confirm book return?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/borrowing/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ borrowingId })
      })
      
      if (response.ok) {
        // Refresh the borrowings list
        fetchBorrowings()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to return book')
      }
    } catch (error) {
      console.error('Error returning book:', error)
      alert('Error returning book')
    }
  }

  const handleRenewBook = async (borrowingId: string) => {
    if (!confirm('Renew this borrowing?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/borrowing/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ borrowingId })
      })
      
      if (response.ok) {
        fetchBorrowings()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to renew book')
      }
    } catch (error) {
      console.error('Error renewing book:', error)
      alert('Error renewing book')
    }
  }

  const getStatusBadge = (borrowing: Borrowing) => {
    if (borrowing.returnDate) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Returned</span>
    }

    const dueDate = new Date(borrowing.dueDate)
    const today = new Date()
    
    if (dueDate < today) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>
    } else if (dueDate.getTime() - today.getTime() <= 3 * 24 * 60 * 60 * 1000) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Due Soon</span>
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
    }
  }

  const filteredBorrowings = borrowings.filter(borrowing => {
    const matchesSearch = 
      borrowing.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.book.isbn.includes(searchTerm)

    if (!matchesSearch) return false

    if (filterStatus === 'all') return true
    if (filterStatus === 'returned') return !!borrowing.returnDate
    if (filterStatus === 'active') return !borrowing.returnDate
    if (filterStatus === 'overdue') {
      return !borrowing.returnDate && new Date(borrowing.dueDate) < new Date()
    }

    return true
  })
  
  const stats = {
    total: borrowings.length,
    active: borrowings.filter(b => !b.returnDate).length,
    returned: borrowings.filter(b => !!b.returnDate).length,
    overdue: borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < new Date()).length
  }

  console.log(stats)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Borrowing Management</h1>
        <p className="mt-2 text-gray-600">Track all book borrowings and returns</p>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by user, book title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Borrowings</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button variant="secondary" onClick={fetchBorrowings}>
            🔄 Refresh
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Borrowings</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.returned}</div>
            <div className="text-sm text-gray-600">Returned</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </Card>
      </div>

      {/* Borrowings Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrowings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all' ? 'No borrowings found matching your criteria.' : 'No borrowings available.'}
                  </td>
                </tr>
              ) : (
                filteredBorrowings.map((borrowing) => (
                  <tr key={borrowing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{borrowing.user.name}</div>
                        <div className="text-sm text-gray-500">{borrowing.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{borrowing.book.title}</div>
                        <div className="text-sm text-gray-500">by {borrowing.book.author}</div>
                        <div className="text-xs text-gray-400">ISBN: {borrowing.book.isbn}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>Borrowed: {new Date(borrowing.createdAt).toLocaleDateString()}</div>
                        <div>Due: {new Date(borrowing.dueDate).toLocaleDateString()}</div>
                        {borrowing.returnDate && (
                          <div>Returned: {new Date(borrowing.returnDate).toLocaleDateString()}</div>
                        )}
                        <div className="text-xs text-gray-500">Renewals: {borrowing.renewalCount}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(borrowing)}
                        {borrowing.fine && (
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              borrowing.fine.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Fine: ${borrowing.fine.amount} {borrowing.fine.isPaid ? '(Paid)' : '(Unpaid)'}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!borrowing.returnDate && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleReturnBook(borrowing.id)}
                          >
                            📚 Return
                          </Button>
                          {borrowing.renewalCount < 2 && (
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleRenewBook(borrowing.id)}
                            >
                              🔄 Renew
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}