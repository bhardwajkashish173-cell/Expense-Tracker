import { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  Plus,
  ChevronDown,
  Coins,
  Edit2
} from 'lucide-react'
import { CURRENCIES, DEFAULT_EXCHANGE_RATES } from '../data/initialData'

export default function Header({
  onOpenAddModal,
  currency,
  setCurrency,
  exchangeRates = DEFAULT_EXCHANGE_RATES,
  isLiveRates = false,
  userName = 'Kashish Bhardwaj',
  onOpenEditNameModal
}) {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const currencyMenuRef = useRef(null)

  // Extract first name for greeting
  const firstName = userName ? userName.trim().split(/\s+/)[0] : 'Kashish'

  // Extract initials for avatar
  const getInitials = (name) => {
    if (!name) return 'KB'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Determine dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Format today's date in Apple style
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate rate relative to INR
  const getRateDisplay = (code) => {
    if (code === 'INR') return 'Base (₹1.00)'
    const rate = exchangeRates[code] || DEFAULT_EXCHANGE_RATES[code] || 1
    const inrValue = (1 / rate).toFixed(2)
    return `1 ${code} = ₹${inrValue}`
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#F6F8F5]/85 px-4 sm:px-6 lg:px-8 py-4 transition-all border-b border-gray-100/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Dynamic Greeting with User's First Name & Date */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#6B7C6E]">
            <Calendar size={13} className="text-[#16A34A]" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#19241B] tracking-tight mt-0.5 flex items-center gap-2">
            <span>{getGreeting()}, {firstName}!</span>
            <span className="text-xl sm:text-2xl">🌿</span>
          </h1>
        </div>

        {/* Right: Currency Selector Pill, Add Action, and Profile */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end flex-wrap">
          
          {/* Quick Dynamic Currency Switcher Dropdown */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#19241B] hover:bg-white active:scale-95 transition-all shadow-[0_2px_8px_rgba(25,36,27,0.03)] cursor-pointer"
              title="Click to switch currency and auto-convert all amounts"
            >
              <div className="w-5 h-5 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center font-extrabold text-[11px]">
                {currency?.symbol || '₹'}
              </div>
              <span className="font-extrabold tracking-tight">{currency?.code || 'INR'}</span>
              <ChevronDown size={14} className={`text-[#6B7C6E] transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Currency Dropdown Menu */}
            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(25,36,27,0.15)] border border-white/95 bg-white/95 z-50 animate-scale-in">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#19241B] uppercase tracking-wider flex items-center gap-1.5">
                    <Coins size={13} className="text-[#16A34A]" />
                    <span>Currency Converter</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#16A34A] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    {isLiveRates ? 'Live FX' : 'FX Active'}
                  </span>
                </div>

                <div className="divide-y divide-gray-100/60 max-h-64 overflow-y-auto mt-1 pr-1">
                  {CURRENCIES.map((c) => {
                    const isSelected = currency?.code === c.code
                    return (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c)
                          setShowCurrencyDropdown(false)
                        }}
                        className={`w-full py-2 px-3 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#16A34A]/10 text-[#16A34A] font-bold'
                            : 'hover:bg-white/70 text-[#19241B]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-xs text-[#19241B]">
                            {c.symbol}
                          </span>
                          <div>
                            <div className="text-xs font-bold leading-none">{c.code}</div>
                            <div className="text-[10px] text-[#6B7C6E] mt-0.5">{getRateDisplay(c.code)}</div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Primary Add Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-[0_6px_18px_rgba(22,163,74,0.3)] transition-all cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>

          {/* Clickable User Profile: Opens Edit Name Modal */}
          <div
            onClick={onOpenEditNameModal}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-gray-200/80 cursor-pointer group"
            title="Click to change your name"
          >
            <div className="hidden sm:block text-right">
              <span className="block text-xs font-bold text-[#19241B] group-hover:text-[#16A34A] transition-colors leading-none">
                {userName}
              </span>
              <span className="text-[10px] font-semibold text-[#16A34A] tracking-wider uppercase mt-0.5 flex items-center justify-end gap-1">
                <span>Primary Account</span>
                <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>

            {/* Avatar with Initials & Edit Overlay */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] via-[#EAB308]/60 to-white flex items-center justify-center text-white font-extrabold text-xs shadow-[0_2px_12px_rgba(22,163,74,0.25)] ring-2 ring-white group-hover:scale-105 transition-transform">
                {getInitials(userName)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-2 ring-white" />
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
