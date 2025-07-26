'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, BookOpen, Calendar, Star, User, Sparkles, Zap, Eye } from 'lucide-react';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MagicBookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
  onCheckout: (bookId: string) => void;
  index: number;
}

export default function MagicBookCard({ book, onBookClick, onToggleFavorite, onCheckout, index }: MagicBookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setSparkles(newSparkles);
    }
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`group relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-lg border border-white/20 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/25 cursor-pointer backdrop-blur-sm ${
        isHovered ? 'scale-105 rotate-1' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        background: isHovered 
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1), transparent 70%)`
          : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => onBookClick(book)}
    >
      {/* Magical Border Effect */}
      <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 animate-pulse" />
        <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm" />
      </div>

      {/* Sparkle Effects */}
      {isHovered && sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 animate-ping" />
        </div>
      ))}

      <div className="relative z-10">
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img
            src={book.coverUrl}
            alt={book.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110 brightness-110' : ''
            }`}
          />
          
          {/* Holographic Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`
          }} />
          
          {/* Floating Status Badge */}
          <div className={`absolute top-4 left-4 transition-all duration-500 ${
            isHovered ? 'scale-110 rotate-3' : ''
          }`}>
            <Badge 
              variant={book.isAvailable ? "default" : "destructive"} 
              className={`text-xs backdrop-blur-md ${
                book.isAvailable 
                  ? 'bg-green-500/80 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-red-500/80 text-white shadow-lg shadow-red-500/25'
              }`}
            >
              {book.isAvailable ? '✨ Available' : '🔒 Checked Out'}
            </Badge>
          </div>

          {/* Animated Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book.id);
            }}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
              book.isFavorite
                ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/25 scale-110'
                : 'bg-white/80 text-gray-700 hover:bg-red-500/80 hover:text-white hover:scale-110'
            } ${isHovered ? 'animate-bounce' : ''}`}
          >
            <Heart className={`w-5 h-5 ${book.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Magic Action Buttons */}
          <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {book.isAvailable && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckout(book.id);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Checkout
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onBookClick(book);
              }}
              className="bg-white/80 backdrop-blur-md hover:bg-white hover:scale-105 transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 relative">
          {/* Animated Title */}
          <h3 className={`font-bold text-xl text-gray-900 mb-2 line-clamp-2 transition-all duration-300 ${
            isHovered ? 'text-blue-600 scale-105' : ''
          }`}>
            {book.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{book.author}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {book.description}
          </p>

          {/* Animated Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}>
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-bold text-gray-700">{book.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({book.totalRatings})</span>
            </div>
            
            <div className={`text-sm text-gray-500 transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}>
              📖 {book.pages} pages
            </div>
          </div>

          {/* Due Date with Pulsing Effect */}
          {!book.isAvailable && book.dueDate && (
            <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl p-3 mb-4 animate-pulse">
              <div className="flex items-center text-orange-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Due: {book.dueDate}</span>
              </div>
            </div>
          )}

          {/* Animated Reading Progress */}
          {book.readingProgress && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 font-medium">📚 Reading Progress</span>
                <span className="text-xs font-bold text-blue-600">{book.readingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out ${
                    isHovered ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    width: `${book.readingProgress}%`,
                    boxShadow: isHovered ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}