import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'

// Renew a borrowing
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { borrowingId } = await req.json()
    
    if (!borrowingId) {
      return NextResponse.json(
        { error: 'Borrowing ID is required' },
        { status: 400 }
      )
    }
    
    // Find the borrowing
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: borrowingId },
      include: {
        user: {
          select: { name: true, email: true }
        },
        book: {
          select: { title: true, author: true }
        }
      }
    })
    
    if (!borrowing) {
      return NextResponse.json(
        { error: 'Borrowing not found' },
        { status: 404 }
      )
    }
    
    // Check if book is already returned
    if (borrowing.returnDate) {
      return NextResponse.json(
        { error: 'Cannot renew a returned book' },
        { status: 400 }
      )
    }
    
    // Check permissions - users can only renew their own borrowings unless they're staff
    if (user.role === 'PATRON' && borrowing.userId !== user.userId) {
      return NextResponse.json(
        { error: 'You can only renew your own borrowings' },
        { status: 403 }
      )
    }
    
    // Check if renewal limit is reached (max 2 renewals)
    if (borrowing.renewalCount >= 2) {
      return NextResponse.json(
        { error: 'Maximum renewal limit reached (2 renewals)' },
        { status: 400 }
      )
    }
    
    // Calculate new due date (add 14 days from current due date)
    const newDueDate = new Date(borrowing.dueDate)
    newDueDate.setDate(newDueDate.getDate() + 14)
    
    // Update the borrowing
    const renewedBorrowing = await prisma.borrowing.update({
      where: { id: borrowingId },
      data: {
        dueDate: newDueDate,
        renewalCount: borrowing.renewalCount + 1
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        book: {
          select: { title: true, author: true, isbn: true }
        }
      }
    })
    
    return NextResponse.json({
      message: 'Book renewed successfully',
      borrowing: renewedBorrowing,
      newDueDate: newDueDate.toISOString(),
      renewalsRemaining: 2 - renewedBorrowing.renewalCount
    })
    
  } catch (error) {
    console.error('Renew borrowing error:', error)
    return NextResponse.json(
      { error: 'Failed to renew borrowing' },
      { status: 500 }
    )
  }
}