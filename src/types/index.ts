// User types
export interface User {
  firstName: string
  lastName?: string
  email: string
  balance: number
  activePlan?: Plan | null
  accountType: 'no-balance' | 'has-balance' | 'has-plan' | 'new' | 'regular'
  esimStatus?: 'available' | 'active' | 'inactive'
  activationBehavior?: 'success' | 'fail'
  usageData?: {
    planName: string
    dataUsed: number
    dataTotal: number
    expirationDays: number
  }
  autoRenewal?: {
    enabled: boolean
    renewalDate?: string
    renewalAmount?: number
    preferredTopUpAmount?: number
  }
  promotions?: {
    hasReferralBonus?: boolean
    seasonalOffers?: string[]
    regionalPromotions?: string[]
  }
}

// eSIM Plan types
export interface Plan {
  id: string
  name: string
  country: string
  region: string
  data: string
  validity: string
  price: number
  description?: string
  features: string[]
  type: 'prepaid' | 'postpaid' | 'subscription' | 'payg'
  dataUsed?: number
  dataTotal?: number
  daysLeft?: number
}

// Promotion types
export interface Promotion {
  id: string
  title: string
  subtitle?: string
  description: string
  imageUrl?: string
  buttonText: string
  buttonAction: string
  type: 'referral' | 'seasonal' | 'regional'
  isActive: boolean
  validUntil?: string
}

// Demo account types
export interface DemoAccount {
  email: string
  password: string
  profile: User
  description?: string
}

// Navigation types
export interface NavigationState {
  topUpSource?: 'home-dashboard' | 'tariff-details-balance' | 'tariff-details-change'
  planChangeSource?: 'home-dashboard'
  planChangeData?: Plan | null
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  email: string
  password: string
  confirmPassword: string
}

export interface TopUpForm {
  amount: number
  paymentMethod: 'stripe' | 'card'
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}