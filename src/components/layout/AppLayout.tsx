'use client'

import { BottomNavigation } from './BottomNavigation'
import { TopNotificationBar } from './TopNotificationBar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  showBottomNav?: boolean
  showTopBar?: boolean
}

export function AppLayout({ 
  children, 
  showBottomNav = true, 
  showTopBar = true 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-esimphony-black">
      {showTopBar && <TopNotificationBar />}
      
      <main className={cn(
        'pb-16', // Space for bottom navigation
        showTopBar ? 'pt-16' : '' // Space for top notification bar
      )}>
        {children}
      </main>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}