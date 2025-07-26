'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap, Star } from 'lucide-react';
import { Category } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface MagicalCategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isOpen: boolean;
}

export default function MagicalCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isOpen
}: MagicalCategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [magicParticles, setMagicParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setMagicParticles(particles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 animate-in slide-in-from-top-4 duration-500">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 overflow-hidden">
        {/* Magic Particles Background */}
        {magicParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          >
            <Star className="w-2 h-2 text-yellow-400 animate-ping opacity-30" />
          </div>
        ))}

        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
            <Sparkles className="mr-3 h-6 w-6 text-purple-500 animate-pulse" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Magical Categories
            </span>
            <Zap className="ml-3 h-6 w-6 text-yellow-500 animate-bounce" />
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-110 hover:rotate-2 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-500/25'
                    : 'border-gray-200 bg-white/50 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Magical Glow Effect */}
                {(selectedCategory === category.id || hoveredCategory === category.id) && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 animate-pulse blur-sm" />
                )}

                <div className="relative z-10 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${
                    selectedCategory === category.id ? category.color : 'bg-gray-100'
                  } ${hoveredCategory === category.id ? 'animate-bounce' : ''}`}>
                    {category.icon}
                  </div>
                  
                  <div className={`font-bold text-sm mb-2 transition-all duration-300 ${
                    selectedCategory === category.id ? 'text-blue-700 scale-110' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </div>
                  
                  <Badge
                    variant={selectedCategory === category.id ? "default" : "secondary"}
                    className={`text-xs transition-all duration-300 ${
                      hoveredCategory === category.id ? 'scale-110 animate-pulse' : ''
                    } ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : ''
                    }`}
                  >
                    ✨ {category.count}
                  </Badge>
                </div>
                
                {/* Selection Magic Circle */}
                {selectedCategory === category.id && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Hover Magic Effect */}
                {hoveredCategory === category.id && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}