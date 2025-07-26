'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Bookmark, Star, Heart } from 'lucide-react';

const bookIcons = [BookOpen, Bookmark, Star, Heart];

interface FloatingBook {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  speed: number;
  icon: any;
  color: string;
}

export default function FloatingBooks() {
  const [books, setBooks] = useState<FloatingBook[]>([]);

  useEffect(() => {
    const colors = ['text-blue-400', 'text-purple-400', 'text-cyan-400', 'text-green-400', 'text-yellow-400'];
    
    const initialBooks = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      icon: bookIcons[Math.floor(Math.random() * bookIcons.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setBooks(initialBooks);

    const interval = setInterval(() => {
      setBooks(prevBooks =>
        prevBooks.map(book => ({
          ...book,
          y: book.y - book.speed,
          rotation: book.rotation + 0.5,
          x: book.x + Math.sin(book.y * 0.01) * 0.5,
          ...(book.y < -50 && {
            y: window.innerHeight + 50,
            x: Math.random() * window.innerWidth
          })
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {books.map(book => {
        const IconComponent = book.icon;
        return (
          <div
            key={book.id}
            className={`absolute ${book.color} transition-all duration-1000`}
            style={{
              left: `${book.x}px`,
              top: `${book.y}px`,
              transform: `rotate(${book.rotation}deg) scale(${book.scale})`,
              opacity: book.opacity
            }}
          >
            <IconComponent className="w-8 h-8" />
          </div>
        );
      })}
    </div>
  );
}