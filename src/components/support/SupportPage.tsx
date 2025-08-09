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

export function SupportPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitComplete, setSubmitComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }
    
    setUser(userProfile)
    setIsLoading(false)
  }, [router])

  const supportCategories = [
    {
      id: 'activation',
      title: 'eSIM Activation',
      icon: 'fas fa-mobile-alt',
      description: 'Issues with eSIM installation and setup',
      articles: [
        'How to install eSIM on iPhone',
        'eSIM activation troubleshooting',
        'QR code scanning problems'
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: 'fas fa-credit-card',
      description: 'Questions about charges and payment methods',
      articles: [
        'Understanding your bill',
        'Payment method issues',
        'Refund policy'
      ]
    },
    {
      id: 'plans',
      title: 'Plans & Coverage',
      icon: 'fas fa-globe',
      description: 'Plan features, coverage areas, and data usage',
      articles: [
        'Available countries and regions',
        'Data usage monitoring',
        'Plan change options'
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'fas fa-cog',
      description: 'Connection issues and technical problems',
      articles: [
        'No internet connection',
        'Slow data speeds',
        'Device compatibility'
      ]
    }
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitComplete(true)
    setContactForm({ subject: '', message: '' })
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitComplete(false)
    }, 3000)
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
            Help & Support
          </h1>
          <p className="text-esimphony-gray text-sm">Get help with your eSIM service</p>
        </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Quick Help
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/demo-support">
              <div className="p-4 text-center hover:bg-gray-50 rounded-esim cursor-pointer">
                <i className="fas fa-flask text-2xl text-esimphony-red mb-2"></i>
                <p className="text-sm font-medium">Demo Reset</p>
                <p className="text-xs text-esimphony-gray">Clear test data</p>
              </div>
            </Link>
            <div className="p-4 text-center hover:bg-gray-50 rounded-esim cursor-pointer">
              <i className="fas fa-phone text-2xl text-esimphony-red mb-2"></i>
              <p className="text-sm font-medium">Call Support</p>
              <p className="text-xs text-esimphony-gray">1-800-ESIM</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Support Categories */}
      <div className="space-y-4 mb-6">
        {supportCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <button
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? '' : category.id
                )}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <i className={`${category.icon} text-esimphony-red text-xl mr-4`}></i>
                  <div>
                    <h3 className="text-lg font-semibold text-esimphony-black">
                      {category.title}
                    </h3>
                    <p className="text-esimphony-gray text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
                <i className={`fas fa-chevron-${selectedCategory === category.id ? 'up' : 'down'} text-esimphony-gray`}></i>
              </button>
              
              {selectedCategory === category.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-esimphony-black mb-3">
                    Popular Articles
                  </h4>
                  <div className="space-y-2">
                    {category.articles.map((article, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <i className="fas fa-file-alt text-esimphony-gray mr-3"></i>
                        <span className="text-sm">{article}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Contact Support
          </h2>
          
          {submitComplete ? (
            <div className="text-center py-8">
              <i className="fas fa-check-circle text-4xl text-esimphony-success mb-4"></i>
              <h3 className="text-lg font-semibold text-esimphony-black mb-2">
                Message Sent!
              </h3>
              <p className="text-esimphony-gray">
                We'll get back to you within 24 hours
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-esimphony-gray mb-1">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="What can we help you with?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-esimphony-gray mb-1">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-esimphony-white text-esimphony-black border border-gray-300 rounded-esim transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-esimphony-red focus:border-esimphony-red placeholder:text-gray-500 min-h-[120px] resize-none"
                  placeholder="Please describe your issue in detail..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </Card>

      {/* Account Information */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Account Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-esimphony-gray">Name:</span>
              <span>{user.firstName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-esimphony-gray">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-esimphony-gray">Balance:</span>
              <span className="font-semibold">${user.balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-esimphony-gray">Account Type:</span>
              <span className="capitalize">{user.accountType.replace('-', ' ')}</span>
            </div>
            {user.activePlan && (
              <div className="flex justify-between">
                <span className="text-esimphony-gray">Active Plan:</span>
                <span className="text-esimphony-success">{user.activePlan.name}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Support Hours */}
      <Card className="mb-20">
        <div className="p-6 text-center">
          <i className="fas fa-clock text-2xl text-esimphony-gray mb-3"></i>
          <h3 className="font-semibold text-esimphony-black mb-2">
            Support Hours
          </h3>
          <p className="text-esimphony-gray text-sm mb-1">
            Monday - Friday: 8:00 AM - 8:00 PM EST
          </p>
          <p className="text-esimphony-gray text-sm">
            Saturday - Sunday: 10:00 AM - 6:00 PM EST
          </p>
        </div>
      </Card>
      </div>
    </AppLayout>
  )
}