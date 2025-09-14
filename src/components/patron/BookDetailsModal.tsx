'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Book } from '@/types/patron'

interface BookDetailsModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onRequestBook: (bookId: string) => void
  requestStatus?: string | null
}

export default function BookDetailsModal({ 
  book, 
  isOpen, 
  onClose, 
  onRequestBook, 
  requestStatus 
}: BookDetailsModalProps) {
  if (!isOpen || !book) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            <p className="text-lg text-gray-700">by {book.author}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Category:</span> {book.category}</div>
              <div><span className="font-medium">ISBN:</span> {book.isbn}</div>
              {book.publisher && (
                <div><span className="font-medium">Publisher:</span> {book.publisher}</div>
              )}
              {book.publicationYear && (
                <div><span className="font-medium">Year:</span> {book.publicationYear}</div>
              )}
              <div><span className="font-medium">Total Copies:</span> {book.totalCopies}</div>
              <div><span className="font-medium">Available:</span> {book.availableCopies}</div>
              {book.location && (
                <div><span className="font-medium">Location:</span> {book.location}</div>
              )}
            </div>
            
            {book.description && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                onRequestBook(book.id)
                onClose()
              }}
              disabled={book.availableCopies === 0 || requestStatus === 'PENDING'}
              className="flex-1"
            >
              {requestStatus === 'PENDING' ? 'Already Requested' : 'Request Book'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}