// ====== frontend/src/admin/components/team/TeamStats.jsx (UPDATED - GIỐNG BOOKINGSTATS) ======
const TeamStats = ({ stats, activeTab }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatCompactNumber = (number) => {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  };

  const getPercentage = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  const statItems = [
    {
      key: 'total',
      icon: activeTab === 'matches' ? 'fas fa-futbol' : 'fas fa-users',
      value: stats.total || 0,
      label: `Tổng ${activeTab === 'matches' ? 'Kèo' : 'Ghép đội'}`,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      progress: 100,
      percentage: '100%'
    },
    {
      key: 'open',
      icon: 'fas fa-play-circle',
      value: stats.open || 0,
      label: 'Đang mở',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      progress: getPercentage(stats.open || 0, stats.total || 1),
      percentage: `${getPercentage(stats.open || 0, stats.total || 1)}%`,
      hasAlert: (stats.open || 0) > 0
    },
    {
      key: 'today',
      icon: 'fas fa-calendar-day',
      value: stats.today || 0,
      label: 'Hôm nay',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      progress: getPercentage(stats.today || 0, stats.total || 1),
      percentage: `${getPercentage(stats.today || 0, stats.total || 1)}%`,
      hasAlert: (stats.today || 0) > 0
    },
    {
      key: 'thisWeek',
      icon: 'fas fa-chart-line',
      value: stats.thisWeek || 0,
      label: 'Tuần này',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      progress: getPercentage(stats.thisWeek || 0, stats.total || 1),
      percentage: `${getPercentage(stats.thisWeek || 0, stats.total || 1)}%`
    },
    {
      key: 'revenue',
      icon: 'fas fa-money-bill-wave',
      value: window.innerWidth < 768 ? formatCompactNumber(stats.revenue || 0) : formatCurrency(stats.revenue || 0),
      label: 'Doanh thu',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
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
          
          {/* Alert indicator */}
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

export default TeamStats;