export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  totalCopies: number
  availableCopies: number
  status: string
  location?: string
  publicationYear?: number
  publisher?: string
}

export interface BorrowRequest {
  id: string
  reservedAt: string
  expiresAt: string
  status: string
  type: string
  notes?: string
  book: {
    title: string
    author: string
    isbn: string
  }
}

export interface Borrowing {
  id: string
  borrowedAt: string
  dueDate: string
  returnedAt?: string
  status: string
  renewalCount?: number
  book: {
    id: string
    title: string
    author: string
    isbn: string
  }
}

export interface Fine {
  id: string
  amount: number
  reason: string
  status: string
  createdAt: string
  paidAt?: string
  borrowing: {
    id: string
    book: {
      title: string
      author: string
    }
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  address?: string
  membershipDate: string
}