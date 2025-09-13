import { NextRequest, NextResponse } from 'next/server'
import { getAllBooks, createBook, searchBooks } from '@/lib/db-helpers'
import { getUserFromRequest } from '@/middleware/auth'

// Get all books or search books
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')
    const author = searchParams.get('author')
    const category = searchParams.get('category')
    
    let books
    
    // If we have search parameters, use search function
    if (title || author || category) {
      books = await searchBooks({
        title: title || undefined,
        author: author || undefined,
        category: category || undefined
      })
    } else {
      // Otherwise get all books
      books = await getAllBooks()
    }
    
    return NextResponse.json({ books })
    
  } catch (error) {
    console.error('Get books error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// Add a new book (only librarians and admins)
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user has permission
    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can add books' },
        { status: 403 }
      )
    }
    
    const bookData = await req.json()
    
    // Basic validation
    if (!bookData.title || !bookData.author || !bookData.isbn || !bookData.category) {
      return NextResponse.json(
        { error: 'Title, author, ISBN, and category are required' },
        { status: 400 }
      )
    }
    
    // Create the book
    const book = await createBook(bookData)
    
    return NextResponse.json({
      message: 'Book added successfully',
      book
    }, { status: 201 })
    
  } catch (error) {
    console.error('Add book error:', error)
    
    // Handle duplicate ISBN
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A book with this ISBN already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    )
  }
}