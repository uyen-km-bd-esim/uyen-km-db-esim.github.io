'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { getDemoAccount } from '@/lib/demo-data'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Check for demo accounts
      const demoAccount = getDemoAccount(email, password)
      
      if (demoAccount) {
        // Store user data
        storage.set('userProfile', demoAccount.profile)
        storage.set('isAuthenticated', true)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
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
          <h1 className="text-xl font-semibold text-esimphony-white mb-2">Welcome Back</h1>
          <p className="text-esimphony-gray">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 p-4 border border-esimphony-gray/30 rounded-esim">
          <h3 className="text-sm font-semibold text-esimphony-white mb-3">Demo Accounts:</h3>
          <div className="space-y-2 text-xs text-esimphony-gray">
            <div>
              <strong>No Balance:</strong> nobalance@esim.demo / 123456
            </div>
            <div>
              <strong>Has Balance:</strong> exist-topup@esim.demo / 123456
            </div>
            <div>
              <strong>Active Plan:</strong> exist-plan@esim.demo / 123456
            </div>
          </div>
        </div>

        {/* Social Login */}
        <div className="mt-6 space-y-3">
          <div className="text-center text-esimphony-gray text-sm mb-4">
            Or continue with
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

        {/* Register Link */}
        <div className="mt-8 text-center">
          <span className="text-esimphony-gray">Don't have an account? </span>
          <Link href="/register" className="text-esimphony-red hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}