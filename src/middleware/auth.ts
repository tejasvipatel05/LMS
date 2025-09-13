import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, hasPermission } from '@/lib/auth'
import { UserRole } from '@/types'

// Simple middleware to check if user is authenticated
export function requireAuth(handler: Function) {
  return async (req: NextRequest) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
      }
      
      const token = authHeader.substring(7) // Remove "Bearer " prefix
      const decoded = verifyToken(token)
      
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      
      // Add user info to request
      const requestWithUser = req as any
      requestWithUser.user = decoded
      
      return handler(requestWithUser)
    } catch (error) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}

// Middleware to check user role
export function requireRole(role: UserRole) {
  return function(handler: Function) {
    return async (req: NextRequest) => {
      try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }
        
        const token = authHeader.substring(7)
        const decoded = verifyToken(token)
        
        if (!decoded) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }
        
        if (!hasPermission(decoded.role as UserRole, role)) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }
        
        const requestWithUser = req as any
        requestWithUser.user = decoded
        
        return handler(requestWithUser)
      } catch (error) {
        return NextResponse.json({ error: 'Authorization failed' }, { status: 403 })
      }
    }
  }
}

// Simple function to get user from request (for use in API routes)
export function getUserFromRequest(req: NextRequest): any {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    return verifyToken(token)
  } catch (error) {
    return null
  }
}