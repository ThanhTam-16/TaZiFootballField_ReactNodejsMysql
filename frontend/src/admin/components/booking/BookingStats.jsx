// ====== frontend/src/admin/components/booking/BookingStats.jsx (TAILWIND) ======
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

  const getChangeColor = (current, total) => {
    if (total === 0) return 'text-gray-500 dark:text-gray-400';
    const percentage = (current / total) * 100;
    if (percentage >= 70) return 'text-emerald-600 dark:text-emerald-400';
    if (percentage >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-clipboard-list',
      value: stats.total,
      label: 'Tổng đơn',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      progress: 100
    },
    {
      key: 'pending',
      icon: 'fas fa-clock',
      value: stats.pending,
      label: 'Chờ duyệt',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      progress: stats.total > 0 ? (stats.pending / stats.total) * 100 : 0,
      hasAlert: stats.pending > 0
    },
    {
      key: 'approved',
      icon: 'fas fa-check-circle',
      value: stats.approved,
      label: 'Đã duyệt',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      progress: stats.total > 0 ? (stats.approved / stats.total) * 100 : 0
    },
    {
      key: 'completed',
      icon: 'fas fa-trophy',
      value: stats.completed,
      label: 'Hoàn thành',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      progress: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
    },
    {
      key: 'revenue',
      icon: 'fas fa-money-bill-wave',
      value: window.innerWidth < 768 ? formatCompactCurrency(stats.revenue) : formatCurrency(stats.revenue),
      label: 'Doanh thu',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      progress: 85 // Static for revenue
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.key}
          className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
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
          
          <div className="relative">
            {/* Icon */}
            <div className={`w-8 h-8 md:w-10 md:h-10 ${item.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <i className={`${item.icon} ${item.iconColor} text-sm md:text-base`}></i>
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {item.value}
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                <div 
                  className={`bg-gradient-to-r ${item.color} h-1 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min(item.progress, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Label */}
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
              {item.label}
            </div>

            {/* Percentage for non-total items */}
            {item.key !== 'total' && item.key !== 'revenue' && stats.total > 0 && (
              <div className={`text-xs font-medium mt-1 ${getChangeColor(item.value, stats.total)}`}>
                {Math.round((item.value / stats.total) * 100)}%
              </div>
            )}
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-20"></div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;