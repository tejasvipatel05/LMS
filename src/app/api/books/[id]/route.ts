import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'

// Get a specific book
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        borrowings: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reservations: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ book })
    
  } catch (error) {
    console.error('Get book error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

// Update a book (librarians and admins only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only librarians and admins can update books
    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can update books' },
        { status: 403 }
      )
    }
    
    const updateData = await req.json()
    
    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id }
    })
    
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const dataToUpdate: any = {}
    
    if (updateData.title) {
      dataToUpdate.title = updateData.title
    }
    
    if (updateData.author) {
      dataToUpdate.author = updateData.author
    }
    
    if (updateData.isbn) {
      // Check if ISBN is already taken by another book
      const isbnExists = await prisma.book.findFirst({
        where: {
          isbn: updateData.isbn,
          id: { not: params.id }
        }
      })
      
      if (isbnExists) {
        return NextResponse.json(
          { error: 'ISBN already taken by another book' },
          { status: 400 }
        )
      }
      
      dataToUpdate.isbn = updateData.isbn
    }
    
    if (updateData.genre) {
      dataToUpdate.genre = updateData.genre
    }
    
    if (updateData.publishedYear !== undefined) {
      dataToUpdate.publishedYear = updateData.publishedYear
    }
    
    if (updateData.totalCopies !== undefined) {
      // Calculate new available copies based on the change in total copies
      const currentBorrowed = existingBook.totalCopies - existingBook.availableCopies
      const newAvailable = Math.max(0, updateData.totalCopies - currentBorrowed)
      
      dataToUpdate.totalCopies = updateData.totalCopies
      dataToUpdate.availableCopies = newAvailable
    }
    
    if (updateData.location) {
      dataToUpdate.location = updateData.location
    }
    
    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description
    }
    
    // Update the book
    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: dataToUpdate
    })
    
    return NextResponse.json({
      message: 'Book updated successfully',
      book: updatedBook
    })
    
  } catch (error) {
    console.error('Update book error:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

// Delete a book (librarians and admins only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only librarians and admins can delete books
    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can delete books' },
        { status: 403 }
      )
    }
    
    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        borrowings: true,
        reservations: true
      }
    })
    
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Check if book has active borrowings
    const activeBorrowings = existingBook.borrowings.filter(b => !b.returnDate)
    if (activeBorrowings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete book with active borrowings. Please return all copies first.' },
        { status: 400 }
      )
    }
    
    // Check if book has active reservations
    const activeReservations = existingBook.reservations.filter(r => !r.fulfilledAt && new Date(r.expiryDate) > new Date())
    if (activeReservations.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete book with active reservations. Please cancel reservations first.' },
        { status: 400 }
      )
    }
    
    // Delete book (this will cascade delete related records due to database constraints)
    await prisma.book.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({
      message: 'Book deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}