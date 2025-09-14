'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/patron/dashboard',
    icon: '🏠',
    description: 'My library home'
  },
  {
    name: 'Browse Books',
    href: '/patron/books',
    icon: '📚',
    description: 'Find books to borrow'
  },
  {
    name: 'My Books',
    href: '/patron/borrowing',
    icon: '📖',
    description: 'Current & past borrowings'
  },
  {
    name: 'Profile',
    href: '/patron/profile',
    icon: '👤',
    description: 'Manage my account'
  },
  {
    name: 'History',
    href: '/patron/history',
    icon: '📝',
    description: 'Borrowing history'
  }
]

export default function PatronSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="w-64 bg-green-900 text-white min-h-screen relative">
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            PATRON
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-green-600 text-white'
                  : 'text-green-100 hover:bg-green-800 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-green-200">{item.description}</div>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-8 p-3 bg-green-800 rounded">
          <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
          <div className="text-xs text-green-200 space-y-1">
            <div className="flex justify-between">
              <span>Books borrowed:</span>
              <span className="text-white font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span>Due soon:</span>
              <span className="text-yellow-300 font-medium">1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-green-800 rounded p-3 text-center">
          <div className="text-xs text-green-200">Patron Portal</div>
          <div className="text-sm font-medium">My Library Account</div>
        </div>
      </div>
    </div>
  )
}