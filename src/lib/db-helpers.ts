import prisma from './database'
import { UserRole, BookStatus, BorrowStatus } from '../types/index'

// User helper functions
export async function createUser(data: {
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
  address?: string
}) {
  return await prisma.user.create({
    data: {
      ...data,
      role: data.role.toString()
    }
  })
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true
    }
  })
}

// Book helper functions
export async function createBook(data: {
  title: string
  author: string
  isbn: string
  category: string
  publisher?: string
  publishedYear?: number
  description?: string
  totalCopies?: number
  location?: string
}) {
  return await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      category: data.category,
      publisher: data.publisher,
      publishedYear: data.publishedYear,
      description: data.description,
      totalCopies: data.totalCopies || 1,
      availableCopies: data.totalCopies || 1,
      location: data.location,
      status: 'AVAILABLE'
    }
  })
}

export async function findBookByISBN(isbn: string) {
  return await prisma.book.findUnique({
    where: { isbn }
  })
}

// export async function searchBooks(filters: {
//   title?: string
//   author?: string
//   category?: string
//   status?: BookStatus
// }) {
//   const where: any = {}
  
//   if (filters.title) {
//     where.title = { contains: filters.title, mode: 'insensitive' }
//   }
//   if (filters.author) {
//     where.author = { contains: filters.author, mode: 'insensitive' }
//   }
//   if (filters.category) {
//     where.category = { contains: filters.category, mode: 'insensitive' }
//   }
//   if (filters.status) {
//     where.status = filters.status
//   }
  
//   return await prisma.book.findMany({ 
//     where,
//     orderBy: { createdAt: 'desc' }
//   })
// }

export async function searchBooks({
  title,
  author,
  category,
}: {
  title?: string;
  author?: string;
  category?: string;
}) {    
  return await prisma.book.findMany({
    where: {
      AND: [
        title ? { title: { contains: title, mode: 'insensitive' } } : {},
        author ? { author: { contains: author, mode: 'insensitive' } } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {},
      ]
    }
  })
}


// Universal search function that searches across title, author, category, and ISBN
export async function searchBooksUniversal(query: string) {
  return await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { isbn: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getAllBooks() {
  return await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// Borrowing helper functions
export async function borrowBook(bookId: string, userId: string, dueDate: Date) {
  // Check if book is available
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book || book.availableCopies <= 0) {
    throw new Error('Book is not available')
  }
  
  // Create borrowing record
  const borrowing = await prisma.borrowing.create({
    data: {
      bookId,
      userId,
      dueDate,
      status: 'ACTIVE'
    }
  })
  
  // Update book availability
  await prisma.book.update({
    where: { id: bookId },
    data: { availableCopies: book.availableCopies - 1 }
  })
  
  return borrowing
}

export async function returnBook(borrowingId: string) {
  const borrowing = await prisma.borrowing.findUnique({
    where: { id: borrowingId },
    include: { book: true }
  })
  
  if (!borrowing) {
    throw new Error('Borrowing record not found')
  }
  
  // Update borrowing record
  await prisma.borrowing.update({
    where: { id: borrowingId },
    data: {
      returnedAt: new Date(),
      status: 'RETURNED'
    }
  })
  
  // Update book availability
  await prisma.book.update({
    where: { id: borrowing.bookId },
    data: { availableCopies: borrowing.book.availableCopies + 1 }
  })
  
  return true
}

export async function getActiveBorrowings() {
  return await prisma.borrowing.findMany({
    where: { status: 'ACTIVE' },
    include: {
      book: { select: { title: true, author: true } },
      user: { select: { name: true, email: true } }
    }
  })
}

export async function getOverdueBooks() {
  return await prisma.borrowing.findMany({
    where: {
      status: 'ACTIVE',
      dueDate: { lt: new Date() }
    },
    include: {
      book: { select: { title: true, author: true } },
      user: { select: { name: true, email: true } }
    }
  })
}

// Simple statistics
export async function getLibraryStats() {
  const [totalBooks, totalUsers, booksIssued, overdueBooks] = await Promise.all([
    prisma.book.count(),
    prisma.user.count({ where: { role: 'PATRON' } }),
    prisma.borrowing.count({ where: { status: 'ACTIVE' } }),
    prisma.borrowing.count({
      where: {
        status: 'ACTIVE',
        dueDate: { lt: new Date() }
      }
    })
  ])
  
  return {
    totalBooks,
    totalUsers,
    booksIssued,
    overdueBooks,
    totalFines: 0 // Will implement later
  }
}