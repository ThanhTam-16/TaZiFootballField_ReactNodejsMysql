import { useState, useEffect } from 'react';

const DashboardStats = ({ stats }) => {
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    // Animate numbers on mount
    const timer = setTimeout(() => {
      setAnimatedStats(stats);
    }, 100);
    return () => clearTimeout(timer);
  }, [stats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statItems = [
    {
      key: 'revenue',
      icon: 'fas fa-money-bill-wave',
      value: formatCurrency(stats.today_revenue),
      label: 'Doanh thu hôm nay',
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'bookings',
      icon: 'fas fa-calendar-check',
      value: stats.today_bookings,
      label: 'Đặt sân hôm nay',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'pending',
      icon: 'fas fa-clock',
      value: stats.pending_bookings,
      label: 'Chờ duyệt',
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      pulse: stats.pending_bookings > 0
    },
    {
      key: 'fields',
      icon: 'fas fa-futbol',
      value: stats.total_fields,
      label: 'Tổng số sân',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      key: 'users',
      icon: 'fas fa-users',
      value: stats.total_users,
      label: 'Khách hàng',
      gradient: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.key}
          className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            animation: 'slideUp 0.5s ease-out',
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'backwards'
          }}
        >
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          <div className="relative">
            {/* Icon */}
            <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <i className={`${item.icon} ${item.iconColor} text-xl`}></i>
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {item.value}
              </div>
            </div>

            {/* Label */}
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
              {item.label}
            </div>

            {/* Pulse Indicator */}
            {item.pulse && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;