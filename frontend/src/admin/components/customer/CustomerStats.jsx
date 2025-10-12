// ====== frontend/src/admin/components/customer/CustomerStats.jsx (TAILWIND VERSION) ======
const CustomerStats = ({ stats }) => {
  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-users',
      value: stats.total_customers,
      label: 'Tổng khách hàng',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '+12%',
      trendUp: true
    },
    {
      key: 'active',
      icon: 'fas fa-check-circle',
      value: stats.active_customers,
      label: 'Đang hoạt động',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      trend: '+8%',
      trendUp: true
    },
    {
      key: 'vip',
      icon: 'fas fa-star',
      value: stats.vip_customers,
      label: 'Khách VIP',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: '+3%',
      trendUp: true
    },
    {
      key: 'new',
      icon: 'fas fa-user-plus',
      value: stats.new_customers_30d,
      label: 'Khách mới (30 ngày)',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: '+15%',
      trendUp: true
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.key}
          className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
          
          <div className="relative">
            {/* Icon */}
            <div className={`w-8 h-8 md:w-10 md:h-10 ${item.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <i className={`${item.icon} ${item.iconColor} text-sm md:text-base`}></i>
            </div>

            {/* Value */}
            <div className="mb-1">
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {formatNumber(item.value)}
              </div>
              
              {/* Trend */}
              {item.trend && (
                <div className={`flex items-center space-x-1 mt-1 ${
                  item.trendUp === true 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : item.trendUp === false 
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.trendUp === true && <i className="fas fa-arrow-up text-xs"></i>}
                  {item.trendUp === false && <i className="fas fa-arrow-down text-xs"></i>}
                  <span className="text-xs font-medium">{item.trend}</span>
                </div>
              )}
            </div>

            {/* Label */}
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
              {item.label}
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`absolute top-2 right-2 w-2 h-2 ${
            item.key === 'vip' && stats.vip_customers > 0 
              ? 'bg-amber-500 animate-pulse' 
              : item.key === 'new' && stats.new_customers_30d > 0
                ? 'bg-purple-500 animate-pulse'
                : 'bg-gray-300 dark:bg-gray-600'
          } rounded-full`}></div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;