// ====== frontend/src/admin/components/booking/BookingStats.jsx (OPTIMIZED WITH PASTEL COLORS) ======
const BookingStats = ({ bookings = [] }) => {
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const getPercentage = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-clipboard-list',
      value: stats.total,
      label: 'Tổng đơn',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      progress: 100,
      percentage: '100%'
    },
    {
      key: 'pending',
      icon: 'fas fa-clock',
      value: stats.pending,
      label: 'Chờ duyệt',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      progress: getPercentage(stats.pending, stats.total),
      percentage: `${getPercentage(stats.pending, stats.total)}%`,
      hasAlert: stats.pending > 0
    },
    {
      key: 'approved',
      icon: 'fas fa-check-circle',
      value: stats.approved,
      label: 'Đã duyệt',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      progress: getPercentage(stats.approved, stats.total),
      percentage: `${getPercentage(stats.approved, stats.total)}%`
    },
    {
      key: 'completed',
      icon: 'fas fa-trophy',
      value: stats.completed,
      label: 'Hoàn thành',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      progress: getPercentage(stats.completed, stats.total),
      percentage: `${getPercentage(stats.completed, stats.total)}%`
    },
    {
      key: 'revenue',
      icon: 'fas fa-money-bill-wave',
      value: window.innerWidth < 768 ? formatCompactCurrency(stats.revenue) : formatCurrency(stats.revenue),
      label: 'Doanh thu',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      progress: 85,
      percentage: '85%'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.key}
          className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          {/* Alert indicator for pending */}
          {item.hasAlert && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          )}
          
          {/* Mobile Layout - Compact */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                  <i className={`${item.icon} ${item.iconColor} text-sm`}></i>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {item.label}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {item.percentage}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Full with progress */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${item.icon} ${item.iconColor} text-base`}></i>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {item.percentage}
                </div>
              </div>
            </div>
            
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {item.label}
            </div>
            
            {/* Progress bar with gradient */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500 ease-out shadow-sm`}
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-20"></div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;