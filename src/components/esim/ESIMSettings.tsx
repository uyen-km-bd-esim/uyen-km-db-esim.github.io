'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { User } from '@/types'

interface ActivationData {
  smdpAddress: string
  activationCode: string
  confirmationCode: string
}

export function ESIMSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [activationData] = useState<ActivationData>({
    smdpAddress: '1$rsp.esimphony.com$2022030001',
    activationCode: 'AC-SIM123456789',
    confirmationCode: 'CONF-789123'
  })
  const [devicePlatform, setDevicePlatform] = useState<'ios' | 'android' | 'unknown'>('unknown')
  const router = useRouter()

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }

    // Check if user has eSIM profile - this page should only be accessible when eSIM profile exists
    if (!userProfile.esimStatus || userProfile.esimStatus === 'none') {
      router.push('/dashboard')
      return
    }
    
    setUser(userProfile)

    // Detect device platform for platform-specific instructions
    const userAgent = navigator.userAgent
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDevicePlatform('ios')
    } else if (/Android/.test(userAgent)) {
      setDevicePlatform('android')
    }
  }, [router])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${type} copied to clipboard!`)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showToast(`${type} copied to clipboard!`)
    })
  }

  const showToast = (message: string) => {
    // Create toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-esimphony-success text-white px-4 py-2 rounded-lg z-50'
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  const getPlatformInstructions = () => {
    if (devicePlatform === 'ios') {
      return {
        step1: 'Go to Settings > Cellular > Add Cellular Plan',
        step2: 'Scan the QR code above with your device camera',
        step3: 'Follow the on-screen prompts to complete activation',
        step4: 'Enable eSIM, turn on Data Roaming, and set APN to esimphony.flex'
      }
    } else if (devicePlatform === 'android') {
      return {
        step1: 'Go to Settings > Network & Internet > Mobile Network',
        step2: 'Select "Add Carrier" or "Add eSIM"',
        step3: 'Scan QR code or enter activation details manually',
        step4: 'Enable Data Roaming and configure APN to esimphony.flex'
      }
    } else {
      return {
        step1: 'iOS: Settings > Cellular > Add Cellular Plan\nAndroid: Settings > Network & Internet > Mobile Network',
        step2: 'Scan the QR code above with your device camera',
        step3: 'Follow the on-screen prompts to complete activation',
        step4: 'Enable eSIM, turn on Data Roaming, and set APN to esimphony.flex'
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-esimphony-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
      </div>
    )
  }

  const instructions = getPlatformInstructions()

  return (
    <div className="min-h-screen bg-esimphony-black">
      <div className="container-esimphony pt-4 pb-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="text-esimphony-white hover:text-esimphony-red mr-4">
            <i className="fas fa-arrow-left text-xl"></i>
          </Link>
          <h1 className="text-xl font-bold text-esimphony-white">
            eSIM Settings
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* eSIM Activation Details */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-esimphony-black mb-4 flex items-center">
                <i className="fas fa-qrcode text-esimphony-red mr-3"></i>
                Activation Details
              </h2>

              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-qrcode text-4xl text-esimphony-gray mb-2"></i>
                    <div className="text-sm text-esimphony-gray">
                      📱 Scan with your device
                    </div>
                    <div className="text-xs text-esimphony-gray mt-1">
                      QR Code will appear here
                    </div>
                  </div>
                </div>
                <p className="text-esimphony-gray text-sm">
                  <strong>Scan this QR code</strong> with your device camera or use manual setup below
                </p>
              </div>

              {/* Manual Activation Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-esimphony-black mb-4">Manual Entry Details</h3>
                
                <div className="space-y-4">
                  {/* SM-DP+ Address */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-semibold text-esimphony-black">SM-DP+ Address:</span>
                    <div className="flex-1 sm:max-w-xs">
                      <div 
                        className="bg-white p-3 rounded border font-mono text-sm cursor-pointer hover:bg-gray-50 relative flex items-center justify-between"
                        onClick={() => copyToClipboard(activationData.smdpAddress, 'SM-DP+ Address')}
                      >
                        <span className="truncate">{activationData.smdpAddress}</span>
                        <i className="fas fa-copy text-esimphony-gray hover:text-esimphony-red ml-2"></i>
                      </div>
                    </div>
                  </div>

                  {/* Activation Code */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-semibold text-esimphony-black">Activation Code:</span>
                    <div className="flex-1 sm:max-w-xs">
                      <div 
                        className="bg-white p-3 rounded border font-mono text-sm cursor-pointer hover:bg-gray-50 relative flex items-center justify-between"
                        onClick={() => copyToClipboard(activationData.activationCode, 'Activation Code')}
                      >
                        <span>{activationData.activationCode}</span>
                        <i className="fas fa-copy text-esimphony-gray hover:text-esimphony-red ml-2"></i>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Code */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-semibold text-esimphony-black">Confirmation Code:</span>
                    <div className="flex-1 sm:max-w-xs">
                      <div 
                        className="bg-white p-3 rounded border font-mono text-sm cursor-pointer hover:bg-gray-50 relative flex items-center justify-between"
                        onClick={() => copyToClipboard(activationData.confirmationCode, 'Confirmation Code')}
                      >
                        <span>{activationData.confirmationCode}</span>
                        <i className="fas fa-copy text-esimphony-gray hover:text-esimphony-red ml-2"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Setup Instructions */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-esimphony-black mb-4 flex items-center">
                <i className="fas fa-list-ol text-esimphony-red mr-3"></i>
                Setup Instructions
                {devicePlatform !== 'unknown' && (
                  <span className="ml-2 text-sm bg-esimphony-info text-white px-2 py-1 rounded-full">
                    {devicePlatform.toUpperCase()}
                  </span>
                )}
              </h2>
              
              {/* Step-by-step instructions */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-esimphony-red">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-0.5">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Open Device Settings</div>
                      <div className="text-sm text-esimphony-gray whitespace-pre-line">
                        {instructions.step1}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-esimphony-red">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-0.5">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Scan QR Code or Add Manually</div>
                      <div className="text-sm text-esimphony-gray">
                        {instructions.step2}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-esimphony-red">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-0.5">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Complete Setup</div>
                      <div className="text-sm text-esimphony-gray">
                        {instructions.step3}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-esimphony-red">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-esimphony-red rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-0.5">
                      4
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-esimphony-black mb-1">Enable eSIM and Configure</div>
                      <div className="text-sm text-esimphony-gray">
                        {instructions.step4}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Configuration Note */}
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="fas fa-exclamation-triangle text-esimphony-red mt-0.5 mr-2"></i>
                  <div className="text-sm">
                    <strong className="text-red-800">Important Configuration:</strong>
                    <div className="text-red-700 mt-1">
                      • Ensure <strong>Data Roaming</strong> is enabled<br/>
                      • Set <strong>APN</strong> to <strong>esimphony.flex</strong><br/>
                      • You may need to restart your device after installation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button variant="primary" className="w-full">
                <i className="fas fa-home mr-2"></i>
                Back to Dashboard
              </Button>
            </Link>
            
            <Link href="/activate-esim" className="block">
              <Button variant="secondary" className="w-full">
                <i className="fas fa-mobile-alt mr-2"></i>
                Try Automatic Activation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}