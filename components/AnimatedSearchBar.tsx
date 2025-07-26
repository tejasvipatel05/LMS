'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Sparkles, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AnimatedSearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  isFilterOpen: boolean;
}

export default function AnimatedSearchBar({ onSearch, onFilterToggle, isFilterOpen }: AnimatedSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchQuery);
      setIsTyping(false);
    }, 300);

    if (searchQuery) {
      setIsTyping(true);
    }

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    if (isFocused) {
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    }
  }, [isFocused]);

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div 
        ref={searchRef}
        className={`relative transition-all duration-500 ${
          isFocused ? 'scale-105 rotate-1' : ''
        }`}
      >
        {/* Magical Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 animate-pulse blur-sm" />
        </div>

        {/* Floating Particles */}
        {isFocused && particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float 3s ease-in-out infinite ${particle.id * 0.5}s`
            }}
          >
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
          </div>
        ))}

        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className={`h-6 w-6 transition-all duration-300 ${
              isFocused ? 'text-blue-500 scale-110' : 'text-gray-400'
            } ${isTyping ? 'animate-spin' : ''}`} />
          </div>
          
          <Input
            type="text"
            placeholder="🔍 Search for magical books, wise authors, or mystical ISBN..."
            className="w-full pl-16 pr-24 py-6 text-lg border-0 rounded-2xl bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              size="sm"
              onClick={onFilterToggle}
              className={`transition-all duration-300 hover:scale-110 ${
                isFilterOpen 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-pulse' 
                  : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-gray-300'
              }`}
            >
              <Filter className={`h-4 w-4 ${isFilterOpen ? 'animate-spin' : ''}`} />
              <Zap className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/30 z-20 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                🔮 Searching for "<span className="font-bold text-blue-600">{searchQuery}</span>"
              </div>
              {isTyping && (
                <div className="flex items-center text-blue-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-xs">Casting spell...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}