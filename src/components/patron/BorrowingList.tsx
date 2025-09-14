'use client'

import { Card } from '@/components/ui/Card'
import BorrowingCard from './BorrowingCard'
import { Borrowing } from '@/types/patron'

interface BorrowingListProps {
  borrowings: Borrowing[]
  title: string
  emptyMessage?: string
  onRenew?: (borrowingId: string) => void
  showRenewButton?: boolean
  maxItems?: number
}

export default function BorrowingList({ 
  borrowings, 
  title, 
  emptyMessage = 'No borrowings found',
  onRenew,
  showRenewButton = true,
  maxItems
}: BorrowingListProps) {
  const displayBorrowings = maxItems ? borrowings.slice(0, maxItems) : borrowings

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {borrowings.length > 0 && (
          <span className="text-sm text-gray-500">
            {borrowings.length} item(s)
            {maxItems && borrowings.length > maxItems && ` (showing ${maxItems})`}
          </span>
        )}
      </div>
      
      {displayBorrowings.length > 0 ? (
        <div className="space-y-4">
          {displayBorrowings.map((borrowing) => (
            <BorrowingCard
              key={borrowing.id}
              borrowing={borrowing}
              onRenew={onRenew}
              showRenewButton={showRenewButton}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </Card>
  )
}