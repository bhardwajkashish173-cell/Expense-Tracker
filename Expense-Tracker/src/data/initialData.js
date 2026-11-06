// Categories tailored for Auren with Green, Yellow, and White theme
export const DEFAULT_CATEGORIES = [
  { id: 'housing', name: 'Housing & Rent', icon: 'Home', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)', budget: 1800 },
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.12)', budget: 600 },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', budget: 500 },
  { id: 'transport', name: 'Transport & Travel', icon: 'Car', color: '#84CC16', bg: 'rgba(132, 204, 22, 0.12)', budget: 350 },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#CA8A04', bg: 'rgba(202, 138, 4, 0.12)', budget: 250 },
  { id: 'utilities', name: 'Bills & Utilities', icon: 'Zap', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', budget: 300 },
  { id: 'health', name: 'Health & Wellness', icon: 'HeartPulse', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', budget: 200 },
  { id: 'salary', name: 'Salary & Wage', icon: 'Briefcase', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.15)', budget: 0 },
  { id: 'freelance', name: 'Freelance & Side Gig', icon: 'Laptop', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)', budget: 0 },
  { id: 'investment', name: 'Investments', icon: 'TrendingUp', color: '#65A30D', bg: 'rgba(101, 163, 13, 0.15)', budget: 0 },
  { id: 'other', name: 'Miscellaneous', icon: 'CircleDot', color: '#6B7C6E', bg: 'rgba(107, 124, 110, 0.12)', budget: 150 },
]

export const PAYMENT_METHODS = [
  'Cash',
  'UPI / GPay',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Apple Pay',
]

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
]

// Current live baseline rates relative to INR (1 INR = X target currency)
export const DEFAULT_EXCHANGE_RATES = {
  INR: 1,
  USD: 0.01168, // 1 USD ≈ ₹85.60
  EUR: 0.01085, // 1 EUR ≈ ₹92.15
  GBP: 0.00905, // 1 GBP ≈ ₹110.50
  CAD: 0.01639, // 1 CAD ≈ ₹61.00
  AUD: 0.01785, // 1 AUD ≈ ₹56.00
  JPY: 1.78200, // 1 JPY ≈ ₹0.56
}

// Convert amount from one currency to another using exchange rates relative to INR
export function convertCurrency(amount, fromCode = 'INR', toCode = 'INR', rates = DEFAULT_EXCHANGE_RATES) {
  if (!amount || isNaN(amount)) return 0
  const cleanFrom = fromCode || 'INR'
  const cleanTo = toCode || 'INR'
  if (cleanFrom === cleanTo) return Number(amount)

  const fromRate = rates[cleanFrom] || DEFAULT_EXCHANGE_RATES[cleanFrom] || 1
  const toRate = rates[cleanTo] || DEFAULT_EXCHANGE_RATES[cleanTo] || 1

  // Amount in base INR = amount / fromRate, then convert to target currency
  const converted = (Number(amount) / fromRate) * toRate
  return converted
}

// Empty initial transactions - strictly relies on LocalStorage
export const INITIAL_TRANSACTIONS = []
