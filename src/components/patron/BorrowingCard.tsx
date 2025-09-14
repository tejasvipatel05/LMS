'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Borrowing } from '@/types/patron'

interface BorrowingCardProps {
  borrowing: Borrowing
  onRenew?: (borrowingId: string) => void
  showRenewButton?: boolean
}

export default function BorrowingCard({ borrowing, onRenew, showRenewButton = true }: BorrowingCardProps) {
  const isOverdue = new Date(borrowing.dueDate) < new Date()
  const daysUntilDue = Math.ceil((new Date(borrowing.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0

  return (
    <Card className={`p-4 ${isOverdue ? 'border-red-300 bg-red-50' : isDueSoon ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{borrowing.book.title}</h3>
          <p className="text-gray-600">by {borrowing.book.author}</p>
          <p className="text-sm text-gray-500">ISBN: {borrowing.book.isbn}</p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Borrowed:</span>
            <span>{new Date(borrowing.borrowedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Due Date:</span>
            <span className={isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-600 font-medium' : ''}>
              {new Date(borrowing.dueDate).toLocaleDateString()}
            </span>
          </div>
          {borrowing.renewalCount !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Renewals:</span>
              <span>{borrowing.renewalCount}/3</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              borrowing.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              borrowing.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
              borrowing.status === 'RETURNED' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {borrowing.status}
            </span>
          </div>
        </div>
        
        {isOverdue && (
          <div className="bg-red-100 border border-red-300 rounded p-2">
            <p className="text-red-800 text-sm font-medium">
              ⚠️ This book is overdue by {Math.abs(daysUntilDue)} day(s)
            </p>
          </div>
        )}
        
        {isDueSoon && !isOverdue && (
          <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
            <p className="text-yellow-800 text-sm font-medium">
              ⏰ Due in {daysUntilDue} day(s)
            </p>
          </div>
        )}
        
        {showRenewButton && onRenew && borrowing.status === 'ACTIVE' && !isOverdue && (borrowing.renewalCount || 0) < 3 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRenew(borrowing.id)}
            className="w-full"
          >
            Renew Book
          </Button>
        )}
      </div>
    </Card>
  )
}