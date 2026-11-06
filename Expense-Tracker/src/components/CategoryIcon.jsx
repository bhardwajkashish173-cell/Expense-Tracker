import {
  Home,
  Utensils,
  ShoppingBag,
  Car,
  Film,
  Zap,
  HeartPulse,
  Briefcase,
  Laptop,
  TrendingUp,
  CircleDot,
  HelpCircle
} from 'lucide-react'

const iconMap = {
  Home,
  Utensils,
  ShoppingBag,
  Car,
  Film,
  Zap,
  HeartPulse,
  Briefcase,
  Laptop,
  TrendingUp,
  CircleDot
}

export default function CategoryIcon({ iconName, size = 18, className = '' }) {
  const IconComponent = iconMap[iconName] || HelpCircle
  return <IconComponent size={size} className={className} />
}
