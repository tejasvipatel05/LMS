'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'LIBRARIAN' | 'PATRON'
  createdAt: string
  _count?: {
    borrowings?: number
    fines?: number
    reservations?: number
  }
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PATRON' as 'ADMIN' | 'LIBRARIAN' | 'PATRON',
    changePassword: false,
    newPassword: '',
    confirmPassword: ''
  })

  const roles = [
    { value: 'PATRON', label: 'Patron', description: 'Regular library user with borrowing privileges' },
    { value: 'LIBRARIAN', label: 'Librarian', description: 'Staff member who manages books and borrowing' },
    { value: 'ADMIN', label: 'Administrator', description: 'Full system access and user management' }
  ]

  useEffect(() => {
    fetchUser()
  }, [userId])

const fetchUser = async () => {
  console.log("Fetching user with ID:", userId);
  
  if (!userId) return
      
      setLoading(true)
      setError('')
  // const token = localStorage.getItem('token')
  // console.log("Token from localStorage:", token);

  // if (!token) {
  //   alert('Authentication required. Please login again.')
  //   router.push('/login')
  //   return
  // }

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'GET',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
      credentials: 'include' // <-- include cookies
    })

    const data = await response.json()
    console.log('User fetch response:', data)

    
    if (response.ok && data) {
      console.log("User data received:", data.id);
      console.log("Response status:", response.status);
      
      const userData = data
      setUser(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'PATRON',
        changePassword: false,
        newPassword: '',
        confirmPassword: ''
      })
    } else {
      console.error('No user found in response:', data)
      alert(data.error || 'Failed to fetch user details')
      router.push('/admin/users')
    }
  } catch (err) {
    console.error('Error fetching user:', err)
    alert('Error fetching user details')
    router.push('/admin/users')
  } finally {
    setLoading(false)
  }
}


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Authentication required. Please login again.')
      router.push('/login')
      return
    }

    if (formData.changePassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords don't match")
        return
      }
      const passwordError = validatePassword(formData.newPassword)
      if (passwordError) {
        setError(passwordError)
        return
      }
    }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (user && currentUser.email === user.email && formData.role !== user.role) {
      if (!confirm("You are changing your own role. This may affect your access to the system. Are you sure?")) {
        return
      }
    }

    setSaving(true)

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }

      if (formData.changePassword) {
        updateData.password = formData.newPassword
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()
      console.log('Update response:', result)

      if (response.ok) {
        router.push('/admin/users')
      } else {
        alert(result.error || 'Failed to update user')
      }
    } catch (err) {
      console.error('Error updating user:', err)
      alert('Error updating user')
    } finally {
      setSaving(false)
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'LIBRARIAN': return 'bg-blue-100 text-blue-800'
      case 'PATRON': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <Link href="/admin/users">
          <Button variant="primary">← Back to Users</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="mt-2 text-gray-600">Update user information and permissions</p>
        </div>
        <Link href="/admin/users">
          <Button variant="secondary">← Back to Users</Button>
        </Link>
      </div>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(user.role)}`}>
            {user.role}
          </span>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{user._count?.borrowings || 0}</div>
            <div className="text-sm text-gray-600">Borrowings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{user._count?.fines || 0}</div>
            <div className="text-sm text-gray-600">Fines</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{user._count?.reservations || 0}</div>
            <div className="text-sm text-gray-600">Reservations</div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </Card>

      {/* Edit Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter user's full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Role *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map(role => (
                <label key={role.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-colors ${formData.role === role.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.role === role.value ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}>
                        {formData.role === role.value && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{role.label}</div>
                        <div className="text-sm text-gray-500">{role.description}</div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="changePassword"
                name="changePassword"
                checked={formData.changePassword}
                onChange={handleInputChange}
                className="mr-3"
              />
              <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                Change Password
              </label>
            </div>

            {formData.changePassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    minLength={6}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}

            {formData.changePassword && formData.newPassword && formData.confirmPassword && (
              <div className={`mt-2 text-sm ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {formData.newPassword === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link href="/admin/users">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" disabled={saving || (formData.changePassword && formData.newPassword !== formData.confirmPassword)}>
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </div>
              ) : '👤 Update User'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Warning */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex">
          <div className="text-yellow-600 mr-3">⚠️</div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Important Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Changing email may affect user's ability to log in</li>
              <li>• Role changes take effect immediately</li>
              <li>• Password changes will require user to log in again</li>
              <li>• Be careful when modifying your own account</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
