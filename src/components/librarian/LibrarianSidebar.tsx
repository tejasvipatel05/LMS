'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/librarian/dashboard',
    icon: '📊',
    description: 'Daily overview'
  },
  {
    name: 'Books',
    href: '/librarian/books',
    icon: '📚',
    description: 'Manage catalog',
    children: [
      { name: 'View All Books', href: '/librarian/books' },
      { name: 'Add New Book', href: '/librarian/books/add' }
    ]
  },
  {
    name: 'Circulation',
    href: '/librarian/borrowing',
    icon: '🔄',
    description: 'Issue & return books',
    children: [
      { name: 'Active Borrowings', href: '/librarian/borrowing' },
      { name: 'Return Books', href: '/librarian/borrowing/return' }
    ]
  },
  {
    name: 'Patrons',
    href: '/librarian/patrons',
    icon: '👥',
    description: 'Patron assistance'
  },
  {
    name: 'Reports',
    href: '/librarian/reports',
    icon: '📈',
    description: 'Circulation reports'
  }
]

export default function LibrarianSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen relative">
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            LIBRARIAN
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <div>
                  <div>{item.name}</div>
                  <div className="text-xs text-blue-200">{item.description}</div>
                </div>
              </Link>
              
              {item.children && isActive(item.href) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-1 text-sm rounded transition-colors ${
                        pathname === child.href
                          ? 'bg-blue-500 text-white'
                          : 'text-blue-200 hover:text-white hover:bg-blue-700'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-800 rounded p-3 text-center">
          <div className="text-xs text-blue-200">Librarian Portal</div>
          <div className="text-sm font-medium">Books & Circulation</div>
        </div>
      </div>
    </div>
  )
}