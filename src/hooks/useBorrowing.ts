import { useState, useEffect } from 'react'
import { Borrowing } from '@/types/patron'

interface BorrowingResponse {
  borrowings: Borrowing[]
}

export const useBorrowing = () => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBorrowings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/borrowing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data: BorrowingResponse = await response.json()
        setBorrowings(data.borrowings || [])
        setError(null)
      } else {
        throw new Error('Failed to fetch borrowings')
      }
    } catch (error) {
      console.error('Failed to fetch borrowings:', error)
      setError('Failed to load borrowings')
    } finally {
      setLoading(false)
    }
  }

  const renewBook = async (borrowingId: string) => {
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
        const data = await response.json()
        // Refresh borrowings to get updated data
        await fetchBorrowings()
        return { 
          success: true, 
          message: data.message,
          newDueDate: data.newDueDate,
          renewalsRemaining: data.renewalsRemaining
        }
      } else {
        const errorData = await response.json()
        return { success: false, message: errorData.error || 'Failed to renew book' }
      }
    } catch (error) {
      console.error('Failed to renew book:', error)
      return { success: false, message: 'Failed to renew book' }
    }
  }

  // Filter functions for different borrowing states
  const getActiveBorrowings = () => {
    return borrowings.filter(b => b.status === 'ACTIVE')
  }

  const getOverdueBorrowings = () => {
    const now = new Date()
    return borrowings.filter(b => 
      b.status === 'ACTIVE' && new Date(b.dueDate) < now
    )
  }

  const getDueSoonBorrowings = (days: number = 3) => {
    const now = new Date()
    const soonDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
    
    return borrowings.filter(b => 
      b.status === 'ACTIVE' && 
      new Date(b.dueDate) > now && 
      new Date(b.dueDate) <= soonDate
    )
  }

  const getReturnedBorrowings = () => {
    return borrowings.filter(b => b.status === 'RETURNED')
  }

  const getBorrowingHistory = () => {
    return borrowings.slice().sort((a, b) => 
      new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime()
    )
  }

  useEffect(() => {
    fetchBorrowings()
  }, [])

  return {
    borrowings,
    loading,
    error,
    fetchBorrowings,
    renewBook,
    getActiveBorrowings,
    getOverdueBorrowings,
    getDueSoonBorrowings,
    getReturnedBorrowings,
    getBorrowingHistory
  }
}