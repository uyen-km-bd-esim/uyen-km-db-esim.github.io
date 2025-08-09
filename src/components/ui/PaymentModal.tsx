'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { User } from '@/types'
import { storage } from '@/lib/utils'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUserUpdate: (user: User) => void
  prefilledAmount?: number
}

export function PaymentModal({ isOpen, onClose, user, onUserUpdate, prefilledAmount }: PaymentModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(prefilledAmount || null)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [cardTab, setCardTab] = useState<'saved' | 'new'>('new')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [savedCard, setSavedCard] = useState<any>(null)

  const predefinedAmounts = [10, 25, 50, 100]

  useEffect(() => {
    if (prefilledAmount) {
      setSelectedAmount(prefilledAmount)
      setCustomAmount('')
      setShowPaymentForm(true) // Skip to payment form when amount is pre-filled
    }
  }, [prefilledAmount])

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setPaymentComplete(false)
      setIsProcessing(false)
      setPaymentError(null)
      
      // Load saved card if exists
      const lastCard = storage.get('lastCardPayment')
      if (lastCard) {
        setSavedCard(lastCard)
        setCardTab('saved')
      }
      
      // If pre-filled amount, skip to payment form
      if (prefilledAmount) {
        setShowPaymentForm(true)
      } else {
        setShowPaymentForm(false)
      }
    }
  }, [isOpen, prefilledAmount])

  const getTopUpAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleProceedToPayment = () => {
    const amount = getTopUpAmount()
    if (amount <= 0) return
    setShowPaymentForm(true)
  }

  const handlePaymentMethodSelect = (method: 'card' | 'apple' | 'google') => {
    setPaymentMethod(method)
    setPaymentError(null)
  }

  const handleCardDetailsChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }))
    setPaymentError(null)
  }

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '')
    if (/^4/.test(number)) return 'visa'
    if (/^5[1-5]/.test(number)) return 'mastercard'
    if (/^3[47]/.test(number)) return 'amex'
    if (/^6/.test(number)) return 'discover'
    return 'card'
  }

  const validateCardDetails = () => {
    if (cardTab === 'saved' && savedCard) {
      return null // Saved card is already validated
    }
    
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails
    
    if (!cardholderName.trim()) return 'Cardholder name is required'
    if (cardNumber.length < 16) return 'Please enter a valid card number'
    if (expiryDate.length < 5) return 'Please enter a valid expiry date'
    if (cvv.length < 3) return 'Please enter a valid CVV'
    
    return null
  }

  const handleBackToAmount = () => {
    setShowPaymentForm(false)
    setPaymentMethod('card')
    setPaymentError(null)
    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    })
    if (savedCard) {
      setCardTab('saved')
    }
  }

  const handlePayment = async () => {
    const amount = getTopUpAmount()
    if (amount <= 0) return

    // Handle Apple Pay/Google Pay
    if (paymentMethod === 'apple' || paymentMethod === 'google') {
      setIsProcessing(true)
      setPaymentError(null)
      
      try {
        // Simulate Apple Pay/Google Pay processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate random payment failure (5% chance)
        if (Math.random() < 0.05) {
          throw new Error(`${paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'} payment failed. Please try again.`)
        }
        
        // Update user balance
        const updatedUser = {
          ...user,
          balance: user.balance + amount
        }
        
        onUserUpdate(updatedUser)
        storage.set('userProfile', updatedUser)
        setIsProcessing(false)
        setPaymentComplete(true)
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose()
          setPaymentComplete(false)
          setSelectedAmount(prefilledAmount || null)
          setCustomAmount('')
          setShowPaymentForm(!!prefilledAmount)
        }, 3000)
        return
      } catch (error) {
        setIsProcessing(false)
        setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
        return
      }
    }

    // Handle card payment
    const validationError = validateCardDetails()
    if (validationError) {
      setPaymentError(validationError)
      return
    }

    setIsProcessing(true)
    setPaymentError(null)
    
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate random payment failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Payment failed. Please check your card details and try again.')
      }
      
      // Save card details for future use (if new card)
      if (cardTab === 'new' && cardDetails.cardNumber) {
        const cardToSave = {
          last4: cardDetails.cardNumber.slice(-4),
          cardType: getCardType(cardDetails.cardNumber),
          cardholderName: cardDetails.cardholderName,
          expiryDate: cardDetails.expiryDate
        }
        storage.set('lastCardPayment', cardToSave)
        setSavedCard(cardToSave)
      }
      
      // Update user balance
      const updatedUser = {
        ...user,
        balance: user.balance + amount
      }
      
      onUserUpdate(updatedUser)
      storage.set('userProfile', updatedUser)
      setIsProcessing(false)
      setPaymentComplete(true)
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose()
        setPaymentComplete(false)
        setSelectedAmount(prefilledAmount || null)
        setCustomAmount('')
        setShowPaymentForm(!!prefilledAmount)
      }, 3000)
    } catch (error) {
      setIsProcessing(false)
      setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    }
  }

  const handleClose = () => {
    if (!isProcessing && !paymentComplete) {
      onClose()
      setSelectedAmount(prefilledAmount || null)
      setCustomAmount('')
      setShowPaymentForm(!!prefilledAmount)
      setPaymentMethod('card')
      setPaymentError(null)
      setCardDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      })
    }
  }

  if (!isOpen) return null

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full text-center">
          <div className="p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-esimphony-black mb-4">
              Payment Successful!
            </h1>
            <p className="text-esimphony-gray mb-2">
              ${getTopUpAmount().toFixed(2)} has been added to your account
            </p>
            <p className="text-lg font-semibold text-esimphony-black mb-6">
              New Balance: ${(user.balance + getTopUpAmount()).toFixed(2)}
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-esimphony-red mx-auto" />
            <p className="text-esimphony-gray text-sm mt-4">
              Closing automatically...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-esimphony-black">
                Top-Up Balance
              </h1>
              <p className="text-esimphony-gray text-sm">
                Current Balance: <span className="font-semibold">${user.balance.toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-esimphony-gray hover:text-esimphony-black"
              disabled={isProcessing}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Amount Selection - Only show if not in payment form */}
          {!showPaymentForm && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-esimphony-black mb-4">
                  Select Amount
                </h2>
                
                {/* Predefined Amounts */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      disabled={isProcessing}
                      className={`p-4 rounded-esim border-2 transition-all ${
                        selectedAmount === amount
                          ? 'border-esimphony-red bg-red-50 text-esimphony-red'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-2xl font-bold">${amount}</div>
                      <div className="text-xs text-esimphony-gray">Quick add</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-esimphony-gray mb-2">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-esimphony-gray">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="pl-8"
                      min="1"
                      max="500"
                      step="0.01"
                      disabled={isProcessing}
                    />
                  </div>
                  <p className="text-xs text-esimphony-gray mt-1">
                    Minimum: $1.00 • Maximum: $500.00
                  </p>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              {getTopUpAmount() > 0 && (
                <Button
                  variant="primary"
                  onClick={handleProceedToPayment}
                  className="w-full mb-6"
                >
                  <i className="fas fa-arrow-right mr-2"></i>
                  Proceed to Payment - ${getTopUpAmount().toFixed(2)}
                </Button>
              )}
            </>
          )}

          {/* Payment Form */}
          {showPaymentForm && (
            <>
              {/* Amount Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-esimphony-gray">Top-up Amount:</span>
                  <span className="text-2xl font-bold text-esimphony-black">${getTopUpAmount().toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-esimphony-black mb-4">
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => handlePaymentMethodSelect('card')}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      paymentMethod === 'card'
                        ? 'border-esimphony-red bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <i className="fas fa-credit-card text-2xl mb-2 block"></i>
                    <span className="font-medium">Card</span>
                  </button>
                  
                  <button
                    onClick={() => handlePaymentMethodSelect('apple')}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      paymentMethod === 'apple'
                        ? 'border-esimphony-red bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <i className="fab fa-apple text-2xl mb-2 block"></i>
                    <span className="font-medium">Apple Pay</span>
                  </button>
                  
                  <button
                    onClick={() => handlePaymentMethodSelect('google')}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      paymentMethod === 'google'
                        ? 'border-esimphony-red bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <i className="fab fa-google text-2xl mb-2 block"></i>
                    <span className="font-medium">Google Pay</span>
                  </button>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-red-600 mt-0.5 mr-2"></i>
                    <div className="text-sm text-red-700">{paymentError}</div>
                  </div>
                </div>
              )}

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <>
                  {/* Card Selection Tabs */}
                  {savedCard && (
                    <div className="flex border-b mb-4">
                      <button
                        onClick={() => setCardTab('saved')}
                        className={`px-4 py-2 font-medium ${
                          cardTab === 'saved'
                            ? 'border-b-2 border-esimphony-red text-esimphony-red'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Saved Card
                      </button>
                      <button
                        onClick={() => setCardTab('new')}
                        className={`px-4 py-2 font-medium ${
                          cardTab === 'new'
                            ? 'border-b-2 border-esimphony-red text-esimphony-red'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        New Card
                      </button>
                    </div>
                  )}

                  {/* Saved Card Display */}
                  {cardTab === 'saved' && savedCard && (
                    <div className="p-4 border-2 border-esimphony-red bg-red-50 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {savedCard.cardType === 'visa' && <i className="fab fa-cc-visa text-3xl text-blue-600 mr-3"></i>}
                          {savedCard.cardType === 'mastercard' && <i className="fab fa-cc-mastercard text-3xl text-red-600 mr-3"></i>}
                          {savedCard.cardType === 'amex' && <i className="fab fa-cc-amex text-3xl text-blue-500 mr-3"></i>}
                          {savedCard.cardType === 'discover' && <i className="fab fa-cc-discover text-3xl text-orange-500 mr-3"></i>}
                          {savedCard.cardType === 'card' && <i className="fas fa-credit-card text-3xl text-gray-400 mr-3"></i>}
                          <div>
                            <div className="font-semibold text-esimphony-black">**** **** **** {savedCard.last4}</div>
                            <div className="text-sm text-esimphony-gray">{savedCard.cardholderName}</div>
                            <div className="text-sm text-esimphony-gray">Expires {savedCard.expiryDate}</div>
                          </div>
                        </div>
                        <i className="fas fa-check-circle text-esimphony-red text-xl"></i>
                      </div>
                    </div>
                  )}

                  {/* New Card Form */}
                  {cardTab === 'new' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-esimphony-gray mb-2">
                          Cardholder Name
                        </label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.cardholderName}
                          onChange={(e) => handleCardDetailsChange('cardholderName', e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-esimphony-gray mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.cardNumber}
                            onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                            maxLength={16}
                            disabled={isProcessing}
                            className="pr-12"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {getCardType(cardDetails.cardNumber) === 'visa' && (
                              <i className="fab fa-cc-visa text-2xl text-blue-600"></i>
                            )}
                            {getCardType(cardDetails.cardNumber) === 'mastercard' && (
                              <i className="fab fa-cc-mastercard text-2xl text-red-600"></i>
                            )}
                            {getCardType(cardDetails.cardNumber) === 'amex' && (
                              <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
                            )}
                            {getCardType(cardDetails.cardNumber) === 'discover' && (
                              <i className="fab fa-cc-discover text-2xl text-orange-500"></i>
                            )}
                            {getCardType(cardDetails.cardNumber) === 'card' && cardDetails.cardNumber.length > 0 && (
                              <i className="fas fa-credit-card text-2xl text-gray-400"></i>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-esimphony-gray mb-2">
                            Expiry Date
                          </label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={(e) => handleCardDetailsChange('expiryDate', e.target.value)}
                            maxLength={5}
                            disabled={isProcessing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-esimphony-gray mb-2">
                            CVV
                          </label>
                          <Input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                            maxLength={4}
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Payment Buttons */}
              <div className="space-y-3">
                {!prefilledAmount && (
                  <Button
                    variant="secondary"
                    onClick={handleBackToAmount}
                    disabled={isProcessing}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-esimphony-black border-gray-300"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Amount
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    'Processing Payment...'
                  ) : (
                    <>
                      {paymentMethod === 'apple' && <i className="fab fa-apple mr-2"></i>}
                      {paymentMethod === 'google' && <i className="fab fa-google mr-2"></i>}
                      {paymentMethod === 'card' && <i className="fas fa-credit-card mr-2"></i>}
                      {paymentMethod === 'apple' && `Apple Pay $${getTopUpAmount().toFixed(2)}`}
                      {paymentMethod === 'google' && `Google Pay $${getTopUpAmount().toFixed(2)}`}
                      {paymentMethod === 'card' && `Pay $${getTopUpAmount().toFixed(2)}`}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}