import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ArrowDownLeft,
  PieChart as PieIcon,
  BarChart2,
  Layers,
  Sparkles,
  Inbox
} from 'lucide-react'
import { convertCurrency, DEFAULT_EXCHANGE_RATES } from '../data/initialData'

// Custom Apple Frosted Glass Tooltip
function CustomTooltip({ active, payload, label, currencySymbol }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3.5 rounded-2xl shadow-[0_12px_30px_rgba(25,36,27,0.08)] border border-white/90 bg-white/95 text-xs backdrop-blur-xl">
        <p className="font-bold text-[#19241B] mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#6B7C6E] capitalize">{item.name}:</span>
              </div>
              <span className="font-semibold text-[#19241B]">
                {currencySymbol}
                {Number(item.value).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function ExpenseChart({
  transactions = [],
  categories = [],
  currencySymbol = '₹',
  currencyCode = 'INR',
  exchangeRates = DEFAULT_EXCHANGE_RATES
}) {
  const [chartType, setChartType] = useState('area') // 'area' | 'bar'

  // Generate dynamic 6-month timeline strictly from real transactions with currency conversion
  const monthlyData = useMemo(() => {
    const months = []
    const now = new Date()

    // Create array for past 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = d.toLocaleString('en-US', { month: 'short' })
      const year = d.getFullYear()
      const monthIndex = d.getMonth()

      months.push({
        month: monthLabel,
        year,
        monthIndex,
        income: 0,
        expense: 0
      })
    }

    // Populate strictly from real stored transactions, converting to active currency
    transactions.forEach((tx) => {
      if (!tx.date) return
      const txDate = new Date(tx.date + 'T00:00:00')
      const txMonth = txDate.getMonth()
      const txYear = txDate.getFullYear()
      
      const convertedAmt = convertCurrency(
        tx.amount,
        tx.currency || 'INR',
        currencyCode,
        exchangeRates
      )

      const bucket = months.find((m) => m.monthIndex === txMonth && m.year === txYear)
      if (bucket) {
        if (tx.type === 'income') {
          bucket.income += convertedAmt
        } else {
          bucket.expense += convertedAmt
        }
      }
    })

    return months
  }, [transactions, currencyCode, exchangeRates])

  // Calculate category distribution for Donut Chart strictly from stored transactions
  const { pieData, totalExpenseSum } = useMemo(() => {
    const categoryExpenses = {}
    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        const converted = convertCurrency(
          tx.amount,
          tx.currency || 'INR',
          currencyCode,
          exchangeRates
        )
        categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + converted
      })

    const pie = Object.keys(categoryExpenses).map((catId) => {
      const cat = categories.find((c) => c.id === catId) || {
        name: catId,
        color: '#6B7C6E'
      }
      return {
        name: cat.name,
        value: categoryExpenses[catId],
        color: cat.color
      }
    }).sort((a, b) => b.value - a.value)

    const total = pie.reduce((acc, curr) => acc + curr.value, 0)
    return { pieData: pie, totalExpenseSum: total }
  }, [transactions, categories, currencyCode, exchangeRates])

  const hasData = transactions.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Income vs Expenses Flow Chart */}
      <div className="lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7C6E]">
                Cash Flow
              </span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#19241B] tracking-tight mt-0.5">
              Income vs Expenses
            </h2>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-1 rounded-2xl bg-gray-200/50 backdrop-blur-sm border border-white/60">
              <button
                onClick={() => setChartType('area')}
                className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-white text-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.15)] font-bold'
                    : 'text-[#6B7C6E] hover:text-[#19241B]'
                }`}
                title="Area Chart"
              >
                <Layers size={15} />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-white text-[#16A34A] shadow-[0_2px_8px_rgba(22,163,74,0.15)] font-bold'
                    : 'text-[#6B7C6E] hover:text-[#19241B]'
                }`}
                title="Bar Chart"
              >
                <BarChart2 size={15} />
              </button>
            </div>

            {/* Legend Indicators with Green and Yellow */}
            <div className="hidden sm:flex items-center gap-3 ml-2 text-xs font-semibold text-[#6B7C6E]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                Expense
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Green Gradient for Income */}
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Yellow/Amber Gradient for Expense */}
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.6} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7C6E', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7C6E', fontSize: 11 }}
                  tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#EAB308"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  name="Expense"
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.6} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7C6E', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7C6E', fontSize: 11 }}
                  tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
                <Bar dataKey="income" fill="#16A34A" radius={[8, 8, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#EAB308" radius={[8, 8, 0, 0]} name="Expense" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Micro-insight footer */}
        <div className="mt-4 pt-3 border-t border-gray-100/80 flex flex-wrap items-center justify-between text-xs text-[#6B7C6E] gap-2">
          <div className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
            <ArrowDownLeft size={14} />
            <span>Auto-converted in real-time to {currencyCode}</span>
          </div>
          <span className="text-[11px] font-medium text-[#6B7C6E]/80">Auren Analytics</span>
        </div>
      </div>

      {/* Donut Chart: Expense Breakdown by Category */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7C6E]">
                Allocation
              </span>
              <h3 className="text-xl font-extrabold text-[#19241B] tracking-tight">
                Spending by Category
              </h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-[#EAB308]/15 text-[#CA8A04] flex items-center justify-center">
              <PieIcon size={18} />
            </div>
          </div>

          {/* Donut Ring with Centered Stat or Empty State */}
          {hasData && pieData.length > 0 ? (
            <div className="relative w-full h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#FFFFFF"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0]
                        return (
                          <div className="glass-panel p-2.5 rounded-2xl shadow-lg border border-white/90 bg-white/95 text-xs">
                            <p className="font-bold text-[#19241B]">{data.name}</p>
                            <p className="text-[#16A34A] font-bold">
                              {currencySymbol}
                              {Number(data.value).toFixed(2)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold text-[#6B7C6E]">Spent</span>
                <span className="text-lg font-extrabold text-[#19241B] tracking-tight">
                  {currencySymbol}
                  {totalExpenseSum >= 1000
                    ? `${(totalExpenseSum / 1000).toFixed(1)}k`
                    : totalExpenseSum.toFixed(0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAB308]/10 text-[#CA8A04] flex items-center justify-center mb-2">
                <Inbox size={22} />
              </div>
              <p className="text-xs font-bold text-[#19241B]">No expenses recorded</p>
              <p className="text-[11px] text-[#6B7C6E] mt-0.5">
                Add an expense to view category distribution
              </p>
            </div>
          )}
        </div>

        {/* Category Legend List */}
        {hasData && pieData.length > 0 ? (
          <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1">
            {pieData.slice(0, 4).map((item, idx) => {
              const percent = totalExpenseSum > 0 ? ((item.value / totalExpenseSum) * 100).toFixed(0) : 0
              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-xl hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-[#19241B] truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-[#19241B]">
                      {currencySymbol}
                      {item.value.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-[#6B7C6E] font-semibold w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-[#16A34A] font-semibold">
            <Sparkles size={13} />
            <span>Ready for your entries</span>
          </div>
        )}

      </div>

    </div>
  )
}
