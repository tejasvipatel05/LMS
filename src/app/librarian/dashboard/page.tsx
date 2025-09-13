'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LibraryStats {
  totalBooks: number
  totalUsers: number
  booksIssued: number
  overdueBooks: number
  totalFines: number
}

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  status: string
}

interface BorrowRequest {
  id: string
  reservedAt: string
  expiresAt: string
  status: string
  type: string
  notes?: string
  book: {
    title: string
    author: string
    isbn: string
  }
  user: {
    name: string
    email: string
  }
}

export default function LibrarianDashboard() {
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddBook, setShowAddBook] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [showReturns, setShowReturns] = useState(false)
  const [activeBorrowings, setActiveBorrowings] = useState<any[]>([])
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1
  })

  useEffect(() => {
    fetchStats()
    fetchBooks()
    fetchBorrowRequests()
    fetchActiveBorrowings()
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
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books || [])
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBook)
      })
      
      if (response.ok) {
        await fetchBooks()
        await fetchStats()
        setNewBook({ title: '', author: '', isbn: '', category: '', totalCopies: 1 })
        setShowAddBook(false)
      }
    } catch (error) {
      console.error('Failed to add book:', error)
    }
  }

  const fetchBorrowRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBorrowRequests(data.reservations || [])
      }
    } catch (error) {
      console.error('Failed to fetch borrow requests:', error)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'approve' })
      })
      
      if (response.ok) {
        await fetchBorrowRequests()
        await fetchStats()
        await fetchBooks()
        alert('Borrow request approved successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve request')
      }
    } catch (error) {
      console.error('Failed to approve request:', error)
      alert('Failed to approve request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'reject', notes: 'Request rejected by librarian' })
      })
      
      if (response.ok) {
        await fetchBorrowRequests()
        alert('Borrow request rejected successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to reject request')
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
      alert('Failed to reject request')
    }
  }

  const fetchActiveBorrowings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/borrowing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setActiveBorrowings(data.borrowings?.filter((b: any) => b.status === 'ACTIVE') || [])
      }
    } catch (error) {
      console.error('Failed to fetch active borrowings:', error)
    }
  }

  const handleReturnBook = async (borrowingId: string) => {
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
        await fetchActiveBorrowings()
        await fetchStats()
        await fetchBooks()
        alert('Book returned successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to return book')
      }
    } catch (error) {
      console.error('Failed to return book:', error)
      alert('Failed to return book')
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage books and circulation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Book Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Search and List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Book Catalog</h2>
              <Button onClick={() => setShowAddBook(true)}>
                📚 Add New Book
              </Button>
            </div>
            
            <div className="mb-4">
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div key={book.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                      <p className="text-xs text-gray-500">Available: {book.availableCopies}/{book.totalCopies}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">Edit</Button>
                      <Button size="sm" variant="primary">Issue</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No books found</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="primary"
                onClick={() => setShowRequests(true)}
              >
                📋 Borrow Requests ({borrowRequests.filter(r => r.status === 'PENDING').length})
              </Button>
              <Button className="w-full justify-start" variant="primary">
                🔄 Return Book
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                👤 View Borrowers
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                📊 Generate Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <Input
                label="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                required
              />
              <Input
                label="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                required
              />
              <Input
                label="ISBN"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                required
              />
              <Input
                label="Category"
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                required
              />
              <Input
                label="Total Copies"
                type="number"
                min="1"
                value={newBook.totalCopies}
                onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
                required
              />
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">Add Book</Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowAddBook(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Borrow Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-96 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pending Borrow Requests</h2>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowRequests(false)}
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {borrowRequests.filter(r => r.status === 'PENDING').length > 0 ? (
                  borrowRequests.filter(r => r.status === 'PENDING').map((request) => (
                    <div key={request.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{request.book.title}</h3>
                          <p className="text-gray-600">by {request.book.author}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Requested by: {request.user.name} ({request.user.email})
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(request.reservedAt).toLocaleDateString()}
                          </p>
                          {request.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              Note: {request.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending borrow requests</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
