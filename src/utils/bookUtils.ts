import { Book } from '@/types/patron'

export const filterBooks = (
  books: Book[],
  searchTerm: string,
  selectedCategory: string,
  showAvailableOnly: boolean
) => {
  return books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm) ||
      (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === '' || book.category === selectedCategory
    const matchesAvailability = !showAvailableOnly || book.availableCopies > 0
    
    return matchesSearch && matchesCategory && matchesAvailability
  })
}

export const sortBooks = (
  books: Book[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
) => {
  return books.sort((a, b) => {
    let aValue: any = a[sortBy as keyof Book]
    let bValue: any = b[sortBy as keyof Book]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
}

export const getUniqueCategories = (books: Book[]): string[] => {
  return [...new Set(books.map(book => book.category))]
}