'use client';

import { useState, useMemo, useEffect } from 'react';
import { BookOpen, TrendingUp, Star, Users, Sparkles, Zap, Crown, Award } from 'lucide-react';
import MagicBookCard from '@/components/MagicBookCard';
import AnimatedSearchBar from '@/components/AnimatedSearchBar';
import MagicalCategoryFilter from '@/components/MagicalCategoryFilter';
import BookModal from '@/components/BookModal';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingBooks from '@/components/FloatingBooks';
import Navbar from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedBooks from '@/components/FeaturedBooks';
import { books, categories } from '@/lib/books';
import { Book } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MagicalLibraryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookList, setBookList] = useState(books);
  const [isLoaded, setIsLoaded] = useState(false);
  const [magicParticles, setMagicParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setIsLoaded(true);
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setMagicParticles(particles);
  }, []);

  const filteredBooks = useMemo(() => {
    return bookList.filter(book => {
      const matchesSearch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [bookList, searchQuery, selectedCategory]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleToggleFavorite = (bookId: string) => {
    setBookList(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  const handleCheckout = (bookId: string) => {
    setBookList(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? { 
              ...book, 
              isAvailable: false, 
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
            }
          : book
      )
    );
    setIsModalOpen(false);
  };

  const stats = [
    { 
      title: 'Magical Tomes', 
      value: books.length, 
      icon: BookOpen, 
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      title: 'Available Spells', 
      value: books.filter(b => b.isAvailable).length, 
      icon: Star, 
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    { 
      title: 'Trending Magic', 
      value: 12, 
      icon: TrendingUp, 
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    },
    { 
      title: 'Active Wizards', 
      value: 342, 
      icon: Users, 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/95 to-purple-50/90" />
      </div>
      
      <ParticleBackground />
      <FloatingBooks />

      {/* Floating Magic Particles */}
      {magicParticles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse opacity-60" />
        </div>
      ))}

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative z-20">
        <HeroSection />
      </div>

      {/* Featured Books */}
      <div className="relative z-20">
        <FeaturedBooks />
      </div>

      <main className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Magical Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className={`relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-2 cursor-pointer group bg-gradient-to-br ${stat.bgGradient} border-0`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Magical Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-xl group-hover:animate-bounce`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Magical Search and Filter */}
        <div className="mb-10">
          <AnimatedSearchBar
            onSearch={setSearchQuery}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            isFilterOpen={isFilterOpen}
          />
          
          <MagicalCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isOpen={isFilterOpen}
          />
        </div>

        {/* Enchanted Books Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-purple-500 animate-pulse" />
              {selectedCategory === 'all' ? '🌟 All Magical Books' : `✨ ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              📚 Showing {filteredBooks.length} of {books.length} enchanted tomes
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <Card className="p-16 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-0 shadow-xl">
              <div className="text-gray-400 mb-6">
                <BookOpen className="w-20 h-20 mx-auto animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">🔮 No magical books found</h3>
              <p className="text-gray-500">The spell seems to have failed. Try adjusting your magical search criteria! ✨</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <MagicBookCard
                    book={book}
                    onBookClick={handleBookClick}
                    onToggleFavorite={handleToggleFavorite}
                    onCheckout={handleCheckout}
                    index={index}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Book Detail Modal */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCheckout={handleCheckout}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}