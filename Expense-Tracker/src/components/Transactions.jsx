import { useState, useMemo } from 'react'
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  ChevronRight,
  Wallet
} from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import { convertCurrency, DEFAULT_EXCHANGE_RATES } from '../data/initialData'

export default function Transactions({
  transactions = [],
  categories = [],
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal,
  currencySymbol = '₹',
  currencyCode = 'INR',
  exchangeRates = DEFAULT_EXCHANGE_RATES,
  isCompact = false,
  onViewAll
}) {
  const [selectedType, setSelectedType] = useState('all') // 'all' | 'income' | 'expense'
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [deletingId, setDeletingId] = useState(null)

  // Filter and sort transactions strictly from stored data with currency auto-conversion
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Type filter (all / income / expense)
        if (selectedType !== 'all' && tx.type !== selectedType) {
          return false
        }

        // Category filter
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false
        }

        return true
      })
      .map((tx) => {
        // Calculate converted amount in current active currency
        const converted = convertCurrency(
          tx.amount,
          tx.currency || 'INR',
          currencyCode,
          exchangeRates
        )
        return {
          ...tx,
          convertedAmount: converted
        }
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
        if (sortBy === 'amount-desc') return b.convertedAmount - a.convertedAmount
        if (sortBy === 'amount-asc') return a.convertedAmount - b.convertedAmount
        return 0
      })
  }, [transactions, selectedType, selectedCategory, sortBy, currencyCode, exchangeRates])

  // Display subset if compact
  const displayedTransactions = isCompact
    ? filteredTransactions.slice(0, 6)
    : filteredTransactions

  const handleDeleteClick = (id) => {
    if (deletingId === id) {
      onDeleteTransaction(id)
      setDeletingId(null)
    } else {
      setDeletingId(id)
      setTimeout(() => {
        setDeletingId((curr) => (curr === id ? null : curr))
      }, 3000)
    }
  }

  // Format date elegantly
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date)
    } catch {
      return dateStr
    }
  }

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7C6E]">
              Activity
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
              {filteredTransactions.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#19241B] tracking-tight mt-0.5">
            Transactions
          </h2>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* iOS Segmented Control for Type (All / Income / Expense) */}
          <div className="p-1 rounded-2xl bg-gray-200/50 backdrop-blur-sm border border-white/70 flex items-center">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white text-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.15)]'
                  : 'text-[#6B7C6E] hover:text-[#19241B]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'income'
                  ? 'bg-white text-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.15)]'
                  : 'text-[#6B7C6E] hover:text-[#19241B]'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === 'expense'
                  ? 'bg-white text-[#EAB308] shadow-[0_2px_8px_rgba(234,179,8,0.2)]'
                  : 'text-[#6B7C6E] hover:text-[#19241B]'
              }`}
            >
              Expenses
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="glass-input text-xs font-bold text-[#19241B] px-3.5 py-2 rounded-2xl cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown (Full Page only) */}
          {!isCompact && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input text-xs font-bold text-[#19241B] px-3.5 py-2 rounded-2xl cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          )}

          {/* View All Button on Compact mode */}
          {isCompact && onViewAll && (
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] hover:text-[#15803D] px-3 py-2 rounded-2xl hover:bg-white/70 transition-colors ml-auto cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {displayedTransactions.length === 0 ? (
        <div className="py-14 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#16A34A]/10 to-[#EAB308]/15 text-[#16A34A] flex items-center justify-center mx-auto mb-4 border border-white">
            <Wallet size={26} className="stroke-[2.2]" />
          </div>
          <h4 className="text-base font-extrabold text-[#19241B]">No transactions in vault</h4>
          <p className="text-xs text-[#6B7C6E] max-w-xs mx-auto mt-1 mb-5">
            {selectedType !== 'all' || selectedCategory !== 'all'
              ? 'No matching entries found for the selected filter.'
              : 'Your LocalStorage is clean. Click below to add your first transaction.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-xs font-bold shadow-[0_4px_16px_rgba(22,163,74,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedTransactions.map((tx) => {
            const isIncome = tx.type === 'income'
            const categoryObj = categories.find((c) => c.id === tx.category) || {
              name: 'Other',
              icon: 'CircleDot',
              color: '#6B7C6E',
              bg: 'rgba(107, 124, 110, 0.12)'
            }
            const isConfirmingDelete = deletingId === tx.id
            const isConverted = (tx.currency || 'INR') !== currencyCode

            return (
              <div
                key={tx.id}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/60 hover:bg-white/90 border border-white/80 hover:border-white shadow-[0_2px_8px_rgba(25,36,27,0.02)] hover:shadow-[0_8px_20px_rgba(22,163,74,0.06)] transition-all duration-200 gap-3"
              >
                {/* Left: Icon, Title, Category Badge, Notes */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm"
                    style={{
                      backgroundColor: categoryObj.bg,
                      color: categoryObj.color
                    }}
                  >
                    <CategoryIcon iconName={categoryObj.icon} size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-[#19241B] truncate tracking-tight">
                        {tx.title}
                      </h4>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: categoryObj.bg,
                          color: categoryObj.color
                        }}
                      >
                        {categoryObj.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#6B7C6E] mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={12} className="text-[#6B7C6E]/80" />
                        {formatDate(tx.date)}
                      </span>
                      {tx.paymentMethod && (
                        <span className="flex items-center gap-1 font-medium">
                          <CreditCard size={12} className="text-[#6B7C6E]/80" />
                          {tx.paymentMethod}
                        </span>
                      )}
                      {isConverted && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">
                          Orig: {tx.currency || 'INR'} {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      )}
                      {tx.notes && (
                        <span className="hidden md:inline truncate max-w-[200px] text-[#6B7C6E]/90 italic">
                          "{tx.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center shrink-0">
                  
                  {/* Amount Badge */}
                  <div className="text-right">
                    <div
                      className={`text-base font-extrabold tracking-tight flex items-center gap-1 ${
                        isIncome ? 'text-[#16A34A]' : 'text-[#EAB308]'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={16} className="stroke-[2.5]" />
                      ) : (
                        <ArrowUpRight size={16} className="stroke-[2.5]" />
                      )}
                      <span>
                        {isIncome ? '+' : '-'}
                        {currencySymbol}
                        {Number(tx.convertedAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Pencil & Trash) */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="p-2 rounded-xl text-[#6B7C6E] hover:text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"
                      title="Edit Transaction"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(tx.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isConfirmingDelete
                          ? 'bg-[#EF4444] text-white px-2.5 text-xs font-bold'
                          : 'text-[#6B7C6E] hover:text-[#EF4444] hover:bg-[#EF4444]/10'
                      }`}
                      title={isConfirmingDelete ? 'Click to Confirm' : 'Delete'}
                    >
                      {isConfirmingDelete ? 'Confirm' : <Trash2 size={15} />}
                    </button>
                  </div>

                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
