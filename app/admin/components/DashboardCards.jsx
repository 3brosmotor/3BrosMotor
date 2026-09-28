'use client';

import { Star, Banknote, Users } from 'lucide-react';

export default function DashboardCards({ 
  purchaseCount = 0,
  expensesCount = 0,
  salesCount = 0,
  vehiclesCount = 0,
  onCardClick
}) {
  const cards = [
    {
      id: 'purchase',
      title: 'Purchase',
      value: purchaseCount,
      icon: Star,
      // Vibrant royal-blue gradient exactly as in screenshot
      bgGradient: 'bg-gradient-to-r from-[#3e68f3] via-[#4477f7] to-[#599eff]',
      tabTarget: 'vehicles'
    },
    {
      id: 'expenses',
      title: 'Expenses',
      value: expensesCount,
      icon: Banknote,
      // Vibrant tomato red-orange gradient
      bgGradient: 'bg-gradient-to-r from-[#ff2a54] via-[#ff4340] to-[#ff6337]',
      tabTarget: 'expenses'
    },
    {
      id: 'sale',
      title: 'Sale',
      value: salesCount,
      icon: Banknote,
      // Vibrant emerald-forest green gradient
      bgGradient: 'bg-gradient-to-r from-[#0d824d] via-[#109559] to-[#2ca864]',
      tabTarget: 'sold-vehicles'
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      value: vehiclesCount,
      icon: Users,
      // Vibrant purple-magenta-pink gradient
      bgGradient: 'bg-gradient-to-r from-[#882194] via-[#b6247c] to-[#d9296e]',
      tabTarget: 'vehicles'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 mb-5 sm:mb-8">
      {cards.map((card) => {
        const IconComponent = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.tabTarget)}
            className={`${card.bgGradient} rounded-xl p-3 sm:p-5 lg:p-6 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer relative overflow-hidden select-none`}
          >
            {/* Top row: Title and Icon */}
            <div className="flex items-center justify-between mb-1.5 sm:mb-4">
              <span className="text-xs sm:text-base lg:text-lg font-semibold tracking-tight truncate">
                {card.title}
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs flex-shrink-0">
                <IconComponent size={14} className="text-white fill-white/80 sm:hidden" />
                <IconComponent size={18} className="text-white fill-white/80 hidden sm:block" />
              </div>
            </div>

            {/* Large Centered Number matching screenshot */}
            <div className="text-center py-1 sm:py-2.5">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white drop-shadow-xs">
                {card.value}
              </span>
            </div>

            {/* Subtle soft bottom highlight */}
            <div className="mt-0.5 sm:mt-1 text-center">
              <span className="text-[9px] sm:text-[11px] font-medium text-white/80 tracking-wide uppercase">
                {card.id === 'vehicles' ? 'In Stock' : 'Active'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
