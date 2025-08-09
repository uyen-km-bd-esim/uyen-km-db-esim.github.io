'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  path: string
  icon: string
  label: string
  badge?: number
}

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Home' },
    { path: '/plans', icon: 'fas fa-microchip', label: 'Plans' },
    { path: '/usage', icon: 'fas fa-chart-bar', label: 'Usage' },
    { path: '/profile', icon: 'fas fa-user', label: 'Profile' }
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-esimphony-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors duration-200',
                isActive(item.path)
                  ? 'text-esimphony-red'
                  : 'text-esimphony-gray hover:text-esimphony-black'
              )}
            >
              <div className="relative">
                <i className={`${item.icon} text-xl mb-1`}></i>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-esimphony-red text-esimphony-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium',
                isActive(item.path) ? 'text-esimphony-red' : 'text-esimphony-gray'
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}