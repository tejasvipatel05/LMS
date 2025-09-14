'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import BorrowingCard from '@/components/patron/BorrowingCard'
import BorrowingList from '@/components/patron/BorrowingList'
import { useBorrowing } from '@/hooks/useBorrowing'

export default function MyBooksPage() {
  const { 
    borrowings, 
    loading, 
    error, 
    renewBook,
    getActiveBorrowings,
    getOverdueBorrowings,
    getDueSoonBorrowings,
    getReturnedBorrowings
  } = useBorrowing()

  const [selectedTab, setSelectedTab] = useState<'active' | 'overdue' | 'history'>('active')
  const [renewalMessage, setRenewalMessage] = useState<string | null>(null)

  const handleRenew = async (borrowingId: string) => {
    const result = await renewBook(borrowingId)
    setRenewalMessage(result.message)
    
    // Clear message after 3 seconds
    setTimeout(() => setRenewalMessage(null), 3000)
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
          <p className="text-lg mb-2">Error loading borrowings</p>
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  const activeBorrowings = getActiveBorrowings()
  const overdueBorrowings = getOverdueBorrowings()
  const dueSoonBorrowings = getDueSoonBorrowings()
  const returnedBorrowings = getReturnedBorrowings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <p className="mt-2 text-gray-600">Manage your current and past borrowings</p>
      </div>

      {/* Renewal Message */}
      {renewalMessage && (
        <Card className="p-4 border-green-300 bg-green-50">
          <p className="text-green-800">{renewalMessage}</p>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeBorrowings.length}</div>
            <div className="text-sm text-gray-600">Active Borrowings</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{overdueBorrowings.length}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{dueSoonBorrowings.length}</div>
            <div className="text-sm text-gray-600">Due Soon</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{returnedBorrowings.length}</div>
            <div className="text-sm text-gray-600">Returned</div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setSelectedTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active ({activeBorrowings.length})
          </button>
          <button
            onClick={() => setSelectedTab('overdue')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'overdue'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overdue ({overdueBorrowings.length})
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'history'
                ? 'border-gray-500 text-gray-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History ({returnedBorrowings.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'active' && (
          <div>
            {overdueBorrowings.length > 0 && (
              <div className="mb-6">
                <BorrowingList
                  borrowings={overdueBorrowings}
                  title="Overdue Books (Action Required)"
                  emptyMessage="No overdue books"
                  onRenew={handleRenew}
                  showRenewButton={false}
                />
              </div>
            )}
            
            {dueSoonBorrowings.length > 0 && (
              <div className="mb-6">
                <BorrowingList
                  borrowings={dueSoonBorrowings}
                  title="Due Soon (Consider Renewal)"
                  emptyMessage="No books due soon"
                  onRenew={handleRenew}
                />
              </div>
            )}
            
            <BorrowingList
              borrowings={activeBorrowings.filter(b => 
                !overdueBorrowings.includes(b) && !dueSoonBorrowings.includes(b)
              )}
              title="Current Borrowings"
              emptyMessage="No active borrowings"
              onRenew={handleRenew}
            />
          </div>
        )}

        {selectedTab === 'overdue' && (
          <BorrowingList
            borrowings={overdueBorrowings}
            title="Overdue Books"
            emptyMessage="No overdue books! Great job staying on top of your returns."
            onRenew={handleRenew}
            showRenewButton={false}
          />
        )}

        {selectedTab === 'history' && (
          <BorrowingList
            borrowings={returnedBorrowings}
            title="Reading History"
            emptyMessage="No reading history yet"
            showRenewButton={false}
          />
        )}
      </div>
    </div>
  )
}