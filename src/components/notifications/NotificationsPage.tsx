'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'promo' | 'error'
  actionable?: boolean
  actionUrl?: string
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Data Usage Alert',
      message: 'You\'ve used 85% of your data allowance. Consider topping up or changing plans.',
      date: '2024-08-09T10:30:00Z',
      read: false,
      type: 'warning',
      actionable: true,
      actionUrl: '/plans'
    },
    {
      id: '2',
      title: 'Payment Successful',
      message: 'Your top-up of $25.00 has been processed successfully.',
      date: '2024-08-08T15:45:00Z',
      read: false,
      type: 'success'
    },
    {
      id: '3',
      title: 'Plan Expiring Soon',
      message: 'Your Euro Data Pass will expire in 3 days. Renew now to avoid service interruption.',
      date: '2024-08-07T09:15:00Z',
      read: true,
      type: 'info',
      actionable: true,
      actionUrl: '/plans'
    },
    {
      id: '4',
      title: 'Special Offer: 20% Off',
      message: 'Get 20% off on Global Traveler plans this weekend only!',
      date: '2024-08-06T08:00:00Z',
      read: true,
      type: 'promo',
      actionable: true,
      actionUrl: '/plans'
    },
    {
      id: '5',
      title: 'Welcome to eSimphony',
      message: 'Thank you for joining eSimphony! Your account has been created successfully.',
      date: '2024-08-05T14:20:00Z',
      read: true,
      type: 'success'
    }
  ]

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }

    // Load notifications from storage or use mock data
    const savedNotifications = storage.get('notifications') || mockNotifications
    setNotifications(savedNotifications)
    setIsLoading(false)
  }, [router])

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    )
    setNotifications(updatedNotifications)
    storage.set('notifications', updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }))
    setNotifications(updatedNotifications)
    storage.set('notifications', updatedNotifications)
  }

  const clearAll = () => {
    setNotifications([])
    storage.remove('notifications')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    if (notification.actionable && notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle text-esimphony-success'
      case 'warning': return 'fas fa-exclamation-triangle text-esimphony-warning'
      case 'error': return 'fas fa-times-circle text-red-500'
      case 'promo': return 'fas fa-percentage text-esimphony-red'
      default: return 'fas fa-info-circle text-blue-500'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container-esimphony flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container-esimphony pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-esimphony-white">
              Notifications
            </h1>
            <p className="text-esimphony-gray text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="secondary" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3 mb-20">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  !notification.read ? 'border-l-4 border-l-esimphony-red bg-red-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <i className={`${getNotificationIcon(notification.type)} text-lg`}></i>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-sm font-semibold text-esimphony-black ${
                          !notification.read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                          {notification.type === 'promo' && (
                            <span className="ml-2 bg-esimphony-red text-esimphony-white text-xs px-2 py-1 rounded">
                              PROMO
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-esimphony-gray ml-2 flex-shrink-0">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-esimphony-gray mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.actionable && (
                        <div className="flex items-center mt-2 text-esimphony-red text-sm">
                          <span>Tap to take action</span>
                          <i className="fas fa-chevron-right ml-1"></i>
                        </div>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-esimphony-red rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Clear All Button */}
            <div className="pt-4 text-center">
              <button 
                onClick={clearAll}
                className="text-esimphony-gray hover:text-esimphony-red text-sm transition-colors"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear all notifications
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="mb-6">
              <i className="fas fa-bell-slash text-6xl text-esimphony-gray"></i>
            </div>
            <h3 className="text-lg font-semibold text-esimphony-white mb-2">
              No notifications yet
            </h3>
            <p className="text-esimphony-gray mb-8">
              We'll notify you about important updates, usage alerts, and special offers.
            </p>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <div className="flex items-center text-sm text-esimphony-white">
                  <i className="fas fa-chart-line text-esimphony-success mr-3"></i>
                  <span>Data usage alerts</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <div className="flex items-center text-sm text-esimphony-white">
                  <i className="fas fa-calendar-alt text-esimphony-warning mr-3"></i>
                  <span>Plan expiration reminders</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <div className="flex items-center text-sm text-esimphony-white">
                  <i className="fas fa-percentage text-esimphony-red mr-3"></i>
                  <span>Special offers & promotions</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}