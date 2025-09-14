'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: '📊',
    description: 'Overview and statistics'
  },
  {
    name: 'Books',
    href: '/admin/books',
    icon: '📚',
    description: 'Manage book catalog',
    children: [
      { name: 'View All Books', href: '/admin/books' },
      { name: 'Add New Book', href: '/admin/books/add' }
    ]
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥',
    description: 'Manage system users',
    children: [
      { name: 'View All Users', href: '/admin/users' },
      { name: 'Add New User', href: '/admin/users/add' }
    ]
  },
  {
    name: 'Borrowing',
    href: '/admin/borrowing',
    icon: '📖',
    description: 'Track all borrowings'
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: '📈',
    description: 'Analytics and reports'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
    description: 'System configuration'
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen relative">
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            ADMINISTRATOR
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <div>
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
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
                          ? 'bg-red-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
        <div className="bg-gray-800 rounded p-3 text-center">
          <div className="text-xs text-gray-400">Admin Panel</div>
          <div className="text-sm font-medium">Full System Access</div>
        </div>
      </div>
    </div>
  )
}