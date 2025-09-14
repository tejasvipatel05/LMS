'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Book } from '@/types/patron'

interface BookCardProps {
  book: Book
  onRequestBook: (bookId: string) => void
  onViewDetails: (book: Book) => void
  requestStatus?: string | null
}

export default function BookCard({ book, onRequestBook, onViewDetails, requestStatus }: BookCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{book.title}</h3>
          <p className="text-gray-600">by {book.author}</p>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p><span className="font-medium">Category:</span> {book.category}</p>
          <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
          {book.publisher && (
            <p><span className="font-medium">Publisher:</span> {book.publisher}</p>
          )}
          {book.publicationYear && (
            <p><span className="font-medium">Year:</span> {book.publicationYear}</p>
          )}
          {book.location && (
            <p><span className="font-medium">Location:</span> {book.location}</p>
          )}
        </div>
        
        {book.description && (
          <p className="text-sm text-gray-700 line-clamp-3">{book.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className={`text-sm font-medium ${
            book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {book.availableCopies > 0 
              ? `${book.availableCopies} available` 
              : 'Not available'
            }
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(book)}
            >
              Details
            </Button>
            <Button 
              size="sm" 
              onClick={() => onRequestBook(book.id)}
              disabled={book.availableCopies === 0 || requestStatus === 'PENDING'}
            >
              {requestStatus === 'PENDING' ? 'Requested' : 'Request'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}