import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get borrowing ID from request
    const { borrowingId } = await request.json()
    if (!borrowingId) {
      return NextResponse.json(
        { error: 'Borrowing ID is required' },
        { status: 400 }
      )
    }

    // Fetch borrowing record with related data
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: borrowingId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        book: {
          select: { id: true, title: true, author: true }
        },
        fines: {
          where: { isPaid: false }
        }
      }
    })

    // Check if borrowing exists
    if (!borrowing) {
      return NextResponse.json(
        { error: 'Borrowing record not found' },
        { status: 404 }
      )
    }

    // Check if book is already returned
    if (borrowing.returnedAt) {
      return NextResponse.json(
        { error: 'Cannot renew a returned book' },
        { status: 400 }
      )
    }

    // Check if user has permission to renew
    if (user.role === 'PATRON' && borrowing.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only renew your own borrowings' },
        { status: 403 }
      )
    }

    // Check if there are unpaid fines
    if (borrowing.fines.length > 0) {
      return NextResponse.json(
        { error: 'Please clear any outstanding fines before renewing' },
        { status: 400 }
      )
    }

    // Check if book is overdue
    const now = new Date()
    if (borrowing.dueDate < now) {
      return NextResponse.json(
        { error: 'Overdue books cannot be renewed. Please return the book and clear any fines first.' },
        { status: 400 }
      )
    }

    // Check renewal count
    const MAX_RENEWALS = 2
    if (borrowing.renewalCount >= MAX_RENEWALS) {
      return NextResponse.json(
        { error: `Maximum number of renewals (${MAX_RENEWALS}) reached` },
        { status: 400 }
      )
    }

    // Calculate new due date (14 days from current due date)
    const RENEWAL_DAYS = 14
    const newDueDate = new Date(borrowing.dueDate)
    newDueDate.setDate(newDueDate.getDate() + RENEWAL_DAYS)

    // Update the borrowing record
    const updatedBorrowing = await prisma.borrowing.update({
      where: { id: borrowingId },
      data: {
        dueDate: newDueDate,
        renewalCount: borrowing.renewalCount + 1
      },
      include: {
        book: {
          select: { title: true, author: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      message: 'Book renewed successfully',
      borrowing: updatedBorrowing,
      newDueDate
    })

  } catch (error) {
    console.error('Renew borrowing error:', error)
    return NextResponse.json(
      { error: 'Failed to renew borrowing' },
      { status: 500 }
    )
  }
}