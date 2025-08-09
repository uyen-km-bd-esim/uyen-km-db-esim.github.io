import { DemoAccount, User, Plan, Promotion } from '@/types'

// Demo plans data
export const DEMO_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Euro Data Pass',
    country: 'Europe',
    region: 'European Union',
    data: '20GB',
    validity: '30 days',
    price: 25.00,
    description: 'Perfect for European travel',
    features: ['High-speed 5G', 'EU-wide coverage', 'Hotspot included'],
    type: 'prepaid',
    dataUsed: 8.5,
    dataTotal: 20,
    daysLeft: 18
  },
  {
    id: '2',
    name: 'Global Traveler',
    country: 'Worldwide',
    region: 'Global',
    data: '10GB',
    validity: '15 days',
    price: 35.00,
    description: 'Worldwide connectivity',
    features: ['Global coverage', '5G where available', 'Data rollover'],
    type: 'prepaid'
  },
  {
    id: '3',
    name: 'Asia Pacific',
    country: 'Asia',
    region: 'APAC',
    data: '15GB',
    validity: '21 days',
    price: 20.00,
    description: 'Asian countries coverage',
    features: ['High-speed data', 'Multi-country', 'Instant activation'],
    type: 'prepaid'
  },
  {
    id: '4',
    name: 'US Prepaid 10GB',
    country: 'United States',
    region: 'North America',
    data: '10GB',
    validity: '30 days',
    price: 15.00,
    description: 'USA domestic coverage',
    features: ['5G network', 'Unlimited texts', 'Voice included'],
    type: 'prepaid',
    dataUsed: 2.3,
    dataTotal: 10,
    daysLeft: 23
  }
]

// Demo promotions data
export const DEMO_PROMOTIONS: Promotion[] = [
  {
    id: 'referral-2024',
    title: 'Refer & Earn',
    subtitle: 'Get $5 for each friend',
    description: 'Invite friends to eSimphony and earn $5 credit for every successful referral!',
    buttonText: 'Refer Now',
    buttonAction: 'referral',
    type: 'referral',
    isActive: true,
    validUntil: 'Dec 31, 2024'
  },
  {
    id: 'winter-2024',
    title: 'Winter Travel Sale',
    subtitle: '25% off Europe plans',
    description: 'Beat the winter blues with 25% off all European eSIM plans. Perfect for skiing trips!',
    buttonText: 'Browse Plans',
    buttonAction: 'plans',
    type: 'seasonal',
    isActive: true,
    validUntil: 'Mar 15, 2024'
  },
  {
    id: 'asia-special',
    title: 'Asia Explorer',
    subtitle: 'Free extra 5GB',
    description: 'Book any Asia-Pacific plan and get an extra 5GB data bonus for your adventures.',
    buttonText: 'Explore Asia',
    buttonAction: 'plans',
    type: 'regional',
    isActive: true,
    validUntil: 'Feb 28, 2024'
  }
]

// Demo accounts
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'nobalance@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'nobalance@esim.demo',
      balance: 0.00,
      activePlan: null,
      accountType: 'no-balance'
    },
    description: 'New user with no balance and no active plans. Perfect for testing first-time user flows and top-up processes.'
  },
  {
    email: 'exist-topup@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'exist-topup@esim.demo',
      balance: 25.00,
      activePlan: null,
      accountType: 'has-balance',
      promotions: {
        hasReferralBonus: true,
        seasonalOffers: ['winter-2024'],
        regionalPromotions: ['asia-special']
      }
    },
    description: 'User with existing balance but no active plans. Ideal for testing plan purchase flows without needing to top up first.'
  },
  {
    email: 'exist-plan@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Michael',
      lastName: 'Rodriguez',
      email: 'exist-plan@esim.demo',
      balance: 45.00,
      activePlan: DEMO_PLANS[0], // Euro Data Pass
      accountType: 'has-plan',
      autoRenewal: {
        enabled: true,
        renewalDate: 'Feb 15, 2024',
        renewalAmount: 25
      }
    },
    description: 'User with balance and an active plan. Perfect for testing plan management, plan changes, and renewal flows.'
  },
  {
    email: 'esim-available@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'esim-available@esim.demo',
      balance: 35.00,
      activePlan: null,
      accountType: 'has-balance',
      esimStatus: 'available'
    },
    description: 'User with eSIM ready for activation. Shows "Activate eSIM" section on home dashboard with activation button.'
  },
  {
    email: 'esim-active@esim.demo',
    password: '123456',
    profile: {
      firstName: 'David',
      lastName: 'Kim',
      email: 'esim-active@esim.demo',
      balance: 52.00,
      activePlan: DEMO_PLANS[3], // US Prepaid 10GB
      accountType: 'has-plan',
      esimStatus: 'active',
      usageData: {
        planName: 'US Prepaid Plan',
        dataUsed: 2.3,
        dataTotal: 10,
        expirationDays: 23
      }
    },
    description: 'User with active eSIM and data usage. Displays usage statistics, data consumption, and expiration information on home dashboard.'
  },
  {
    email: 'esim-fail@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Lisa',
      lastName: 'Martinez',
      email: 'esim-fail@esim.demo',
      balance: 30.00,
      activePlan: null,
      accountType: 'has-balance',
      esimStatus: 'available',
      activationBehavior: 'fail'
    },
    description: 'Test account that always fails automatic eSIM activation, forcing manual setup flow. Perfect for testing error handling and manual activation process.'
  },
  {
    email: 'esim-success@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Ryan',
      lastName: 'Chang',
      email: 'esim-success@esim.demo',
      balance: 40.00,
      activePlan: null,
      accountType: 'has-balance',
      esimStatus: 'available',
      activationBehavior: 'success'
    },
    description: 'Test account that always succeeds in automatic eSIM activation. Ideal for testing successful activation flow and transition to active state.'
  },
  {
    email: 'esim-installed@esim.demo',
    password: '123456',
    profile: {
      firstName: 'Sofia',
      lastName: 'Patel',
      email: 'esim-installed@esim.demo',
      balance: 28.00,
      activePlan: null,
      accountType: 'has-balance',
      esimStatus: 'installed'
    },
    description: 'User with eSIM profile installed but needs configuration. Shows eSIM Settings section on dashboard for manual setup and activation guide.'
  }
]

// Helper functions
export function getDemoAccount(email: string, password: string): DemoAccount | null {
  return DEMO_ACCOUNTS.find(account => 
    account.email === email && account.password === password
  ) || null
}

export function getDemoAccountByEmail(email: string): DemoAccount | null {
  return DEMO_ACCOUNTS.find(account => account.email === email) || null
}

export function getPlanById(id: string): Plan | null {
  return DEMO_PLANS.find(plan => plan.id === id) || null
}