import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Simple homepage for the Library Management System
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Library Management System
            </h1>
            <nav className="flex space-x-4">
              <Link href="/login">
                <Button variant="primary">Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Digital Library
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your library's books, users, and borrowing system efficiently with our modern library management solution.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>📖 Book Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Add, edit, and organize your book collection with detailed cataloging and search capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👥 User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage librarians and patrons with role-based access control and user profiles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔄 Circulation System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Handle book borrowing, returns, renewals, and overdue tracking seamlessly.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Login to access your library dashboard and start managing your collection.
          </p>
          <Link href="/login">
            <Button size="lg">Access Library System</Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Library Management System. Built with Next.js and MongoDB.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
