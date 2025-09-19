import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!data.author?.trim()) {
      return NextResponse.json(
        { error: 'Author is required' },
        { status: 400 }
      )
    }

    if (!data.isbn?.trim()) {
      return NextResponse.json(
        { error: 'ISBN is required' },
        { status: 400 }
      )
    }

    if (!data.category?.trim()) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (!Number.isInteger(data.totalCopies) || data.totalCopies < 1) {
      return NextResponse.json(
        { error: 'Total copies must be a positive whole number' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(data.publishedYear) || 
        data.publishedYear < 1000 || 
        data.publishedYear > new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'Published year must be a valid year' },
        { status: 400 }
      )
    }

    // Check if ISBN is already taken by another book
    const existingBook = await prisma.book.findFirst({
      where: {
        isbn: data.isbn,
        id: { not: params.id }
      }
    })

    if (existingBook) {
      return NextResponse.json(
        { error: 'ISBN is already in use by another book' },
        { status: 400 }
      )
    }

    // Get current book to check available copies
    const currentBook = await prisma.book.findUnique({
      where: { id: params.id },
      select: { totalCopies: true, availableCopies: true }
    })

    if (!currentBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Calculate new available copies based on the change in total copies
    const borrowedCopies = currentBook.totalCopies - currentBook.availableCopies
    const newAvailableCopies = Math.max(0, data.totalCopies - borrowedCopies)

    // Update the book
    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        totalCopies: data.totalCopies,
        availableCopies: newAvailableCopies,
        location: data.location,
        publishedYear: data.publishedYear,
        description: data.description || null
      }
    })

    return NextResponse.json({
      message: 'Book updated successfully',
      book: updatedBook
    })
    
  } catch (error) {
    console.error('Error updating book:', error)
    
    // Handle Prisma errors
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'ISBN must be unique' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}