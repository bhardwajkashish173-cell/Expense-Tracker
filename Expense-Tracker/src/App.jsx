import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import ExpenseChart from './components/ExpenseChart'
import Transactions from './components/Transactions'
import TransactionModal from './components/TransactionModal'
import CategoriesView from './components/CategoriesView'
import SettingsView from './components/SettingsView'
import {
  DEFAULT_CATEGORIES,
  CURRENCIES,
  DEFAULT_EXCHANGE_RATES,
  convertCurrency
} from './data/initialData'

const STORAGE_KEY_TRANSACTIONS = 'auren_transactions_v1'
const STORAGE_KEY_CURRENCY = 'auren_currency_v1'
const STORAGE_KEY_RATES = 'auren_rates_v1'

export default function App() {
  // Purely LocalStorage-driven transactions state — strictly NO sample data
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Failed to parse saved transactions:', e)
    }
    return []
  })

  // Selected Currency (Default INR ₹)
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENCY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to parse saved currency:', e)
    }
    return CURRENCIES[0] // INR ₹
  })

  // Exchange Rates state
  const [exchangeRates, setExchangeRates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RATES)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to parse saved rates:', e)
    }
    return DEFAULT_EXCHANGE_RATES
  })

  const [isLiveRates, setIsLiveRates] = useState(false)

  // Active navigation tab ('overview' | 'transactions' | 'analytics' | 'categories' | 'settings')
  const [activeTab, setActiveTab] = useState('overview')

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  // Fetch real-time live currency exchange rates on launch (Free Open API)
  useEffect(() => {
    let isMounted = true
    async function fetchLiveFX() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/INR')
        if (res.ok) {
          const data = await res.json()
          if (data && data.rates && isMounted) {
            setExchangeRates((prev) => {
              const updated = {
                ...prev,
                ...data.rates
              }
              try {
                localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(updated))
              } catch (err) {
                console.error(err)
              }
              return updated
            })
            setIsLiveRates(true)
          }
        }
      } catch (err) {
        // Fallback to local high-accuracy rates if offline
        console.warn('Using baseline exchange rates:', err)
      }
    }
    fetchLiveFX()
    return () => {
      isMounted = false
    }
  }, [])

  // Persist transactions to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions))
    } catch (e) {
      console.error('Failed to save transactions to localStorage:', e)
    }
  }, [transactions])

  // Persist currency to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, JSON.stringify(currency))
    } catch (e) {
      console.error('Failed to save currency to localStorage:', e)
    }
  }, [currency])

  // Real-time financial calculations dynamically converted to currently active currency
  const { totalIncome, totalExpense, totalBalance, savingsRate } = useMemo(() => {
    let income = 0
    let expense = 0

    transactions.forEach((tx) => {
      // Auto-convert from transaction's original currency to currently selected currency
      const convertedAmt = convertCurrency(
        tx.amount,
        tx.currency || 'INR',
        currency.code,
        exchangeRates
      )

      if (tx.type === 'income') {
        income += convertedAmt
      } else {
        expense += convertedAmt
      }
    })

    const balance = income - expense
    const savings = income > 0 ? ((balance / income) * 100).toFixed(1) : 0

    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: balance,
      savingsRate: savings
    }
  }, [transactions, currency.code, exchangeRates])

  // Formatting helper
  const formatAmount = (amt) => {
    return `${currency.symbol}${Number(amt).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  // CRUD actions
  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      // Edit existing
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === transactionData.id ? transactionData : tx))
      )
    } else {
      // Add new
      setTransactions((prev) => [transactionData, ...prev])
    }
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  const handleOpenAddModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx)
    setIsModalOpen(true)
  }

  const handleClearAllData = () => {
    setTransactions([])
  }

  const handleImportData = (newTransactions) => {
    setTransactions(newTransactions)
  }

  return (
    <div className="min-h-screen bg-[#F6F8F5] text-[#19241B] flex flex-col md:flex-row antialiased selection:bg-[#16A34A]/20 selection:text-[#16A34A] font-sans">
      
      {/* Apple-style Frosted Sidebar with Wallet Logo & Green-Yellow Theme */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        totalBalanceFormatted={formatAmount(totalBalance)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col pb-24 md:pb-10">
        
        {/* Top Header with Currency Switcher, Kashish Bhardwaj, KB Avatar */}
        <Header
          onOpenAddModal={handleOpenAddModal}
          currency={currency}
          setCurrency={setCurrency}
          exchangeRates={exchangeRates}
          isLiveRates={isLiveRates}
        />

        {/* Dynamic Content Views */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-7 max-w-7xl mx-auto w-full animate-fade-in">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* 4 Apple Glassmorphic KPI Cards (Green, Yellow, White) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <SummaryCard
                  title="Total Balance"
                  amount={formatAmount(totalBalance)}
                  change={transactions.length > 0 ? (totalBalance >= 0 ? '+Surplus' : '-Deficit') : 'Vault Ready'}
                  isPositive={totalBalance >= 0}
                  iconType="wallet"
                  sublabel={`Converted to ${currency.code}`}
                  accentColor="#16A34A"
                  accentBg="rgba(22, 163, 74, 0.12)"
                  glowColor="rgba(22, 163, 74, 0.18)"
                />

                <SummaryCard
                  title="Total Income"
                  amount={formatAmount(totalIncome)}
                  change={transactions.length > 0 ? 'Recorded' : 'Empty'}
                  isPositive={true}
                  iconType="income"
                  sublabel="Total credited earnings"
                  accentColor="#16A34A"
                  accentBg="rgba(22, 163, 74, 0.12)"
                  glowColor="rgba(22, 163, 74, 0.18)"
                />

                <SummaryCard
                  title="Total Expenses"
                  amount={formatAmount(totalExpense)}
                  change={transactions.length > 0 ? 'Outflow' : 'Zero'}
                  isPositive={false}
                  iconType="expense"
                  sublabel="Lifestyle & bills spend"
                  accentColor="#EAB308"
                  accentBg="rgba(234, 179, 8, 0.15)"
                  glowColor="rgba(234, 179, 8, 0.2)"
                />

                <SummaryCard
                  title="Net Savings"
                  amount={`${savingsRate}%`}
                  change={totalIncome > 0 ? 'Margin' : 'N/A'}
                  isPositive={Number(savingsRate) > 20}
                  iconType="savings"
                  sublabel={`${formatAmount(totalBalance)} retained`}
                  accentColor="#84CC16"
                  accentBg="rgba(132, 204, 22, 0.15)"
                  glowColor="rgba(132, 204, 22, 0.2)"
                />
              </section>

              {/* Analytics Section: Area Chart & Donut */}
              <section>
                <ExpenseChart
                  transactions={transactions}
                  categories={DEFAULT_CATEGORIES}
                  currencySymbol={currency.symbol}
                  currencyCode={currency.code}
                  exchangeRates={exchangeRates}
                />
              </section>

              {/* Transactions List with Live Auto-Conversion */}
              <section>
                <Transactions
                  transactions={transactions}
                  categories={DEFAULT_CATEGORIES}
                  onEditTransaction={handleOpenEditModal}
                  onDeleteTransaction={handleDeleteTransaction}
                  onOpenAddModal={handleOpenAddModal}
                  currencySymbol={currency.symbol}
                  currencyCode={currency.code}
                  exchangeRates={exchangeRates}
                  isCompact={true}
                  onViewAll={() => setActiveTab('transactions')}
                />
              </section>
            </>
          )}

          {/* TAB 2: TRANSACTIONS (Full Searchable & Filterable Table with Live Conversion) */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <Transactions
                transactions={transactions}
                categories={DEFAULT_CATEGORIES}
                onEditTransaction={handleOpenEditModal}
                onDeleteTransaction={handleDeleteTransaction}
                onOpenAddModal={handleOpenAddModal}
                currencySymbol={currency.symbol}
                currencyCode={currency.code}
                exchangeRates={exchangeRates}
                isCompact={false}
              />
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                  Vault Intelligence
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#19241B] tracking-tight mt-0.5">
                  Spending & Cash Flow Analytics ({currency.code})
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7C6E] mt-1">
                  Real-time visual telemetry of your income flows, overhead patterns, and savings margins auto-converted to {currency.code}.
                </p>
              </div>

              <ExpenseChart
                transactions={transactions}
                categories={DEFAULT_CATEGORIES}
                currencySymbol={currency.symbol}
                currencyCode={currency.code}
                exchangeRates={exchangeRates}
              />

              {/* Analytics Metric Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="glass-card rounded-3xl p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7C6E]">
                    Average Transaction
                  </span>
                  <div className="text-2xl font-extrabold text-[#19241B] mt-1">
                    {transactions.length > 0
                      ? formatAmount(
                          (totalExpense / (transactions.filter((t) => t.type === 'expense').length || 1)).toFixed(2)
                        )
                      : formatAmount(0)}
                  </div>
                  <span className="text-[11px] text-[#6B7C6E] mt-1 block">
                    Per expense occurrence in {currency.code}
                  </span>
                </div>

                <div className="glass-card rounded-3xl p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7C6E]">
                    Total Entries Logged
                  </span>
                  <div className="text-2xl font-extrabold text-[#19241B] mt-1">
                    {transactions.length}
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-semibold mt-1 block">
                    Saved in browser LocalStorage
                  </span>
                </div>

                <div className="glass-card rounded-3xl p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7C6E]">
                    Total Expenses
                  </span>
                  <div className="text-2xl font-extrabold text-[#19241B] mt-1">
                    {formatAmount(totalExpense)}
                  </div>
                  <span className="text-[11px] text-[#6B7C6E] mt-1 block">
                    Current vault run-rate
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <CategoriesView
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              currencySymbol={currency.symbol}
              currencyCode={currency.code}
              exchangeRates={exchangeRates}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              currency={currency}
              setCurrency={setCurrency}
              exchangeRates={exchangeRates}
              onClearAllData={handleClearAllData}
              onImportData={handleImportData}
              transactions={transactions}
            />
          )}

        </div>

      </main>

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <TransactionModal
          key={editingTransaction ? editingTransaction.id : 'new-tx'}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTransaction(null)
          }}
          onSave={handleSaveTransaction}
          categories={DEFAULT_CATEGORIES}
          currencySymbol={currency.symbol}
          currencyCode={currency.code}
          editingTransaction={editingTransaction}
        />
      )}

    </div>
  )
}
