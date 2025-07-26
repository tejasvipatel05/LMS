'use client';

import { X, Star, Calendar, BookOpen, User, Hash, Clock } from 'lucide-react';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
}

export default function BookModal({ book, isOpen, onClose, onCheckout, onToggleFavorite }: BookModalProps) {
  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 p-8 -mt-20 relative z-10">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <Badge variant={book.isAvailable ? "default" : "destructive"} className="mb-3">
                  {book.isAvailable ? 'Available' : 'Checked Out'}
                </Badge>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <User className="w-5 h-5 mr-2" />
                  {book.author}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold text-lg">{book.rating}</span>
                    <span className="text-gray-500 ml-1">({book.totalRatings} ratings)</span>
                  </div>
                </div>
              </div>

              {/* Book Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="text-sm">ISBN: {book.isbn}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Published: {book.publishedYear}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm">{book.pages} pages</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm capitalize">{book.category}</span>
                </div>
              </div>

              {/* Due Date */}
              {!book.isAvailable && book.dueDate && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-orange-700">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="font-medium">Due Date: {book.dueDate}</span>
                  </div>
                </div>
              )}

              {/* Reading Progress */}
              {book.readingProgress && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                    <span className="text-sm font-bold text-blue-600">{book.readingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${book.readingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {book.isAvailable && (
                  <Button
                    onClick={() => onCheckout(book.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Checkout Book
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => onToggleFavorite(book.id)}
                  className={`px-6 py-3 ${
                    book.isFavorite 
                      ? 'border-red-300 text-red-600 hover:bg-red-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{book.isFavorite ? '❤️' : '🤍'}</span>
                  {book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}