import { NextRequest, NextResponse } from 'next/server'
import { getLibraryStats, getOverdueBooks } from '@/lib/db-helpers'
import { getUserFromRequest } from '@/middleware/auth'

// Get library statistics
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only librarians and admins can view statistics
    if (user.role !== 'ADMIN' && user.role !== 'LIBRARIAN') {
      return NextResponse.json(
        { error: 'Only librarians and admins can view statistics' },
        { status: 403 }
      )
    }
    
    const stats = await getLibraryStats()
    const overdueBooks = await getOverdueBooks()
    
    return NextResponse.json({
      stats,
      overdueBooks
    })
    
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}