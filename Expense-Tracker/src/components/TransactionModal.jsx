import { useState } from 'react'
import {
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react'
import { PAYMENT_METHODS } from '../data/initialData'

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  categories = [],
  currencySymbol = '₹',
  currencyCode = 'INR',
  editingTransaction = null
}) {
  const isEditing = Boolean(editingTransaction)

  // Initialize state directly from props
  const [type, setType] = useState(() => editingTransaction?.type || 'expense')
  const [title, setTitle] = useState(() => editingTransaction?.title || '')
  const [amount, setAmount] = useState(() => editingTransaction?.amount?.toString() || '')
  const [category, setCategory] = useState(
    () => editingTransaction?.category || categories[1]?.id || categories[0]?.id || ''
  )
  const [date, setDate] = useState(
    () => editingTransaction?.date || new Date().toISOString().split('T')[0]
  )
  const [paymentMethod, setPaymentMethod] = useState(
    () => editingTransaction?.paymentMethod || 'Cash'
  )
  const [notes, setNotes] = useState(() => editingTransaction?.notes || '')
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0'
    }
    if (!category) {
      newErrors.category = 'Please select a category'
    }
    if (!date) {
      newErrors.date = 'Date is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
      id: editingTransaction ? editingTransaction.id : `tx-${Date.now()}`,
      title: title.trim(),
      amount: parseFloat(amount),
      currency: editingTransaction?.currency || currencyCode,
      type,
      category,
      date,
      paymentMethod,
      notes: notes.trim()
    }

    onSave(payload)
    onClose()
  }

  // Filter categories appropriately based on type
  const availableCategories = categories.filter((cat) => {
    if (type === 'income') {
      return ['salary', 'freelance', 'investment', 'other'].includes(cat.id)
    } else {
      return !['salary', 'investment'].includes(cat.id)
    }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(25,36,27,0.18)] border border-white/95 bg-white/95 backdrop-blur-2xl animate-scale-in z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">
              {isEditing ? 'Modify Entry' : 'New Entry'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#19241B] tracking-tight">
              {isEditing ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[#6B7C6E] hover:text-[#19241B] hover:bg-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* iOS Segmented Type Selector (Expense vs Income) */}
          <div className="p-1 rounded-2xl bg-gray-200/50 backdrop-blur-sm border border-white/70 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setType('expense')
                if (['salary', 'investment'].includes(category)) {
                  setCategory(categories[1]?.id || categories[0]?.id)
                }
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white text-[#EAB308] shadow-[0_2px_10px_rgba(234,179,8,0.2)]'
                  : 'text-[#6B7C6E] hover:text-[#19241B]'
              }`}
            >
              <ArrowUpRight size={16} />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory('salary')
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white text-[#16A34A] shadow-[0_2px_10px_rgba(22,163,74,0.2)]'
                  : 'text-[#6B7C6E] hover:text-[#19241B]'
              }`}
            >
              <ArrowDownLeft size={16} />
              <span>Income</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#6B7C6E]">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`glass-input w-full pl-11 pr-4 py-3 rounded-2xl text-2xl font-extrabold text-[#19241B] placeholder:text-gray-300 ${
                  errors.amount ? 'border-[#EF4444]' : ''
                }`}
                autoFocus={!isEditing}
              />
            </div>
            {errors.amount && (
              <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{errors.amount}</p>
            )}
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
              Description / Payee
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grocery, Rent, Freelance Client..."
                className={`glass-input w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-[#19241B] placeholder:text-[#6B7C6E]/60 ${
                  errors.title ? 'border-[#EF4444]' : ''
                }`}
              />
            </div>
            {errors.title && (
              <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{errors.title}</p>
            )}
          </div>

          {/* Category & Date in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-[#19241B] cursor-pointer"
              >
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-[#19241B]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#16A34A] text-white shadow-[0_2px_8px_rgba(22,163,74,0.25)]'
                        : 'bg-white/70 text-[#6B7C6E] hover:bg-white hover:text-[#19241B] border border-white/90'
                    }`}
                  >
                    {method}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#6B7C6E] mb-1.5 uppercase tracking-wider">
              Notes / Memo (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add memo, invoice number or details..."
              rows={2}
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-[#19241B] placeholder:text-[#6B7C6E]/60 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#6B7C6E] hover:text-[#19241B] hover:bg-gray-100/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(22,163,74,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} className="stroke-[2.5]" />
              <span>{isEditing ? 'Save Changes' : 'Confirm Transaction'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
