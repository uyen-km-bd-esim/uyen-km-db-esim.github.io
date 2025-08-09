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
            My Profile
          </h1>
          <p className="text-esimphony-gray text-sm">Manage your account settings</p>
        </div>

      {/* Profile Information */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-esimphony-black">
              Personal Information
            </h2>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleEditToggle}
            >
              {isEditing ? (
                <>
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </>
              ) : (
                <>
                  <i className="fas fa-edit mr-2"></i>
                  Edit
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-esimphony-gray mb-1">
                First Name
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-esim">
                  {user.firstName}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-esimphony-gray mb-1">
                Email Address
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <div className="py-3 px-4 bg-gray-50 rounded-esim">
                  {user.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-esimphony-gray mb-1">
                Account Type
              </label>
              <div className="py-3 px-4 bg-gray-50 rounded-esim">
                <span className="capitalize">{user.accountType.replace('-', ' ')}</span>
                {user.accountType.startsWith('exist') && (
                  <span className="ml-2 text-xs bg-esimphony-success text-white px-2 py-1 rounded">
                    Demo Account
                  </span>
                )}
              </div>
            </div>

            {isEditing && (
              <Button 
                variant="primary" 
                onClick={handleSave}
                className="w-full"
              >
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Account Balance */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Account Balance
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold text-esimphony-black">
                ${user.balance.toFixed(2)}
              </div>
              <p className="text-esimphony-gray text-sm">Available balance</p>
            </div>
            <Link href="/top-up">
              <Button variant="topup" size="sm">
                <i className="fas fa-plus mr-2"></i>
                Add Funds
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Active Plan */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Current Plan
          </h2>
          {user.activePlan ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-esimphony-black">
                    {user.activePlan.name}
                  </h3>
                  <p className="text-esimphony-gray text-sm">
                    {user.activePlan.country} • {user.activePlan.data}
                  </p>
                </div>
                <span className="text-esimphony-success text-sm font-medium">
                  <i className="fas fa-circle mr-1"></i>Active
                </span>
              </div>
              
              {user.activePlan.dataUsed !== undefined && user.activePlan.dataTotal !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Usage</span>
                    <span>{user.activePlan.dataUsed}GB / {user.activePlan.dataTotal}GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-esimphony-success h-2 rounded-full"
                      style={{ width: `${(user.activePlan.dataUsed / user.activePlan.dataTotal) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4">
                <div>
                  {user.activePlan.daysLeft && (
                    <p className="text-sm text-esimphony-gray">
                      <i className="fas fa-calendar mr-1"></i>
                      {user.activePlan.daysLeft} days remaining
                    </p>
                  )}
                </div>
                <Link href="/plans">
                  <Button variant="secondary" size="sm">
                    Change Plan
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-sim-card text-4xl text-esimphony-gray mb-4"></i>
              <h3 className="font-semibold text-esimphony-black mb-2">No Active Plan</h3>
              <p className="text-esimphony-gray mb-4">Choose an eSIM plan to get started</p>
              <Link href="/plans">
                <Button variant="primary" size="sm">
                  Browse Plans
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-esimphony-black mb-4">
            Account Actions
          </h2>
          <div className="space-y-3">
            <Link href="/demo-support" className="block">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
                <div className="flex items-center">
                  <i className="fas fa-flask text-esimphony-gray mr-3"></i>
                  <span>Demo Reset</span>
                </div>
                <i className="fas fa-chevron-right text-esimphony-gray"></i>
              </div>
            </Link>

            <Link href="/support" className="block">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-esim cursor-pointer">
                <div className="flex items-center">
                  <i className="fas fa-headset text-esimphony-gray mr-3"></i>
                  <span>Support</span>
                </div>
                <i className="fas fa-chevron-right text-esimphony-gray"></i>
              </div>
            </Link>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-esim cursor-pointer text-red-600"
            >
              <div className="flex items-center">
                <i className="fas fa-sign-out-alt mr-3"></i>
                <span>Sign Out</span>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </Card>
      </div>
    </AppLayout>
  )
}