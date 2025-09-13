import { NextRequest, NextResponse } from 'next/server'
import { returnBook } from '@/lib/db-helpers'
import { getUserFromRequest } from '@/middleware/auth'

// Return a book
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only librarians and admins can process returns
    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can process book returns' },
        { status: 403 }
      )
    }
    
    const { borrowingId } = await req.json()
    
    // Basic validation
    if (!borrowingId) {
      return NextResponse.json(
        { error: 'Borrowing ID is required' },
        { status: 400 }
      )
    }
    
    await returnBook(borrowingId)
    
    return NextResponse.json({
      message: 'Book returned successfully'
    })
    
  } catch (error) {
    console.error('Return book error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    )
  }
}