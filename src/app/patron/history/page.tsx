'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import BorrowingCard from '@/components/patron/BorrowingCard'
import { useBorrowing } from '@/hooks/useBorrowing'
import { Borrowing } from '@/types/patron'

export default function HistoryPage() {
  const { borrowings, loading, error, getBorrowingHistory } = useBorrowing()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'borrowedAt' | 'dueDate' | 'returnedAt'>('borrowedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filterAndSortHistory = () => {
    let filtered = getBorrowingHistory()

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(borrowing =>
        borrowing.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.book.isbn.includes(searchTerm)
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(borrowing => borrowing.status === filterStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: Date
      let bValue: Date

      switch (sortBy) {
        case 'borrowedAt':
          aValue = new Date(a.borrowedAt)
          bValue = new Date(b.borrowedAt)
          break
        case 'dueDate':
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case 'returnedAt':
          aValue = a.returnedAt ? new Date(a.returnedAt) : new Date(0)
          bValue = b.returnedAt ? new Date(b.returnedAt) : new Date(0)
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue.getTime() - bValue.getTime()
      } else {
        return bValue.getTime() - aValue.getTime()
      }
    })

    return filtered
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-500">
          <p className="text-lg mb-2">Error loading history</p>
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  const filteredHistory = filterAndSortHistory()
  const totalBorrowings = borrowings.length
  const returnedBorrowings = borrowings.filter(b => b.status === 'RETURNED').length
  const activeBorrowings = borrowings.filter(b => b.status === 'ACTIVE').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reading History</h1>
        <p className="mt-2 text-gray-600">View your complete borrowing history</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalBorrowings}</div>
            <div className="text-sm text-gray-600">Total Borrowed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{returnedBorrowings}</div>
            <div className="text-sm text-gray-600">Returned</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{activeBorrowings}</div>
            <div className="text-sm text-gray-600">Currently Borrowed</div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by book title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Currently Borrowed</option>
              <option value="RETURNED">Returned</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'borrowedAt' | 'dueDate' | 'returnedAt')}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="borrowedAt">Borrowed Date</option>
                <option value="dueDate">Due Date</option>
                <option value="returnedAt">Return Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredHistory.length} record(s) found
            </div>
          </div>
        </div>
      </Card>

      {/* History List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrowing History</h2>
        
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((borrowing) => (
              <BorrowingCard
                key={borrowing.id}
                borrowing={borrowing}
                showRenewButton={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'No records match your search criteria'
                : 'No borrowing history yet'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}