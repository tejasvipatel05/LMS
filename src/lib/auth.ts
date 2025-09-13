import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole } from '@/types/index'

// Hash password before saving to database
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// Check if password matches the hashed password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Create JWT token for user
export function createToken(userId: string, email: string, role: UserRole): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key'
  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn: '7d' } // Token expires in 7 days
  )
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

// Check if user has required role
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    'ADMIN': 3,
    'LIBRARIAN': 2,
    'PATRON': 1
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Check if user has permission to perform action
export function hasPermission(userRole: UserRole, action: string): boolean {
  const permissions = {
    'ADMIN': ['*'], // Admin can do everything
    'LIBRARIAN': [
      'view_books', 'add_books', 'edit_books', 'delete_books',
      'view_users', 'add_users', 'edit_users',
      'issue_books', 'return_books',
      'view_reports'
    ],
    'PATRON': [
      'view_books', 'search_books',
      'view_profile', 'edit_profile',
      'view_borrowed_books'
    ]
  }
  
  const userPermissions = permissions[userRole] || []
  return userPermissions.includes('*') || userPermissions.includes(action)
}