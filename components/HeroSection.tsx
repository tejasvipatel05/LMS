'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, Star, TrendingUp, Zap, Sparkles, Crown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function HeroSection() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [magicParticles, setMagicParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const quotes = [
    "📚 A room without books is like a body without a soul",
    "✨ Reading is dreaming with open eyes",
    "🌟 Books are a uniquely portable magic",
    "⚡ The more you read, the more things you will know"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setMagicParticles(particles);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Magic Particles */}
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
          <Sparkles className="w-4 h-4 text-yellow-400 animate-ping opacity-60" />
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-lg animate-pulse">
              <Crown className="w-5 h-5 mr-2" />
              Welcome to the Magical Library
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-8 animate-in slide-in-from-bottom-8 duration-1000">
            Discover Your Next
            <br />
            {/* <span className="relative">
              Adventure
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 animate-pulse" />
            </span> */}
          </h1>

          <div className="h-16 mb-8 flex items-center justify-center">
            <p className="text-2xl text-gray-600 font-medium animate-in fade-in duration-1000 transition-all">
              {quotes[currentQuote]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <Search className="w-6 h-6 mr-3" />
              Start Exploring
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-purple-200 hover:border-purple-400 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              Browse Categories
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: BookOpen, label: 'Total Books', value: '10,000+', color: 'from-blue-500 to-cyan-500' },
            { icon: Star, label: 'Happy Readers', value: '5,000+', color: 'from-yellow-500 to-orange-500' },
            { icon: TrendingUp, label: 'Books Read', value: '50,000+', color: 'from-green-500 to-emerald-500' },
            { icon: Award, label: 'Categories', value: '25+', color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <Card 
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-2 cursor-pointer group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:animate-bounce`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Categories Preview */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center justify-center">
            <Zap className="w-8 h-8 mr-3 text-purple-500 animate-pulse" />
            Popular Categories
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Fiction', icon: '📖', count: '2,500+' },
              { name: 'Science', icon: '🧪', count: '1,800+' },
              { name: 'Technology', icon: '💻', count: '1,200+' },
              { name: 'History', icon: '🏛️', count: '900+' },
              { name: 'Arts', icon: '🎨', count: '600+' },
              { name: 'Philosophy', icon: '🤔', count: '400+' },
            ].map((category, index) => (
              <Badge
                key={category.name}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-gray-200 hover:border-purple-300 px-6 py-3 text-lg cursor-pointer hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-2xl mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 text-sm text-gray-500">({category.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}