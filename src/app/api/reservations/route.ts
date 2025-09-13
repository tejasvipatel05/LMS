import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { getUserFromRequest } from '@/middleware/auth'
import prisma from '@/lib/database'

// GET - Get all reservations (for librarian/admin) or user's reservations (for patron)
export const GET = requireAuth(async (req: NextRequest) => {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let reservations

    if (user.role === 'PATRON') {
      // Patrons can only see their own reservations
      reservations = await prisma.reservation.findMany({
        where: { userId: user.userId },
        include: {
          book: {
            select: {
              title: true,
              author: true,
              isbn: true
            }
          }
        },
        orderBy: { reservedAt: 'desc' }
      })
    } else {
      // Librarians and Admins can see all reservations
      reservations = await prisma.reservation.findMany({
        include: {
          book: {
            select: {
              title: true,
              author: true,
              isbn: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { reservedAt: 'desc' }
      })
    }

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error('Failed to fetch reservations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    )
  }
})

// POST - Create a new borrow request (reservation)
export const POST = requireAuth(async (req: NextRequest) => {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookId, notes } = await req.json()

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Check if user already has an active reservation for this book
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId: user.userId,
        bookId: bookId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    })

    if (existingReservation) {
      return NextResponse.json(
        { error: 'You already have an active request for this book' },
        { status: 400 }
      )
    }

    // Check if user already has this book borrowed
    const existingBorrowing = await prisma.borrowing.findFirst({
      where: {
        userId: user.userId,
        bookId: bookId,
        status: 'ACTIVE'
      }
    })

    if (existingBorrowing) {
      return NextResponse.json(
        { error: 'You already have this book borrowed' },
        { status: 400 }
      )
    }

    // Set expiration date (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create reservation/request
    const reservation = await prisma.reservation.create({
      data: {
        bookId,
        userId: user.userId,
        expiresAt,
        status: 'PENDING',
        type: 'REQUEST',
        notes: notes || null
      },
      include: {
        book: {
          select: {
            title: true,
            author: true,
            isbn: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Borrow request submitted successfully',
      reservation
    })
  } catch (error) {
    console.error('Failed to create reservation:', error)
    return NextResponse.json(
      { error: 'Failed to create borrow request' },
      { status: 500 }
    )
  }
})