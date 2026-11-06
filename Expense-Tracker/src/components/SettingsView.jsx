import { useState, useRef } from 'react'
import {
  Settings,
  DollarSign,
  Trash2,
  Download,
  Upload,
  ShieldCheck,
  Check,
  Wallet,
  Sparkles,
  Edit2
} from 'lucide-react'
import { CURRENCIES, DEFAULT_EXCHANGE_RATES } from '../data/initialData'

export default function SettingsView({
  currency,
  setCurrency,
  exchangeRates = DEFAULT_EXCHANGE_RATES,
  onClearAllData,
  onImportData,
  transactions = [],
  userName = 'Kashish Bhardwaj',
  onOpenEditNameModal
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef(null)

  // Extract initials for avatar
  const getInitials = (name) => {
    if (!name) return 'KB'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Export transactions as JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auren-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  // Import transactions from JSON
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (Array.isArray(parsed)) {
          onImportData(parsed)
          setImportMessage(`Successfully loaded ${parsed.length} transactions into vault!`)
          setTimeout(() => setImportMessage(''), 4000)
        } else {
          setImportMessage('Invalid format. File must contain an array of transactions.')
        }
      } catch (err) {
        setImportMessage(`Error reading JSON: ${err.message}`)
      }
    }
    reader.readAsText(file)
  }

  // Get exchange rate display relative to INR
  const getRateInfo = (code) => {
    if (code === 'INR') return 'Base Currency'
    const rate = exchangeRates[code] || DEFAULT_EXCHANGE_RATES[code] || 1
    const inrValue = (1 / rate).toFixed(2)
    return `1 ${code} = ₹${inrValue}`
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Settings Header with User Profile Name */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            User & Vault Preferences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#19241B] tracking-tight mt-0.5">
            Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7C6E] mt-1">
            Personal vault configuration and storage controls for {userName}.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16A34A] to-[#EAB308] text-white flex items-center justify-center shadow-md">
          <Settings size={24} />
        </div>
      </div>

      {/* Profile Card with Edit Name Button */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#16A34A] via-[#EAB308]/60 to-white flex items-center justify-center text-white font-extrabold text-lg shadow-[0_4px_16px_rgba(22,163,74,0.25)] ring-2 ring-white shrink-0">
            {getInitials(userName)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-extrabold text-[#19241B]">{userName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                Primary Account
              </span>
            </div>
            <p className="text-xs text-[#6B7C6E] mt-0.5">
              Auren Private Vault • Client-Side Only
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEditNameModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel hover:bg-white text-xs font-bold text-[#16A34A] transition-all self-start sm:self-auto shadow-sm active:scale-95 cursor-pointer"
        >
          <Edit2 size={14} />
          <span>Change Name</span>
        </button>
      </div>

      {/* Currency Preference Card with Live Auto-Conversion Rates */}
      <div className="glass-card rounded-3xl p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#19241B]">Primary Currency & Live Conversion</h3>
              <p className="text-xs text-[#6B7C6E]">
                All transactions convert dynamically to the selected currency based on real-time market rates.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-bold">
            <Sparkles size={12} />
            <span>Real-time FX conversion</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {CURRENCIES.map((c) => {
            const isSelected = currency.code === c.code
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#16A34A] bg-[#16A34A]/10 shadow-[0_2px_10px_rgba(22,163,74,0.15)] ring-2 ring-[#16A34A]/20'
                    : 'border-white/80 bg-white/60 hover:bg-white text-[#19241B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-[#19241B]">{c.symbol}</div>
                  <div className="text-xs font-bold text-[#16A34A]">{c.code}</div>
                </div>
                <div className="text-[11px] font-medium text-[#19241B] mt-1 truncate">{c.name.split('(')[0]}</div>
                <div className="text-[10px] text-[#6B7C6E] font-semibold mt-0.5">{getRateInfo(c.code)}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* LocalStorage Data Controls */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#19241B]">LocalStorage Data Management</h3>
          <p className="text-xs text-[#6B7C6E]">
            All transactions are stored strictly in your browser's LocalStorage. No sample data is loaded.
          </p>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export JSON */}
          <div className="p-4 rounded-2xl bg-white/60 border border-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#19241B] mb-1">
                <Download size={16} className="text-[#16A34A]" />
                <span>Export Financial Backup</span>
              </div>
              <p className="text-xs text-[#6B7C6E]">
                Download your {transactions.length} transactions as a portable JSON file.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#19241B] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {exportSuccess ? <Check size={15} className="text-[#16A34A]" /> : <Download size={15} />}
              <span>{exportSuccess ? 'Downloaded!' : 'Export JSON Backup'}</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-2xl bg-white/60 border border-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#19241B] mb-1">
                <Upload size={16} className="text-[#EAB308]" />
                <span>Restore / Import Data</span>
              </div>
              <p className="text-xs text-[#6B7C6E]">
                Upload a JSON backup to load transactions into your LocalStorage vault.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#19241B] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Upload size={15} />
                <span>Select JSON File</span>
              </button>
            </div>
          </div>
        </div>

        {importMessage && (
          <div className="p-3 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold flex items-center gap-2">
            <Check size={16} />
            <span>{importMessage}</span>
          </div>
        )}

        {/* Danger Zone: Clear Data */}
        <div className="pt-4 border-t border-gray-100/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-[#6B7C6E]">
            Permanently erase all entries from LocalStorage.
          </div>

          <div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClearAllData()
                    setShowClearConfirm(false)
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Yes, Clear All Data
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-2 rounded-xl text-xs text-[#6B7C6E] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Clear LocalStorage Data</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Security Badge */}
      <div className="p-5 rounded-3xl bg-white/50 border border-white/70 flex items-center justify-between text-xs text-[#6B7C6E]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-[#16A34A]" />
          <span>Local storage only. Your financial data never leaves your device.</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-[#19241B]">
          <Wallet size={14} className="text-[#16A34A]" />
          <span>Auren v2.4</span>
        </div>
      </div>

    </div>
  )
}
