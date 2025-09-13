# 📚 Library Management System

A modern, web-based Library Management System built with Next.js, TypeScript, and MongoDB. This system helps libraries manage their books, users, and borrowing operations efficiently.

## 🌟 Features

### Core Functionality
- **Book Management**: Add, edit, delete, and search books in the catalog
- **User Management**: Handle different user roles (Admin, Librarian, Patron)
- **Circulation System**: Book borrowing, returning, and renewal processes
- **Search & Filter**: Advanced search capabilities for books and users
- **Statistics Dashboard**: Real-time analytics and reports

### User Roles
- **Administrator**: Full system access, user management, system configuration
- **Librarian**: Book management, borrowing operations, basic reports
- **Patron**: Book search, personal borrowing history, profile management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Prisma ORM
- **Authentication**: JWT tokens with role-based access control
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (18.0 or later)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account if you don't have one
3. Create a new cluster
4. Create a database user
5. Get your connection string

### 3. Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update the `.env.local` file with your MongoDB connection string:
```env
# MongoDB Atlas Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT
JWT_SECRET="your-jwt-secret-here"
```

### 4. Set up the Database
```bash
# Generate Prisma client
npx prisma generate

# Push the schema to MongoDB
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
library-management-system/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── books/          # Book management endpoints
│   │   │   ├── borrowing/      # Borrowing/returning endpoints
│   │   │   └── stats/          # Statistics endpoints
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts             # Authentication helpers
│   │   ├── database.ts         # Database connection
│   │   ├── db-helpers.ts       # Database query helpers
│   │   └── utils.ts            # General utilities
│   ├── middleware/             # Custom middleware
│   │   └── auth.ts             # Authentication middleware
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Main type definitions
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.example                # Environment variables template
└── package.json                # Dependencies and scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Books
- `GET /api/books` - Get all books or search books
- `POST /api/books` - Add a new book (Librarian/Admin only)

### Borrowing
- `GET /api/borrowing` - Get active borrowings (Librarian/Admin only)
- `POST /api/borrowing` - Borrow a book
- `POST /api/borrowing/return` - Return a book (Librarian/Admin only)

### Statistics
- `GET /api/stats` - Get library statistics (Librarian/Admin only)

## 🎯 Key Features

### Database Models
- **User**: Stores user information and roles
- **Book**: Contains book details and availability
- **Borrowing**: Tracks book loans and returns
- **Fine**: Manages overdue fines
- **Reservation**: Handles book reservations

### Authentication System
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Secure API endpoints

## 🧪 Testing the API

Example API calls:
```bash
# Get all books
curl http://localhost:3000/api/books

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'
```

## 📝 Usage Guide

### For Administrators
1. Login with admin credentials
2. Manage users and assign roles
3. Configure system settings
4. View comprehensive reports

### For Librarians
1. Add and manage books in the catalog
2. Process book borrowing and returns
3. Handle patron registrations
4. View circulation reports

### For Patrons
1. Search and browse book catalog
2. View personal borrowing history
3. Update profile information
4. Check due dates and fines

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify database user credentials

2. **Environment Variables**
   - Make sure `.env.local` file exists
   - Check all required variables are set
   - Restart the development server after changes

3. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Use `npx prisma db push` to sync with database

---

**Happy Library Management! 📚✨**
