import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    let borrowings
    
    if (user.role === 'PATRON') {
      // Patrons can only see their own borrowings
      borrowings = await prisma.borrowing.findMany({
        where: {
          userId: user.id,
          returnedAt: null // Only show active borrowings by default
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              availableCopies: true,
              totalCopies: true
            }
          },
          fines: {
            where: {
              isPaid: false // Only show unpaid fines
            },
            select: {
              id: true,
              amount: true,
              isPaid: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          borrowedAt: 'desc'
        }
      })
    } else {
      // Librarians and admins can see all borrowings
      borrowings = await prisma.borrowing.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              availableCopies: true,
              totalCopies: true
            }
          },
          fines: {
            select: {
              id: true,
              amount: true,
              isPaid: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          borrowedAt: 'desc'
        }
      })
    }
    
    return NextResponse.json(borrowings)
    
  } catch (error) {
    console.error('Get borrowings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch borrowings' },
      { status: 500 }
    )
  }
}

// Create a new borrowing
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

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }

    // Only librarians and admins can borrow books for others
    const borrowerUserId = (user.role === 'ADMIN' || user.role === 'LIBRARIAN') && userId ? userId : user.id

    // Check if user has active borrowings of this book
    const existingBorrowing = await prisma.borrowing.findFirst({
      where: {
        bookId,
        userId: borrowerUserId,
        returnedAt: null
      }
    })

    if (existingBorrowing) {
      return NextResponse.json(
        { error: 'User already has an active borrowing for this book' },
        { status: 400 }
      )
    }

    // Check if book is available
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.availableCopies < 1) {
      return NextResponse.json(
        { error: 'No copies available for borrowing' },
        { status: 400 }
      )
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Create borrowing record and update book copies in a transaction
    const [borrowing] = await prisma.$transaction([
      prisma.borrowing.create({
        data: {
          userId: borrowerUserId,
          bookId,
          dueDate,
          status: 'ACTIVE',
          renewalCount: 0
        },
        include: {
          book: {
            select: {
              title: true,
              author: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.book.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1
          }
        }
      })
    ])

    return NextResponse.json({
      message: 'Book borrowed successfully',
      borrowing
    })

  } catch (error) {
    console.error('Create borrowing error:', error)
    return NextResponse.json(
      { error: 'Failed to create borrowing' },
      { status: 500 }
    )
  }
}