'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { storage } from '@/lib/utils'

export function TopNotificationBar() {
  const [userName, setUserName] = useState<string>('')
  const [notificationCount, setNotificationCount] = useState<number>(0)

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    if (userProfile) {
      setUserName(userProfile.firstName)
    }
    
    // Simulate notification count
    const notifications = storage.get('notifications') || []
    const unreadCount = notifications.filter((n: any) => !n.read).length
    setNotificationCount(unreadCount)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 bg-esimphony-black z-40 border-b border-gray-800">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-esimphony-white">
              Hello, {userName || 'User'}! 👋
            </h1>
            <p className="text-esimphony-gray text-sm">Welcome to eSimphony</p>
          </div>
          
          <Link 
            href="/notifications" 
            className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <i className="fas fa-bell text-esimphony-white text-xl"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-esimphony-red text-esimphony-white text-xs rounded-full min-w-[18px] h-4 flex items-center justify-center px-1">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}