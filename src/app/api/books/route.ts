import { NextRequest, NextResponse } from 'next/server'
import { getAllBooks, createBook, searchBooks, searchBooksUniversal } from '@/lib/db-helpers'
import { getUserFromRequest } from '@/middleware/auth'

// Get all books or search books
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') // Universal search query
    const title = searchParams.get('title')
    const author = searchParams.get('author')
    const category = searchParams.get('category')
    
    let books
    
    // If we have a universal search query, search across all fields
    if (query) {
      books = await searchBooksUniversal(query)
    }
    // If we have specific search parameters, use targeted search
    else if (title || author || category) {
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
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can add books' },
        { status: 403 }
      )
    }

    const bookData = await req.json()

    // Basic validation - check for all required fields
    if (!bookData.title || !bookData.author || !bookData.isbn || !bookData.category) {
      return NextResponse.json(
        { error: 'Title, author, ISBN, and category are required' },
        { status: 400 }
      )
    }

    // Create the book with proper data structure
    const book = await createBook({
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      publishedYear: bookData.publishedYear,
      totalCopies: bookData.totalCopies || 1,
      location: bookData.location,
      description: bookData.description
    })

    return NextResponse.json({
      message: 'Book added successfully',
      book
    }, { status: 201 })

  } catch (error) {
    console.error('Add book error:', error)

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