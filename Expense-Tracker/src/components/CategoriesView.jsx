import {
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import { convertCurrency, DEFAULT_EXCHANGE_RATES } from '../data/initialData'

export default function CategoriesView({
  transactions = [],
  categories = [],
  currencySymbol = '₹',
  currencyCode = 'INR',
  exchangeRates = DEFAULT_EXCHANGE_RATES,
  onOpenAddModal
}) {
  // Aggregate stats per category with dynamic currency auto-conversion
  const categoryStats = categories.map((cat) => {
    const catTxs = transactions.filter((tx) => tx.category === cat.id)
    const totalSpent = catTxs
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + convertCurrency(tx.amount, tx.currency || 'INR', currencyCode, exchangeRates), 0)
    const totalEarned = catTxs
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + convertCurrency(tx.amount, tx.currency || 'INR', currencyCode, exchangeRates), 0)

    const count = catTxs.length
    const convertedBudget = cat.budget > 0
      ? convertCurrency(cat.budget, 'INR', currencyCode, exchangeRates)
      : 0
    const percentOfBudget = convertedBudget > 0 ? (totalSpent / convertedBudget) * 100 : 0

    return {
      ...cat,
      totalSpent,
      totalEarned,
      convertedBudget,
      count,
      percentOfBudget
    }
  })

  // Separate expense and income categories
  const expenseCategories = categoryStats
    .filter((c) => !['salary', 'investment'].includes(c.id))
    .sort((a, b) => b.totalSpent - a.totalSpent)

  const incomeCategories = categoryStats
    .filter((c) => ['salary', 'freelance', 'investment', 'other'].includes(c.id) && c.totalEarned > 0)
    .sort((a, b) => b.totalEarned - a.totalEarned)

  const totalExpenseAll = expenseCategories.reduce((s, c) => s + c.totalSpent, 0)

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#16A34A]/15 via-[#EAB308]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>Budget Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#19241B] tracking-tight">
            Categories & Spending Limits
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7C6E] mt-1.5">
            Auto-converted real-time to {currencyCode} using live exchange rates.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(22,163,74,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowUpRight size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-[#19241B] tracking-tight">
            Expense Categories & Progress
          </h3>
          <span className="text-xs text-[#6B7C6E] font-semibold">
            {expenseCategories.length} Categories active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expenseCategories.map((cat) => {
            const hasBudget = cat.convertedBudget > 0
            const isNearBudget = cat.percentOfBudget >= 80 && cat.percentOfBudget <= 100
            const isOverBudget = cat.percentOfBudget > 100
            const shareOfTotal = totalExpenseAll > 0 ? ((cat.totalSpent / totalExpenseAll) * 100).toFixed(1) : 0

            return (
              <div
                key={cat.id}
                className="glass-card rounded-3xl p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      <CategoryIcon iconName={cat.icon} size={20} />
                    </div>

                    <span className="text-[11px] font-bold text-[#6B7C6E] px-2.5 py-1 rounded-full bg-white/80 border border-white">
                      {cat.count} txns
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[#19241B] tracking-tight">
                    {cat.name}
                  </h4>
                  
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-[#19241B] tracking-tight">
                      {currencySymbol}
                      {cat.totalSpent.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className="text-xs text-[#6B7C6E] font-medium">
                      ({shareOfTotal}%)
                    </span>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                {hasBudget ? (
                  <div className="mt-4 pt-3 border-t border-gray-100/80">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6B7C6E] mb-1.5">
                      <span>Limit: {currencySymbol}{cat.convertedBudget.toFixed(2)}</span>
                      <span
                        className={`font-bold ${
                          isOverBudget
                            ? 'text-[#EF4444]'
                            : isNearBudget
                            ? 'text-[#EAB308]'
                            : 'text-[#16A34A]'
                        }`}
                      >
                        {cat.percentOfBudget.toFixed(0)}%
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-2 rounded-full bg-gray-200/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverBudget
                            ? 'bg-[#EF4444]'
                            : isNearBudget
                            ? 'bg-[#EAB308]'
                            : 'bg-[#16A34A]'
                        }`}
                        style={{
                          width: `${Math.min(cat.percentOfBudget, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-gray-100/80 text-[11px] text-[#6B7C6E]">
                    No set budget cap
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Income Streams Summary */}
      {incomeCategories.length > 0 && (
        <div className="pt-2">
          <h3 className="text-lg font-extrabold text-[#19241B] tracking-tight mb-4">
            Income Streams
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {incomeCategories.map((cat) => (
              <div
                key={cat.id}
                className="glass-card rounded-3xl p-5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <CategoryIcon iconName={cat.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#19241B]">{cat.name}</h4>
                    <span className="text-[11px] text-[#6B7C6E]">{cat.count} payments</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-[#16A34A]">
                    +{currencySymbol}
                    {cat.totalEarned.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
