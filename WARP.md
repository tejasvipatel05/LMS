# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
This is a modern Library Management System built with Next.js 15, TypeScript, MongoDB (via Prisma), and JWT-based authentication. The system manages books, users, and circulation operations with role-based access control.

## Development Commands

### Core Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

### Database Operations
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to MongoDB
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database with sample data
npm run seed
```

### Testing Individual Components
```bash
# Test specific API endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'

# Test protected endpoint (requires Bearer token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/stats
```

## Architecture Overview

### Core System Design
The application follows Next.js App Router architecture with a three-tier role-based access system:
- **ADMIN**: Full system access, user management, configuration
- **LIBRARIAN**: Book management, circulation operations, reports
- **PATRON**: Book discovery, borrowing history, profile management

### Key Architectural Components

#### Authentication Layer (`src/lib/auth.ts`)
- JWT token-based authentication with 7-day expiry
- Hierarchical role-based permissions system
- bcrypt password hashing with salting
- Permission matrix defining action-based access control

#### Data Layer (`src/lib/database.ts` & `src/lib/db-helpers.ts`)
- Prisma ORM with MongoDB Atlas
- Global Prisma client instance with development caching
- Helper functions abstracting common database operations
- Automatic relationship management for borrowing/returning books

#### Middleware System (`src/middleware/auth.ts`)
- Higher-order functions for route protection
- Token validation and user context injection
- Role-based endpoint protection
- Consistent error responses across protected routes

### Database Schema Architecture
The system uses five interconnected MongoDB collections:

#### Core Entities
- **User**: Authentication, profile, and role management
- **Book**: Catalog with availability tracking and location mapping
- **Borrowing**: Active loan tracking with due dates and renewal counts
- **Fine**: Overdue penalty management with payment tracking
- **Reservation**: Book hold system with expiration dates

#### Key Relationships
- Users have many borrowings, fines, and reservations
- Books have many borrowings and reservations  
- Borrowings connect users and books, generating fines when overdue
- Automatic availability calculation based on total vs borrowed copies

### API Route Structure
```
/api/auth/login          - Authentication endpoint
/api/books              - CRUD operations for catalog management
/api/borrowing          - Circulation system (issue/return)
/api/borrowing/return   - Dedicated return processing
/api/stats              - Dashboard analytics and reporting
```

## Development Patterns

### Type Safety
- Comprehensive TypeScript interfaces in `src/types/index.ts`
- Strict type definitions for roles, statuses, and data models
- Type-safe Prisma client usage throughout

### Error Handling
- Consistent API error responses with appropriate HTTP status codes
- Database operation error handling with meaningful messages
- Authentication failures return standardized 401/403 responses

### Security Implementation
- JWT tokens include user ID, email, and role claims
- Password comparison uses constant-time bcrypt operations
- Authorization middleware validates both authentication and permissions
- No sensitive data exposed in API responses

### Development Environment
- Turbopack enabled for faster development and builds
- Path aliases configured (`@/*` maps to `src/*`)
- ESLint configured with Next.js TypeScript rules
- Automatic code formatting and linting on build

## Environment Setup

### Required Environment Variables
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

### Default Test Credentials (after seeding)
- Admin: `admin@library.com` / `admin123`
- Librarian: `librarian@library.com` / `lib123`  
- Patron: `patron@library.com` / `patron123`

## Code Organization

### File Structure Patterns
- `/src/app/api/*/route.ts` - API route handlers with HTTP method exports
- `/src/lib/` - Utility functions and shared business logic
- `/src/types/index.ts` - Centralized type definitions
- `/src/middleware/` - Request processing middleware
- `/prisma/` - Database schema and seeding scripts

### Component Architecture
- Server Components for data fetching and rendering
- Role-based layout components (`admin/`, `librarian/`, `patron/`)
- Shared UI components follow compound component patterns
- API routes use middleware composition for authentication

### Business Logic Patterns
- Database helpers abstract Prisma operations
- Authentication utilities handle token lifecycle
- Permission checking uses hierarchical role comparison
- Statistics aggregation uses Promise.all for parallel queries