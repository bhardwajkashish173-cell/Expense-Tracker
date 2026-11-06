# Finora — Apple-Inspired Expense Tracker Dashboard

> A minimal, elegant, ultra-smooth personal finance dashboard inspired by Apple's iOS glassmorphism, frosted glass surfaces, and refined typography. Built with **React.js**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## ✨ Features

- **Apple-Inspired Glassmorphism**: Translucent frosted glass cards (`backdrop-filter: blur(18px)`), natural diffused shadows, gentle borders, and soft lavender/indigo glow accents.
- **Dynamic Greeting & Header**: Real-time morning/afternoon/evening greetings, live date display, instant search bar, interactive notification drawer, and user profile indicator.
- **KPI Overview Cards**: Live calculated **Total Balance**, **Total Income**, **Total Expenses**, and **Net Savings Rate** with trend badges and responsive hover lift.
- **Interactive Analytics**:
  - Smooth Recharts AreaChart & BarChart with soft gradient fills (`#7567E8` and `#EA6B78`) and custom frosted glass tooltips.
  - Expense-by-Category Donut Ring chart with central spend metric and interactive legend.
- **Full Transaction Management**:
  - **Add Transactions**: Intuitive iOS segmented controller (Expense vs Income), large typography amount field, category selector, payment method tags, and optional notes.
  - **Edit Transactions**: In-place modification with pre-filled form state.
  - **Delete Transactions**: Safe two-step inline delete confirmation.
  - **Instant Search & Multi-Filters**: Filter by category, transaction type (All / Income / Expense), and custom sort orders.
- **Categories & Budget Health**: Monthly limit progress bars, budget overrun alerts, and income stream breakdowns.
- **Settings & Vault Control**:
  - Multi-currency switcher: USD (`$`), EUR (`€`), GBP (`£`), INR (`₹`), CAD (`CA$`), AUD (`AU$`), JPY (`¥`).
  - Export data to portable JSON backup.
  - Restore / Import transactions from JSON.
  - One-click restore to Apple Demo Data.
- **LocalStorage Persistence**: All transactions and currency preferences automatically persist across browser refreshes with zero external database dependencies.
- **Fully Responsive**: Seamlessly optimized for Desktop, Laptop, Tablet, and Mobile screens with an iOS floating tab bar on mobile.

---

## 🎨 Color Palette & Design System

| Element | Color Hex / Value | Description |
| :--- | :--- | :--- |
| **Main Background** | `#F5F6FA` | Clean, subtle off-white canvas |
| **Primary White** | `#FFFFFF` | Frosted glass card highlights |
| **Primary Accent** | `#7567E8` | Soft Indigo for active states & primary buttons |
| **Secondary Accent** | `#A99CF5` | Lavender for gradients & ambient lighting |
| **Primary Text** | `#20212B` | High-contrast typography |
| **Secondary Text** | `#858796` | Subtitles, labels, and timestamps |
| **Success** | `#36B887` | Income indicators and positive trends |
| **Danger** | `#EA6B78` | Expense indicators and warnings |
| **Glass Borders** | `rgba(255, 255, 255, 0.8)` | Apple translucent edge highlights |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage API

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Expense-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## ☁️ Deployment

### Deploy to Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the Root Directory to `./` (or `Expense-Tracker` if in a subfolder).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

---

## 📄 License

MIT License. Designed with care following Apple Human Interface Guidelines.
