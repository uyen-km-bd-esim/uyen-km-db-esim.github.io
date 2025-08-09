'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { User } from '@/types'

interface Transaction {
  id: string
  date: string
  amount: string
  description: string
  paymentMethod: string
  status: 'success' | 'failed' | 'pending'
  type: 'topup' | 'purchase'
}

interface MonthlyData {
  name: string
  totalTopUp: number
  totalSpent: number
  closingBalance: number
  transactions: Transaction[]
}

type TransactionData = {
  [key: string]: MonthlyData
}

export function TopUpHistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [periodFilter, setPeriodFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedMonth, setExpandedMonth] = useState<string>('')
  const router = useRouter()

  // Mock transaction data
  const sampleTransactions: TransactionData = {
    '2024-12': {
      name: 'December 2024',
      totalTopUp: 50.00,
      totalSpent: 25.00,
      closingBalance: 45.00,
      transactions: [
        {
          id: '1',
          date: '2024-12-10',
          amount: '+$25.00',
          description: 'Top-Up via Credit Card',
          paymentMethod: 'Visa ****1234',
          status: 'success',
          type: 'topup'
        },
        {
          id: '2',
          date: '2024-12-08',
          amount: '-$15.00',
          description: 'Euro Data Pass Purchase',
          paymentMethod: 'Account Balance',
          status: 'success',
          type: 'purchase'
        },
        {
          id: '3',
          date: '2024-12-05',
          amount: '+$25.00',
          description: 'Top-Up via PayPal',
          paymentMethod: 'PayPal',
          status: 'success',
          type: 'topup'
        },
        {
          id: '4',
          date: '2024-12-03',
          amount: '-$10.00',
          description: 'US Travel Plan Purchase',
          paymentMethod: 'Account Balance',
          status: 'success',
          type: 'purchase'
        }
      ]
    },
    '2024-11': {
      name: 'November 2024',
      totalTopUp: 75.00,
      totalSpent: 55.00,
      closingBalance: 20.00,
      transactions: [
        {
          id: '5',
          date: '2024-11-28',
          amount: '+$50.00',
          description: 'Top-Up via Credit Card',
          paymentMethod: 'Mastercard ****5678',
          status: 'success',
          type: 'topup'
        },
        {
          id: '6',
          date: '2024-11-25',
          amount: '-$30.00',
          description: 'Global Roaming Plan',
          paymentMethod: 'Account Balance',
          status: 'success',
          type: 'purchase'
        },
        {
          id: '7',
          date: '2024-11-20',
          amount: '+$25.00',
          description: 'Top-Up via Apple Pay',
          paymentMethod: 'Apple Pay',
          status: 'success',
          type: 'topup'
        },
        {
          id: '8',
          date: '2024-11-15',
          amount: '-$25.00',
          description: 'Europe Travel Plan',
          paymentMethod: 'Account Balance',
          status: 'success',
          type: 'purchase'
        },
        {
          id: '9',
          date: '2024-11-10',
          amount: '+$15.00',
          description: 'Failed Top-Up (Refunded)',
          paymentMethod: 'Visa ****1234',
          status: 'failed',
          type: 'topup'
        }
      ]
    }
  }

  const [currentTransactionData, setCurrentTransactionData] = useState<TransactionData>(sampleTransactions)

  useEffect(() => {
    const userProfile = storage.get('userProfile')
    const isAuthenticated = storage.get('isAuthenticated')
    
    if (!isAuthenticated || !userProfile) {
      router.push('/login')
      return
    }
    
    setUser(userProfile)
    setIsLoading(false)
    
    // Auto-expand current month after component loads
    setTimeout(() => {
      setExpandedMonth('2024-12')
    }, 100)
  }, [router])

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.status === 'failed') return 'fa-times'
    if (transaction.status === 'pending') return 'fa-clock'
    if (transaction.type === 'topup') return 'fa-plus'
    return 'fa-shopping-cart'
  }

  const getPaymentMethodIcon = (paymentMethod: string) => {
    if (paymentMethod.includes('Visa')) {
      return <div className="w-6 h-4 bg-blue-800 rounded text-white text-xs font-bold flex items-center justify-center">VISA</div>
    } else if (paymentMethod.includes('Mastercard')) {
      return <div className="w-6 h-4 bg-red-600 rounded text-white text-xs font-bold flex items-center justify-center">MC</div>
    } else if (paymentMethod.includes('PayPal')) {
      return <div className="w-6 h-4 bg-blue-900 rounded text-white text-xs font-bold flex items-center justify-center">PP</div>
    } else if (paymentMethod.includes('Apple')) {
      return <div className="w-6 h-4 bg-black rounded text-white text-xs font-bold flex items-center justify-center">AP</div>
    }
    return <div className="w-6 h-4 bg-gray-500 rounded text-white text-xs font-bold flex items-center justify-center">AC</div>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const toggleMonth = (monthKey: string) => {
    setExpandedMonth(expandedMonth === monthKey ? '' : monthKey)
  }

  const filterTransactions = () => {
    let filteredData = { ...sampleTransactions }
    
    // Apply period filter
    if (periodFilter === 'current') {
      filteredData = { '2024-12': sampleTransactions['2024-12'] }
    } else if (periodFilter === 'last') {
      filteredData = { '2024-11': sampleTransactions['2024-11'] }
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      Object.keys(filteredData).forEach(monthKey => {
        filteredData[monthKey].transactions = filteredData[monthKey].transactions.filter(
          transaction => transaction.status === statusFilter
        )
      })
      
      // Remove months with no transactions
      Object.keys(filteredData).forEach(monthKey => {
        if (filteredData[monthKey].transactions.length === 0) {
          delete filteredData[monthKey]
        }
      })
    }
    
    setCurrentTransactionData(filteredData)
  }

  const getSummary = () => {
    let totalTopUp = 0
    let totalSpent = 0
    let transactionCount = 0
    
    Object.values(currentTransactionData).forEach(monthData => {
      totalTopUp += monthData.totalTopUp
      totalSpent += monthData.totalSpent
      transactionCount += monthData.transactions.length
    })
    
    return { totalTopUp, totalSpent, transactionCount }
  }

  useEffect(() => {
    filterTransactions()
  }, [periodFilter, statusFilter])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container-esimphony flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-esimphony-red" />
        </div>
      </AppLayout>
    )
  }

  if (!user) return null

  const summary = getSummary()

  return (
    <AppLayout>
      <div className="container-esimphony pt-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-esimphony-white">
            Top-Up History
          </h1>
        </div>

        {/* Account Summary */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
              <i className="fas fa-wallet text-esimphony-red mr-2"></i>
              Account Summary
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-esimphony-red to-red-400 rounded-xl text-white">
                <div className="text-2xl font-bold">${user.balance.toFixed(2)}</div>
                <div className="text-sm opacity-90">Current Balance</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-xl">
                <div className="text-2xl font-bold text-esimphony-black">${summary.totalTopUp.toFixed(2)}</div>
                <div className="text-sm text-esimphony-gray">Total Top-Up</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-xl">
                <div className="text-2xl font-bold text-esimphony-black">${summary.totalSpent.toFixed(2)}</div>
                <div className="text-sm text-esimphony-gray">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-xl">
                <div className="text-2xl font-bold text-esimphony-black">{summary.transactionCount}</div>
                <div className="text-sm text-esimphony-gray">Transactions</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Compact Filter Icon */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-filter text-esimphony-red"></i>
            <span className="text-sm text-esimphony-black">Filter</span>
            {(periodFilter !== 'all' || statusFilter !== 'all') && (
              <div className="w-2 h-2 bg-esimphony-red rounded-full"></div>
            )}
          </button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <Card className="mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-esimphony-gray mb-2">
                    Period
                  </label>
                  <select 
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-esimphony-black text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="current">Current Month</option>
                    <option value="last">Last Month</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="6months">Last 6 Months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-esimphony-gray mb-2">
                    Status
                  </label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-esimphony-black text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Successful</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-sm bg-gray-100 text-esimphony-black hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Transaction History */}
        <Card className="mb-20">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-esimphony-black mb-4 flex items-center">
              <i className="fas fa-history text-esimphony-red mr-2"></i>
              Transaction History
            </h3>
            
            {Object.keys(currentTransactionData).length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-credit-card text-4xl text-esimphony-gray mb-4 opacity-50"></i>
                <h4 className="text-lg font-semibold text-esimphony-black mb-2">
                  No Transactions Found
                </h4>
                <p className="text-esimphony-gray">
                  No top-up transactions found for the selected filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(currentTransactionData).map(([monthKey, monthData]) => (
                  <div key={monthKey} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleMonth(monthKey)}
                      className="w-full p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-esimphony-black text-left">
                          {monthData.name}
                        </div>
                        <i className={`fas fa-chevron-down text-esimphony-gray transition-transform ${
                          expandedMonth === monthKey ? 'rotate-180' : ''
                        }`}></i>
                      </div>
                      <div className="flex justify-between text-xs text-esimphony-gray">
                        <span>Top-Up: <span className="text-esimphony-black font-medium">+${monthData.totalTopUp.toFixed(2)}</span></span>
                        <span>Spent: <span className="text-esimphony-black font-medium">-${monthData.totalSpent.toFixed(2)}</span></span>
                        <span>Balance: <span className="text-esimphony-black font-medium">${monthData.closingBalance.toFixed(2)}</span></span>
                      </div>
                    </button>
                    
                    {expandedMonth === monthKey && (
                      <div className="border-t border-gray-200 p-4">
                        <div className="space-y-3">
                          {monthData.transactions.map((transaction) => (
                            <div key={transaction.id} className="py-3 border-b border-gray-100 last:border-b-0">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <i className={`fas ${getTransactionIcon(transaction)} w-4 h-4 ${
                                      transaction.status === 'success' ? 'text-esimphony-success' :
                                      transaction.status === 'failed' ? 'text-esimphony-danger' :
                                      'text-esimphony-warning'
                                    }`}></i>
                                    <span className="font-semibold text-lg text-esimphony-black">
                                      {transaction.amount}
                                    </span>
                                  </div>
                                  <span className="text-sm text-esimphony-gray">
                                    {formatDate(transaction.date)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {getPaymentMethodIcon(transaction.paymentMethod)}
                                    <span className="text-sm text-esimphony-gray">{transaction.paymentMethod}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    transaction.status === 'success' ? 'bg-green-100 text-esimphony-success' :
                                    transaction.status === 'failed' ? 'bg-red-100 text-esimphony-danger' :
                                    'bg-yellow-100 text-esimphony-warning'
                                  }`}>
                                    {transaction.status.toUpperCase()}
                                  </span>
                                </div>
                                
                                <div className="text-sm text-esimphony-gray">
                                  {transaction.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}