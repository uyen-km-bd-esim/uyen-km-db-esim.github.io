'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { AppLayout } from '@/components/layout/AppLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { User } from '@/types'

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showChatSupport, setShowChatSupport] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'support', timestamp: Date}>>([])  
  const [newMessage, setNewMessage] = useState('')
  const [editForm, setEditForm] = useState({
    firstName: '',
    email: ''
  })
  const router = useRouter()

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }
    
    setUser(userProfile)
    setEditForm({
      firstName: userProfile.firstName,
      email: userProfile.email
    })
    setIsLoading(false)
  }, [router])

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      if (user) {
        setEditForm({
          firstName: user.firstName,
          email: user.email
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      firstName: editForm.firstName,
      email: editForm.email
    }

    setUser(updatedUser)
    storage.set('userProfile', updatedUser)
    setIsEditing(false)
  }

  const handleLogout = () => {
    storage.clear()
    router.push('/')
  }

  const openChatSupport = () => {
    setShowChatSupport(true)
    setShowFAQ(false)
    // Load previous chat messages from localStorage
    const savedMessages = storage.get('chatMessages') || []
    setChatMessages(savedMessages)
  }

  const openFAQSupport = () => {
    setShowFAQ(true)
    setShowChatSupport(false)
  }

  const closeSupportModals = () => {
    setShowChatSupport(false)
    setShowFAQ(false)
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    }
    
    const updatedMessages = [...chatMessages, message]
    setChatMessages(updatedMessages)
    storage.set('chatMessages', updatedMessages)
    setNewMessage('')
    
    // Simulate support response after 2 seconds
    setTimeout(() => {
      const supportResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for reaching out! A support agent will respond to your message shortly. In the meantime, you can check our FAQ section for immediate help.",
        sender: 'support' as const,
        timestamp: new Date()
      }
      const finalMessages = [...updatedMessages, supportResponse]
      setChatMessages(finalMessages)
      storage.set('chatMessages', finalMessages)
    }, 2000)
  }

  const getInitials = (firstName: string) => {
    return firstName ? firstName.charAt(0).toUpperCase() : 'U'
  }

  if (isLoading) {
    return (
      <div className="container-esimphony flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
      </div>
    )
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="container-esimphony pt-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-esimphony-white">
            Profile
          </h1>
        </div>

      {/* 1. Profile Header - FIRST */}
      <Card className="mb-6">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-esimphony-red to-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
            {getInitials(user.firstName)}
          </div>
          <h3 className="text-xl font-semibold text-esimphony-black mb-1">{user.firstName}</h3>
          <p className="text-esimphony-gray text-sm mb-3">{user.email}</p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <i className="fas fa-check-circle mr-2"></i>
            Account Active
          </div>
        </div>
      </Card>
      
      {/* 2. Account Settings */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
            <i className="fas fa-user-cog text-esimphony-red mr-2"></i>
            Account Settings
          </h2>
          
          <div className="space-y-2">
            <button 
              onClick={handleEditToggle}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer"
            >
              <div className="flex items-center">
                <i className="fas fa-edit text-esimphony-gray mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Edit Profile</div>
                  <div className="text-xs text-esimphony-gray">Update your name and personal information</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-esimphony-gray"></i>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
              <div className="flex items-center">
                <i className="fas fa-lock text-esimphony-gray mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Change Password</div>
                  <div className="text-xs text-esimphony-gray">Update your account password</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-esimphony-gray"></i>
            </button>
          </div>
        </div>
      </Card>

      {/* 3. Usage & History */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
            <i className="fas fa-history text-esimphony-red mr-2"></i>
            Usage & History
          </h2>
          <div className="space-y-2">
            <Link href="/usage" className="block">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
                <div className="flex items-center">
                  <i className="fas fa-chart-bar text-esimphony-gray mr-3"></i>
                  <div className="text-left">
                    <div className="font-medium">Charges & Consumption</div>
                    <div className="text-xs text-esimphony-gray">View your data usage and charges</div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-esimphony-gray"></i>
              </div>
            </Link>
            
            <Link href="/top-up-history" className="block">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
                <div className="flex items-center">
                  <i className="fas fa-credit-card text-esimphony-gray mr-3"></i>
                  <div className="text-left">
                    <div className="font-medium">Top-Up History</div>
                    <div className="text-xs text-esimphony-gray">Review your payment history</div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-esimphony-gray"></i>
              </div>
            </Link>
          </div>
        </div>
      </Card>
      
      {/* 4. Settings */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
            <i className="fas fa-cog text-esimphony-red mr-2"></i>
            Settings
          </h2>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
              <div className="flex items-center">
                <i className="fas fa-globe text-esimphony-gray mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Language</div>
                  <div className="text-xs text-esimphony-gray">English (US)</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-esimphony-gray"></i>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
              <div className="flex items-center">
                <i className="fas fa-bell text-esimphony-gray mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Notifications</div>
                  <div className="text-xs text-esimphony-gray">Manage your notification preferences</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-esimphony-gray"></i>
            </button>
          </div>
        </div>
      </Card>
      
      {/* 5. Support */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
            <i className="fas fa-life-ring text-esimphony-red mr-2"></i>
            Support
          </h2>
          <div className="space-y-2">
            <button 
              onClick={openChatSupport}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer"
            >
              <div className="flex items-center">
                <i className="fas fa-comments text-esimphony-gray mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Send Us a Message</div>
                  <div className="text-xs text-esimphony-gray">Chat with support team</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-esimphony-gray"></i>
            </button>
            
            <button 
              onClick={openFAQSupport}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer"
            >
              <div className="flex items-center">
                <i className="fas fa-question-circle text-esimphony-gray mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Help & FAQ</div>
                  <div className="text-xs text-esimphony-gray">Find answers instantly</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-esimphony-gray"></i>
            </button>
          </div>
        </div>
      </Card>
      
      {/* 6. Account Actions - LAST */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
            <i className="fas fa-exclamation-triangle text-esimphony-red mr-2"></i>
            Account Actions
          </h2>
          <div className="space-y-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-esim cursor-pointer text-red-600"
            >
              <div className="flex items-center">
                <i className="fas fa-sign-out-alt mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Logout</div>
                  <div className="text-xs text-esimphony-gray">Sign out of your account</div>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-esim cursor-pointer text-red-600">
              <div className="flex items-center">
                <i className="fas fa-trash mr-3"></i>
                <div className="text-left">
                  <div className="font-medium">Delete Account</div>
                  <div className="text-xs text-esimphony-gray">Permanently delete your account</div>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </Card>
      </div>
      
      {/* Chat Support Modal */}
      {showChatSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-esimphony-black flex items-center">
                <i className="fas fa-comments text-esimphony-red mr-2"></i>
                Live Support Chat
              </h3>
              <button onClick={closeSupportModals} className="text-esimphony-gray hover:text-esimphony-red">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-headset text-4xl text-esimphony-gray mb-4"></i>
                  <h4 className="font-semibold text-esimphony-black mb-2">Start a conversation</h4>
                  <p className="text-esimphony-gray text-sm">Our support team is here to help you with any questions.</p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-esimphony-red text-white' 
                        : 'bg-gray-100 text-esimphony-black'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-red-100' : 'text-esimphony-gray'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:border-esimphony-red text-esimphony-black placeholder-gray-400"
                />
                <button 
                  onClick={sendMessage}
                  className="bg-esimphony-red text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              <p className="text-xs text-esimphony-gray mt-2 text-center">
                Our team typically responds within a few minutes during business hours.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-esimphony-black flex items-center">
                <i className="fas fa-question-circle text-esimphony-red mr-2"></i>
                Help & FAQ
              </h3>
              <button onClick={closeSupportModals} className="text-esimphony-gray hover:text-esimphony-red">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-esimphony-gray"></i>
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-esimphony-red"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-esimphony-black mb-2 flex items-center">
                    <i className="fas fa-rocket text-esimphony-red mr-2 text-sm"></i>
                    Getting Started
                  </h4>
                  <div className="space-y-1 ml-6">
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">How to create an account</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">First time setup guide</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Understanding eSIM basics</button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-esimphony-black mb-2 flex items-center">
                    <i className="fas fa-sim-card text-esimphony-red mr-2 text-sm"></i>
                    eSIM Activation
                  </h4>
                  <div className="space-y-1 ml-6">
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">How to activate your eSIM</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">QR code activation steps</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Manual activation process</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Troubleshooting activation issues</button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-esimphony-black mb-2 flex items-center">
                    <i className="fas fa-credit-card text-esimphony-red mr-2 text-sm"></i>
                    Plans & Billing
                  </h4>
                  <div className="space-y-1 ml-6">
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Choosing the right plan</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">How to top-up your balance</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Understanding plan types</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Auto-renewal settings</button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-esimphony-black mb-2 flex items-center">
                    <i className="fas fa-tools text-esimphony-red mr-2 text-sm"></i>
                    Troubleshooting
                  </h4>
                  <div className="space-y-1 ml-6">
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Connection issues</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Data not working</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Plan not activating</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Network settings</button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-esimphony-black mb-2 flex items-center">
                    <i className="fas fa-user-cog text-esimphony-red mr-2 text-sm"></i>
                    Account Management
                  </h4>
                  <div className="space-y-1 ml-6">
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Updating account information</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Changing password</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Managing notifications</button>
                    <button className="block text-sm text-esimphony-gray hover:text-esimphony-red">Account security</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t p-4">
              <p className="text-xs text-esimphony-gray text-center">
                Can't find what you're looking for? 
                <button 
                  onClick={() => {closeSupportModals(); openChatSupport();}}
                  className="text-esimphony-red hover:underline ml-1"
                >
                  Chat with support
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-esimphony-black">
                Edit Profile
              </h3>
              <button onClick={handleEditToggle} className="text-esimphony-gray hover:text-esimphony-red">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-esimphony-gray mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-esimphony-gray mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="secondary" 
                  onClick={handleEditToggle}
                  className="flex-1 !border-gray-300 !text-esimphony-black hover:!bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  className="flex-1"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}