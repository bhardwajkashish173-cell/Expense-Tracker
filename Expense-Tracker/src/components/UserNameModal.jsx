import { useState } from 'react'
import {
  Wallet,
  Check,
  X,
  Sparkles,
  User
} from 'lucide-react'

export default function UserNameModal({
  isOpen,
  onClose,
  onSave,
  currentName = '',
  isFirstTime = false
}) {
  const [nameInput, setNameInput] = useState(() => currentName || (isFirstTime ? 'Kashish Bhardwaj' : ''))
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setError('Please enter your name to continue')
      return
    }
    onSave(trimmed)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (!isFirstTime) onClose()
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(25,36,27,0.2)] border border-white/95 bg-white/95 backdrop-blur-2xl animate-scale-in z-10 text-center">
        
        {/* Close Button (only if not first time onboarding) */}
        {!isFirstTime && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[#6B7C6E] hover:text-[#19241B] hover:bg-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        {/* Apple Style Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#16A34A] to-[#EAB308] flex items-center justify-center text-white mx-auto shadow-[0_8px_24px_rgba(22,163,74,0.3)] mb-4">
          <Wallet size={30} className="stroke-[2.2]" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{isFirstTime ? 'Welcome to Auren' : 'Profile Settings'}</span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#19241B] tracking-tight">
            {isFirstTime ? "What's your name?" : 'Update Your Name'}
          </h3>

          <p className="text-xs sm:text-sm text-[#6B7C6E] mt-1.5 max-w-xs mx-auto">
            {isFirstTime
              ? 'Personalize your smart expense tracker and private vault experience.'
              : 'Change the display name and initials shown across your dashboard.'}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C6E] pointer-events-none"
              />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. Kashish Bhardwaj"
                className={`glass-input w-full pl-11 pr-4 py-3 rounded-2xl text-base font-extrabold text-[#19241B] placeholder:text-gray-300 shadow-sm ${
                  error ? 'border-[#EF4444]' : ''
                }`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{error}</p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] active:scale-95 text-white font-extrabold text-sm shadow-[0_8px_20px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={18} className="stroke-[2.5]" />
              <span>{isFirstTime ? 'Get Started' : 'Save Name'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
