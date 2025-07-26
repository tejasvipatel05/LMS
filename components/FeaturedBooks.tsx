'use client';

import { useState, useEffect } from 'react';
import { Star, BookOpen, TrendingUp, Award, Zap, Crown, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { books } from '@/lib/books';

export default function FeaturedBooks() {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const featuredBooks = books.slice(0, 6);
  const trendingBooks = books.slice(0, 3);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending Books Section */}
        <Card className="mb-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -translate-y-32 translate-x-32" />
          
          <CardHeader className="relative z-10 text-center pb-8">
            <CardTitle className="flex items-center justify-center text-4xl mb-4">
              <TrendingUp className="w-10 h-10 mr-4 text-orange-500 animate-bounce" />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🔥 Trending This Week
              </span>
            </CardTitle>
            <p className="text-gray-600 text-lg">The most popular books among our magical community</p>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 relative overflow-hidden"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-20 h-28 object-cover rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600 font-medium mr-2">{book.rating}</span>
                        <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs border-0">
                          🔥 Hot
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        📖 {book.pages} pages • {book.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Books Grid */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Crown className="w-10 h-10 mr-4 text-purple-500 animate-pulse" />
            Featured Magical Tomes
          </h2>
          <p className="text-xl text-gray-600">Handpicked by our master librarians</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book, index) => (
            <Card
              key={book.id}
              className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden relative"
              onMouseEnter={() => setHoveredBook(book.id)}
              onMouseLeave={() => setHoveredBook(null)}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Magical Border Effect */}
              {hoveredBook === book.id && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 animate-pulse" />
              )}

              <div className="relative z-10">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={book.isAvailable ? "default" : "destructive"} 
                      className="text-xs backdrop-blur-md"
                    >
                      {book.isAvailable ? '✨ Available' : '🔒 Checked Out'}
                    </Badge>
                  </div>

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 hover:scale-110 transition-all duration-200">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Quick Action */}
                  <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                    hoveredBook === book.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {book.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3">{book.author}</p>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">{book.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({book.totalRatings})</span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {book.pages} pages
                    </Badge>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            Explore All Books
          </Button>
        </div>
      </div>
    </section>
  );
}