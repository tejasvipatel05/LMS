'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface BorrowRequest {
  id: string
  reservedAt: string
  expiresAt: string
  status: string
  type: string
  notes?: string
  book: {
    title: string
    author: string
    isbn: string
  }
  user: {
    name: string
    email: string
  }
}

export default function BorrowRequests() {
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRequests(data.reservations || [])
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'approve' })
      })
      
      if (response.ok) {
        await fetchRequests()
        alert('Request approved successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve request')
      }
    } catch (error) {
      console.error('Failed to approve request:', error)
      alert('Failed to approve request')
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'reject', 
          notes: 'Request rejected by librarian' 
        })
      })
      
      if (response.ok) {
        await fetchRequests()
        alert('Request rejected successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to reject request')
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
      alert('Failed to reject request')
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const processedRequests = requests.filter(r => r.status !== 'PENDING')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Borrow Requests</h1>
        <p className="mt-2 text-gray-600">Manage patron book requests</p>
      </div>

      {/* Pending Requests */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Pending Requests ({pendingRequests.length})
        </h2>
        
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{request.book.title}</h3>
                    <p className="text-gray-600">by {request.book.author}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Requested by: {request.user.name} ({request.user.email})</p>
                      <p>Date: {new Date(request.reservedAt).toLocaleDateString()}</p>
                      <p>Expires: {new Date(request.expiresAt).toLocaleDateString()}</p>
                      {request.notes && <p>Note: {request.notes}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="primary"
                      onClick={() => handleApprove(request.id)}
                    >
                      ✅ Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleReject(request.id)}
                    >
                      ❌ Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No pending requests</p>
          )}
        </div>
      </Card>

      {/* Processed Requests */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Processed Requests
        </h2>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {processedRequests.length > 0 ? (
            processedRequests.slice(0, 10).map((request) => (
              <div key={request.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.book.title}</h3>
                    <p className="text-sm text-gray-600">by {request.book.author}</p>
                    <p className="text-xs text-gray-500">
                      {request.user.name} - {new Date(request.reservedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    request.status === 'FULFILLED' ? 'bg-green-100 text-green-800' :
                    request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No processed requests yet</p>
          )}
        </div>
      </Card>
    </div>
  )
}