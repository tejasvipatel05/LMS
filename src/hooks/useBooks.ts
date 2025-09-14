import { useState, useEffect } from 'react'
import { Book, BorrowRequest } from '@/types/patron'

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(null)
      } else {
        throw new Error('Failed to fetch books')
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
      setError('Failed to load books')
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
        setError(null)
      } else {
        throw new Error('Failed to fetch borrow requests')
      }
    } catch (error) {
      console.error('Failed to fetch borrow requests:', error)
      setError('Failed to load borrow requests')
    }
  }

  const requestBook = async (bookId: string, notes?: string) => {
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
          notes: notes || 'Request to borrow this book'
        })
      })
      
      if (response.ok) {
        await fetchBorrowRequests()
        return { success: true, message: 'Borrow request submitted successfully!' }
      } else {
        const error = await response.json()
        return { success: false, message: error.error || 'Failed to submit borrow request' }
      }
    } catch (error) {
      console.error('Failed to submit borrow request:', error)
      return { success: false, message: 'Failed to submit borrow request' }
    }
  }

  const getBookRequestStatus = (bookTitle: string) => {
    const request = borrowRequests.find(r => r.book?.title === bookTitle)
    return request ? request.status : null
  }

  useEffect(() => {
    fetchBooks()
    fetchBorrowRequests()
  }, [])

  return {
    books,
    borrowRequests,
    loading,
    error,
    fetchBooks,
    fetchBorrowRequests,
    requestBook,
    getBookRequestStatus
  }
}