'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import BookCard from '@/components/patron/BookCard'
import BookDetailsModal from '@/components/patron/BookDetailsModal'
import BookSearchFilter from '@/components/patron/BookSearchFilter'
import { useBooks } from '@/hooks/useBooks'
import { filterBooks, sortBooks, getUniqueCategories } from '@/utils/bookUtils'
import { Book } from '@/types/patron'

export default function BrowseBooksPage() {
  const { books, loading, error, requestBook, getBookRequestStatus } = useBooks()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const handleRequestBook = async (bookId: string) => {
    const result = await requestBook(bookId)
    if (result.success) {
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  const filteredBooks = filterBooks(books, searchTerm, selectedCategory, showAvailableOnly)
  const sortedBooks = sortBooks(filteredBooks, sortBy, sortOrder)
  const categories = getUniqueCategories(books)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-500">
          <p className="text-lg mb-2">Error loading books</p>
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
        <p className="mt-2 text-gray-600">Discover and request books from our collection</p>
      </div>

      {/* Search and Filter Controls */}
      <BookSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        showAvailableOnly={showAvailableOnly}
        onAvailableOnlyChange={setShowAvailableOnly}
        resultsCount={sortedBooks.length}
      />

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onRequestBook={handleRequestBook}
            onViewDetails={setSelectedBook}
            requestStatus={getBookRequestStatus(book.title)}
          />
        ))}
      </div>

      {sortedBooks.length === 0 && (
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">No books found</p>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        </Card>
      )}

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onRequestBook={handleRequestBook}
        requestStatus={selectedBook ? getBookRequestStatus(selectedBook.title) : null}
      />
    </div>
  )
}
