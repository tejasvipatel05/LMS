import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/middleware/auth'
import { getUserFromRequest } from '@/middleware/auth'
import prisma from '@/lib/database'

// PATCH - Approve or reject a borrow request (Librarian/Admin only)
export const PATCH = requireRole('LIBRARIAN')(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, notes } = await req.json() // action: 'approve' or 'reject'
    const reservationId = params.id

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid action (approve/reject) is required' },
        { status: 400 }
      )
    }

    // Find the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        book: true,
        user: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    if (reservation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending requests can be processed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Check if book is still available
      if (reservation.book.availableCopies <= 0) {
        return NextResponse.json(
          { error: 'Book is no longer available' },
          { status: 400 }
        )
      }

      // Calculate due date (14 days from now)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)

      // Create borrowing record
      const borrowing = await prisma.borrowing.create({
        data: {
          bookId: reservation.bookId,
          userId: reservation.userId,
          dueDate,
          status: 'ACTIVE'
        }
      })

      // Update book availability
      await prisma.book.update({
        where: { id: reservation.bookId },
        data: { 
          availableCopies: reservation.book.availableCopies - 1 
        }
      })

      // Update reservation status
      await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'FULFILLED',
          approvedBy: user.userId,
          approvedAt: new Date(),
          notes: notes || null
        }
      })

      return NextResponse.json({
        message: 'Borrow request approved and book issued successfully',
        borrowing
      })

    } else if (action === 'reject') {
      // Update reservation status
      await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'REJECTED',
          approvedBy: user.userId,
          approvedAt: new Date(),
          notes: notes || null
        }
      })

      return NextResponse.json({
        message: 'Borrow request rejected successfully'
      })
    }

  } catch (error) {
    console.error('Failed to process reservation:', error)
    return NextResponse.json(
      { error: 'Failed to process borrow request' },
      { status: 500 }
    )
  }
})