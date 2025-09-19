import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, hasPermission } from '@/lib/auth'
import { UserRole } from '@/types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export function getUserFromRequest(req: NextRequest): AuthUser | null {
  try {
    // First try to get token from cookie
    const token = req.cookies.get('token')?.value
    
    // Then try Authorization header if no cookie
    if (!token) {
      const authHeader = req.headers.get('Authorization')
      console.log('Auth Header:', authHeader);
      
      if (!authHeader?.startsWith('Bearer ')) {
        return null
      }
      return verifyToken(authHeader.substring(7))
    }
    
    return verifyToken(token)
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// Simple middleware to check if user is authenticated
export function requireAuth(handler: Function) {
  return async (req: NextRequest) => {
    try {
      const user = getUserFromRequest(req)
      if (!user) {
        return NextResponse.json({ error: 'Authentication required..' }, { status: 401 })
      }
      
      // Add user info to request
      const requestWithUser = req as any
      requestWithUser.user = user
      
      return handler(requestWithUser)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}

// Middleware to check user role
export function requireRole(role: UserRole) {
  return function(handler: Function) {
    return async (req: NextRequest) => {
      try {
        const user = getUserFromRequest(req)
        if (!user) {
          return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }
        
        if (!hasPermission(user.role, role)) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }
        
        const requestWithUser = req as any
        requestWithUser.user = user
        
        return handler(requestWithUser)
      } catch (error) {
        console.error('Role middleware error:', error)
        return NextResponse.json({ error: 'Authorization failed' }, { status: 403 })
      }
    }
  }
}

export function requirePermission(action: string) {
  return function(handler: Function) {
    return async (req: NextRequest, context?: any) => {
      try {
        const user = getUserFromRequest(req)
        if (!user) {
          return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        if (!hasPermission(user.role, action)) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        // Attach user to request for handler usage
        (req as any).user = user
        return handler(req, context)
      } catch (error) {
        console.error('Permission middleware error:', error)
        return NextResponse.json({ error: 'Authorization failed' }, { status: 403 })
      }
    }
  }
}
