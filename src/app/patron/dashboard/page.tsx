'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  totalCopies: number
  availableCopies: number
  status: string
}

interface Borrowing {
  id: string
  borrowedAt: string
  dueDate: string
  returnedAt?: string
  status: string
  book: {
    title: string
    author: string
  }
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
}

export default function PatronDashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchBooks()
    fetchBorrowings()
    fetchBorrowRequests()
  }, [])

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
    }
  }

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
        setBorrowings(data.borrowings || [])
      }
    } catch (error) {
      console.error('Failed to fetch borrowings:', error)
    } finally {
      setLoading(false)
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

  const handleRequestBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          bookId,
          notes: 'Request to borrow this book'
        })
      })
      
      if (response.ok) {
        await fetchBorrowRequests()
        alert('Borrow request submitted! Wait for librarian approval.')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit borrow request')
      }
    } catch (error) {
      console.error('Failed to submit borrow request:', error)
      alert('Failed to submit borrow request')
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    
    const matchesCategory = selectedCategory === '' || book.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const availableBooks = filteredBooks.filter(book => book.availableCopies > 0)
  const categories = [...new Set(books.map(book => book.category))]
  const activeBorrowings = borrowings.filter(b => b.status === 'ACTIVE')
  const overdueBorrowings = activeBorrowings.filter(b => new Date(b.dueDate) < new Date())
  const pendingRequests = borrowRequests.filter(r => r.status === 'PENDING')
  
  // Check if user has already requested a book
  const hasActiveRequest = (bookId: string) => {
    return borrowRequests.some(r => 
      r.status === 'PENDING' && 
      borrowRequests.find(req => req.id === r.id)?.book?.title
    )
  }
  
  // More specific: get book-specific request status
  const getBookRequestStatus = (bookTitle: string) => {
    const request = borrowRequests.find(r => r.book?.title === bookTitle)
    return request ? request.status : null
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Browse books and manage your reading</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Books</p>
              <p className="text-2xl font-bold text-gray-900">{availableBooks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📖</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Books Borrowed</p>
              <p className="text-2xl font-bold text-gray-900">{activeBorrowings.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{overdueBorrowings.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Browse */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Browse Books</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Book List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableBooks.length > 0 ? (
                availableBooks.map((book) => (
                  <div key={book.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-gray-600">by {book.author}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Category: {book.category} | ISBN: {book.isbn}
                        </p>
                        {book.description && (
                          <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                        )}
                        <p className="text-xs text-green-600 mt-2">
                          {book.availableCopies} copies available
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleRequestBook(book.id)}
                        disabled={book.availableCopies === 0 || getBookRequestStatus(book.title) === 'PENDING'}
                      >
                        {getBookRequestStatus(book.title) === 'PENDING' ? 'Requested' : 'Request'}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No books found matching your criteria</p>
              )}
            </div>
          </Card>
        </div>

        {/* Current Borrowings */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Borrowed Books</h2>
            
            {activeBorrowings.length > 0 ? (
              <div className="space-y-3">
                {activeBorrowings.map((borrowing) => (
                  <div key={borrowing.id} className="border rounded p-3">
                    <h3 className="font-medium text-sm">{borrowing.book.title}</h3>
                    <p className="text-xs text-gray-600">by {borrowing.book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                    </p>
                    {new Date(borrowing.dueDate) < new Date() && (
                      <p className="text-xs text-red-600 font-medium">OVERDUE</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No books currently borrowed</p>
            )}
          </Card>

          {/* Borrow Requests */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">My Borrow Requests</h2>
            
            {borrowRequests.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {borrowRequests.map((request) => (
                  <div key={request.id} className="border rounded p-3">
                    <h3 className="font-medium text-sm">{request.book.title}</h3>
                    <p className="text-xs text-gray-600">by {request.book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {new Date(request.reservedAt).toLocaleDateString()}
                    </p>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                      request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      request.status === 'FULFILLED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No borrow requests yet</p>
            )}
          </Card>

          {/* Reading History */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Reading History</h2>
            
            {borrowings.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {borrowings.slice(0, 5).map((borrowing) => (
                  <div key={borrowing.id} className="border-b pb-2">
                    <h3 className="font-medium text-sm">{borrowing.book.title}</h3>
                    <p className="text-xs text-gray-600">by {borrowing.book.author}</p>
                    <p className="text-xs text-gray-500">
                      Status: {borrowing.status}
                    </p>
                    {borrowing.returnedAt && (
                      <p className="text-xs text-green-600">
                        Returned: {new Date(borrowing.returnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No reading history yet</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}