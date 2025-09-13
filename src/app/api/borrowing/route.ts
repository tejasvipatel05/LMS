import { NextRequest, NextResponse } from 'next/server'
import { borrowBook, returnBook, getActiveBorrowings } from '@/lib/db-helpers'
import { getUserFromRequest } from '@/middleware/auth'

// Get all active borrowings (for librarians/admins)
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only librarians and admins can view all borrowings
    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can view all borrowings' },
        { status: 403 }
      )
    }
    
    const borrowings = await getActiveBorrowings()
    return NextResponse.json({ borrowings })
    
  } catch (error) {
    console.error('Get borrowings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch borrowings' },
      { status: 500 }
    )
  }
}

// Borrow a book
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { bookId, userId } = await req.json()
    
    // Basic validation
    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }
    
    // If no userId provided, use current user's ID (for patrons)
    const borrowerUserId = userId || user.userId
    
    // Only librarians/admins can borrow books for other users
    if (userId && user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can borrow books for other users' },
        { status: 403 }
      )
    }
    
    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)
    
    const borrowing = await borrowBook(bookId, borrowerUserId, dueDate)
    
    return NextResponse.json({
      message: 'Book borrowed successfully',
      borrowing
    }, { status: 201 })
    
  } catch (error) {
    console.error('Borrow book error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to borrow book' },
      { status: 500 }
    )
  }
}