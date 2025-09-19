'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  location: string
  publishedYear: number
  description?: string
}

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'History',
    'Biography',
    'Self-Help',
    'Reference',
    'Textbook',
    'Children',
    'Young Adult',
    'Poetry',
    'Drama',
    'Mystery',
    'Science Fiction',
    'Fantasy'
  ] as const

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
    location: '',
    publishedYear: new Date().getFullYear(),
    description: ''
  })

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return
      
      setLoading(true)
      setError('')
      
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'GET',
          credentials: 'include',
          // headers: {
          //   'Content-Type': 'application/json',
          //   'Accept': 'application/json'
          // }
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch book')
        }
        
        setFormData({
          title: data.title || '',
          author: data.author || '',
          isbn: data.isbn || '',
          category: data.category || '',
          totalCopies: data.totalCopies || 1,
          location: data.location || '',
          publishedYear: data.publishedYear || new Date().getFullYear(),
          description: data.description || ''
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book details')
        router.push('/admin/books')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCopies' || name === 'publishedYear' ? Number(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update book')
      }

      router.push('/admin/books')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update book')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Book</h1>
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/books')}
            >
              Back to Books
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
            
            <Input
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map(category => ({
                    value: category,
                    label: category
                  }))
                ]}
              />
            </div>
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Total Copies"
              name="totalCopies"
              type="number"
              min="1"
              value={formData.totalCopies}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Published Year"
              name="publishedYear"
              type="number"
              min="1000"
              max={new Date().getFullYear()}
              value={formData.publishedYear}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}