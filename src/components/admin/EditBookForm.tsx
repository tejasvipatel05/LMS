'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Book } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

interface EditBookFormProps {
  book: Book
  onSuccess?: () => void
}

export default function EditBookForm({ book, onSuccess }: EditBookFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    publisher: book.publisher || '',
    publishedYear: book.publishedYear || '',
    description: book.description || '',
    totalCopies: book.totalCopies || 1,
    location: book.location || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update book')
      }

      if (onSuccess) {
        onSuccess()
      }
      router.refresh()
      router.push('/admin/books')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit Book</h2>
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
          
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
          
          <Input
            label="Published Year"
            name="publishedYear"
            type="number"
            value={formData.publishedYear}
            onChange={handleChange}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <Input
            label="Total Copies"
            name="totalCopies"
            type="number"
            value={formData.totalCopies}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}