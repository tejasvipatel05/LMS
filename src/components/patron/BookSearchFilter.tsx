'use client'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface BookSearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: string[]
  sortBy: string
  onSortByChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (value: 'asc' | 'desc') => void
  showAvailableOnly: boolean
  onAvailableOnlyChange: (value: boolean) => void
  resultsCount: number
}

export default function BookSearchFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showAvailableOnly,
  onAvailableOnlyChange,
  resultsCount
}: BookSearchFilterProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search books by title, author, ISBN, or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1"
          />
          <select 
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="category">Category</option>
              <option value="availableCopies">Availability</option>
            </select>
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="availableOnly"
              checked={showAvailableOnly}
              onChange={(e) => onAvailableOnlyChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="availableOnly" className="ml-2 text-sm text-gray-700">
              Show available only
            </label>
          </div>
          
          <div className="text-sm text-gray-500">
            {resultsCount} book(s) found
          </div>
        </div>
      </div>
    </Card>
  )
}