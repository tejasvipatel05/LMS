// User roles in the library system
export type UserRole = 'ADMIN' | 'LIBRARIAN' | 'PATRON'

// Book status options
export type BookStatus = 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'DAMAGED'

// Borrowing status
export type BorrowStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE'

// User interface - represents people using the library
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

// Book interface - represents books in the library
export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publisher?: string
  publishedYear?: number
  category: string
  description?: string
  totalCopies: number
  availableCopies: number
  status: BookStatus
  location?: string // shelf location
  createdAt: Date
  updatedAt: Date
}

// Borrowing interface - tracks who borrowed what book
export interface Borrowing {
  id: string
  bookId: string
  userId: string
  borrowedAt: Date
  dueDate: Date
  returnedAt?: Date
  status: BorrowStatus
  fineAmount?: number
  renewalCount: number
  notes?: string
}

// Fine interface - tracks overdue fines
export interface Fine {
  id: string
  userId: string
  borrowingId: string
  amount: number
  isPaid: boolean
  createdAt: Date
  paidAt?: Date
}

// Reservation interface - for holding books
export interface Reservation {
  id: string
  bookId: string
  userId: string
  reservedAt: Date
  expiresAt: Date
  isActive: boolean
}

// Simple search filters
export interface BookFilters {
  title?: string
  author?: string
  category?: string
  isbn?: string
  status?: BookStatus
}

// Dashboard statistics
export interface LibraryStats {
  totalBooks: number
  totalUsers: number
  booksIssued: number
  overdueBooks: number
  totalFines: number
}