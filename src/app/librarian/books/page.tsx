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
  totalCopies: number
  availableCopies: number
  status: string
  description?: string
  publisher?: string
  publishedYear?: number
  location?: string
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBooks()
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
    } finally {
      setLoading(false)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
        <p className="mt-2 text-gray-600">Manage your library's book collection</p>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Book Catalog ({books.length})</h2>
          <Button>
            📚 Add New Book
          </Button>
        </div>
        
        <Input
          placeholder="Search books by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4"
        />

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-gray-600">by {book.author}</p>
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <p>ISBN: {book.isbn} | Category: {book.category}</p>
                      <p>Available: {book.availableCopies}/{book.totalCopies}</p>
                      {book.location && <p>Location: {book.location}</p>}
                    </div>
                    {book.description && (
                      <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="secondary">
                      ✏️ Edit
                    </Button>
                    <Button size="sm" variant="primary">
                      👤 Issue
                    </Button>
                    <Button size="sm" variant="danger">
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No books found</p>
          )}
        </div>
      </Card>
    </div>
  )
}