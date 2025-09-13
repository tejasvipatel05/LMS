import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/db-helpers'
import { comparePassword, createToken } from '@/lib/auth'
import { UserRole } from '@/types'

// Simple login endpoint
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create token
    const token = createToken(user.id, user.email, user.role as UserRole)
    
    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to login.' },
    { status: 405 }
  )
}
