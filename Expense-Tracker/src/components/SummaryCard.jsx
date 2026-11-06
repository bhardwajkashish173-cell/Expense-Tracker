import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank
} from 'lucide-react'

const iconMap = {
  wallet: Wallet,
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  savings: PiggyBank,
}

export default function SummaryCard({
  title,
  amount,
  change,
  isPositive,
  iconType,
  sublabel = 'vs last month',
  accentColor = '#16A34A',
  accentBg = 'rgba(22, 163, 74, 0.12)',
  glowColor = 'rgba(22, 163, 74, 0.15)'
}) {
  const IconComponent = iconMap[iconType] || Wallet

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 relative overflow-hidden group cursor-default">
      {/* Background Soft Glow Orb */}
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100 pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />

      {/* Top Row: Icon & Trend Pill */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm"
          style={{ backgroundColor: accentBg, color: accentColor }}
        >
          <IconComponent size={22} className="stroke-[2.2]" />
        </div>

        {change && (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              isPositive
                ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20'
                : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Middle: Amount */}
      <div className="relative z-10">
        <span className="text-xs font-bold text-[#6B7C6E] uppercase tracking-wider block mb-1">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#19241B] tracking-tight">
          {amount}
        </div>
      </div>

      {/* Bottom: Sublabel */}
      <div className="mt-3 pt-3 border-t border-gray-100/80 flex items-center justify-between text-xs text-[#6B7C6E] relative z-10">
        <span className="text-[11px] font-medium">{sublabel}</span>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  )
}
