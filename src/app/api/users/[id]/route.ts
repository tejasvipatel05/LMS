import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/middleware/auth'
import { prisma } from '@/lib/database'
import { hashPassword } from '@/lib/auth'

// Get a specific user (admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only admins can view user details
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can view user details' },
        { status: 403 }
      )
    }
    
    const userData = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            borrowings: true,
            fines: true,
            reservations: true
          }
        },
        borrowings: {
          include: {
            book: {
              select: {
                title: true,
                author: true,
                isbn: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        fines: {
          include: {
            borrowing: {
              include: {
                book: {
                  select: {
                    title: true,
                    author: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reservations: {
          include: {
            book: {
              select: {
                title: true,
                author: true,
                isbn: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user: userData })
    
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// Update a user (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only admins can update users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update users' },
        { status: 403 }
      )
    }
    
    const updateData = await req.json()
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const dataToUpdate: any = {}
    
    if (updateData.name) {
      dataToUpdate.name = updateData.name
    }
    
    if (updateData.email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(updateData.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
      
      // Check if email is already taken by another user
      const emailExists = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: params.id }
        }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already taken by another user' },
          { status: 400 }
        )
      }
      
      dataToUpdate.email = updateData.email
    }
    
    if (updateData.role) {
      // Validate role
      if (!['ADMIN', 'LIBRARIAN', 'PATRON'].includes(updateData.role)) {
        return NextResponse.json(
          { error: 'Invalid role. Must be ADMIN, LIBRARIAN, or PATRON' },
          { status: 400 }
        )
      }
      dataToUpdate.role = updateData.role
    }
    
    if (updateData.password) {
      // Hash new password
      dataToUpdate.password = await hashPassword(updateData.password)
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// Delete a user (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Only admins can delete users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      )
    }
    
    // Prevent admin from deleting themselves
    if (user.userId === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        borrowings: true,
        fines: { where: { isPaid: false } },
        reservations: true
      }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Check if user has active borrowings
    const activeBorrowings = existingUser.borrowings.filter(b => !b.returnDate)
    if (activeBorrowings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with active borrowings. Please return all books first.' },
        { status: 400 }
      )
    }
    
    // Check if user has unpaid fines
    if (existingUser.fines.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with unpaid fines. Please clear all fines first.' },
        { status: 400 }
      )
    }
    
    // Delete user (this will cascade delete related records due to database constraints)
    await prisma.user.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({
      message: 'User deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}