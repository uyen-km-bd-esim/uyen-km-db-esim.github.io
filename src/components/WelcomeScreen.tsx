'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function WelcomeScreen() {
  return (
    <div className="container-esimphony flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-[340px] mx-auto">
        <h1 className="text-4xl font-bold text-esimphony-white mb-4 tracking-tight">
          eSimphony
        </h1>
        <p className="text-lg font-normal text-esimphony-white/90 leading-relaxed mb-8">
          Get connected with eSIM plans in seconds.
        </p>
      </div>
      
      <div className="max-w-[340px] mx-auto w-full space-y-4">
        <Link href="/register">
          <Button variant="primary" className="w-full">
            Sign Up
          </Button>
        </Link>
        
        <Link href="/login">
          <Button variant="secondary" className="w-full">
            Log In
          </Button>
        </Link>
        
        {/* Demo Support Link */}
        <div className="text-center mt-8 pt-4 border-t border-gray-700">
          <Link 
            href="/demo-support" 
            className="text-esimphony-gray hover:text-esimphony-white text-sm transition-colors duration-200"
          >
            <i className="fas fa-flask mr-2"></i>
            Demo Support & Testing Guide
          </Link>
        </div>
      </div>
    </div>
  )
}