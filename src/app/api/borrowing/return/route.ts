import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'

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
    
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: borrowingId },
      include: {
        book: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!borrowing) {
      return NextResponse.json(
        { error: 'Borrowing record not found' },
        { status: 404 }
      )
    }

    if (borrowing.returnedAt) {
      return NextResponse.json(
        { error: 'Book has already been returned' },
        { status: 400 }
      )
    }

    // Calculate fine if book is overdue
    const dueDate = borrowing.dueDate
    const now = new Date()
    let fine = null

    if (dueDate < now) {
      const daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const fineAmount = daysOverdue * 0.50 // $0.50 per day overdue

      fine = await prisma.fine.create({
        data: {
          borrowingId: borrowing.id,
          userId: borrowing.userId,
          amount: fineAmount,
          isPaid: false
        }
      })
    }

    // Return the book
    const updatedBorrowing = await prisma.borrowing.update({
      where: { id: borrowingId },
      data: {
        returnedAt: now,
        status: 'RETURNED'
      }
    })

    // Update book available copies
    await prisma.book.update({
      where: { id: borrowing.bookId },
      data: {
        availableCopies: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      message: 'Book returned successfully',
      borrowing: updatedBorrowing,
      fine: fine
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