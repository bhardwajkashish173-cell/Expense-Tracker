import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  PieChart,
  Settings,
  Wallet,
  CreditCard,
  Plus
} from 'lucide-react'

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  totalBalanceFormatted
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Desktop & Laptop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 p-5 z-30 select-none">
        <div className="glass-panel rounded-3xl h-full flex flex-col p-5 border border-white/90 shadow-[0_12px_40px_rgba(25,36,27,0.04)] backdrop-blur-2xl bg-white/80 relative overflow-hidden">
          
          {/* Subtle Green & Yellow ambient glow orbs */}
          <div className="absolute -top-14 -left-14 w-36 h-36 bg-[#16A34A]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 -right-16 w-36 h-36 bg-[#EAB308]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Section */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100/90 relative z-10">
            <div className="flex items-center gap-3">
              {/* Wallet Logo with Green-Yellow Apple Gradient */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] to-[#EAB308] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(22,163,74,0.35)] transition-transform hover:scale-105">
                <Wallet size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#19241B] block leading-none">
                  Auren
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-[#6B7C6E] uppercase mt-1 block">
                  Smart Tracker
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 space-y-1.5 relative z-10">
            <p className="px-3 text-[11px] font-bold text-[#6B7C6E]/80 tracking-wider uppercase mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 group text-left relative cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#16A34A]/15 via-[#EAB308]/10 to-transparent text-[#16A34A] font-bold shadow-[0_2px_12px_rgba(22,163,74,0.08)]'
                      : 'text-[#6B7C6E] hover:text-[#19241B] hover:bg-white/70 active:scale-[0.98]'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-1.5 w-1.5 h-5 bg-[#16A34A] rounded-full shadow-[0_0_8px_rgba(22,163,74,0.5)]" />
                  )}
                  <Icon
                    size={19}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#16A34A]' : 'text-[#6B7C6E] group-hover:text-[#19241B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Quick Action Button */}
          <div className="pt-2 pb-4 relative z-10">
            <button
              onClick={onOpenAddModal}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] active:scale-[0.98] text-white font-bold text-sm shadow-[0_8px_20px_rgba(22,163,74,0.3)] transition-all group cursor-pointer"
            >
              <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300 stroke-[2.5]" />
              <span>Add Transaction</span>
            </button>
          </div>

          {/* Active Balance Card at Bottom */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#16A34A]/10 via-[#EAB308]/10 to-white/70 border border-white/90 shadow-[0_4px_16px_rgba(25,36,27,0.02)] relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#6B7C6E]">Net Vault</span>
              <CreditCard size={15} className="text-[#16A34A]" />
            </div>
            <div className="text-lg font-extrabold text-[#19241B] tracking-tight">
              {totalBalanceFormatted}
            </div>
            <div className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              LocalStorage Secured
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Apple iOS Floating Tab Bar) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 pointer-events-none">
        <div className="glass-panel mx-auto max-w-md rounded-3xl p-2 px-3 flex items-center justify-around border border-white/95 shadow-[0_10px_35px_rgba(25,36,27,0.12)] bg-white/95 backdrop-blur-2xl pointer-events-auto">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-[#16A34A] font-bold' : 'text-[#6B7C6E]'
                }`}
              >
                <Icon size={19} className={isActive ? 'text-[#16A34A]' : 'text-[#6B7C6E]'} />
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            )
          })}

          {navItems.slice(2, 5).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-[#16A34A] font-bold' : 'text-[#6B7C6E]'
                }`}
              >
                <Icon size={19} className={isActive ? 'text-[#16A34A]' : 'text-[#6B7C6E]'} />
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
