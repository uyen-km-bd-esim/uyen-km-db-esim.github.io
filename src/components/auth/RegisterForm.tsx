'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      // Create new user profile
      const newUser = {
        firstName: formData.firstName,
        email: formData.email,
        balance: 0.00,
        activePlan: null,
        accountType: 'new' as const
      }

      // Store user data
      storage.set('userProfile', newUser)
      storage.set('isAuthenticated', true)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container-esimphony">
      <div className="max-w-[340px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-esimphony-white mb-4 inline-block">
            eSimphony
          </Link>
          <h1 className="text-xl font-semibold text-esimphony-white mb-2">Create Account</h1>
          <p className="text-esimphony-gray">Sign up to get started</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>

        {/* Social Registration */}
        <div className="mt-6 space-y-3">
          <div className="text-center text-esimphony-gray text-sm mb-4">
            Or register with
          </div>
          
          <Button variant="secondary" className="w-full">
            <i className="fab fa-google mr-2"></i>
            Continue with Google
          </Button>
          
          <Button variant="secondary" className="w-full">
            <i className="fab fa-apple mr-2"></i>
            Continue with Apple
          </Button>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <span className="text-esimphony-gray">Already have an account? </span>
          <Link href="/login" className="text-esimphony-red hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}