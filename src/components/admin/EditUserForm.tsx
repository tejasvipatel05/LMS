'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

interface EditUserFormProps {
  user: User
  onSuccess?: () => void
}

export default function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ include cookies for auth
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update user')
      }

      if (onSuccess) {
        onSuccess()
      }

      router.refresh()
      router.push('/admin/users')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit User</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">
              {error}
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="PATRON">Patron</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

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
              {loading ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
