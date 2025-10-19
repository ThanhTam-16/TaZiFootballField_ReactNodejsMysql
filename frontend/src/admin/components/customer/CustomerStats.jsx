// ====== frontend/src/admin/components/customer/CustomerStats.jsx (OPTIMIZED - COMPACT) ======
const CustomerStats = ({ stats = {} }) => {
  const {
    total_customers = 0,
    active_customers = 0,
    inactive_customers = 0,
    new_customers_30d = 0,
    vip_customers = 0
  } = stats;

  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-users',
      value: total_customers,
      label: 'Tổng khách hàng',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      progress: 100,
      percentage: '100%'
    },
    {
      key: 'active',
      icon: 'fas fa-check-circle',
      value: active_customers,
      label: 'Đang hoạt động',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      progress: total_customers > 0 ? Math.round((active_customers / total_customers) * 100) : 0,
      percentage: total_customers > 0 ? `${Math.round((active_customers / total_customers) * 100)}%` : '0%'
    },
    {
      key: 'vip',
      icon: 'fas fa-star',
      value: vip_customers,
      label: 'Khách VIP',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      progress: total_customers > 0 ? Math.round((vip_customers / total_customers) * 100) : 0,
      percentage: total_customers > 0 ? `${Math.round((vip_customers / total_customers) * 100)}%` : '0%',
      hasAlert: vip_customers > 0
    },
    {
      key: 'new',
      icon: 'fas fa-user-plus',
      value: new_customers_30d,
      label: 'Khách mới (30d)',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      progress: Math.min((new_customers_30d / 50) * 100, 100), // Assuming 50 as max for progress
      percentage: `${Math.min(new_customers_30d, 50)}/50`,
      hasAlert: new_customers_30d > 0
    },
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
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {statItems.map((item, index) => (
        <div 
          key={item.key}
          className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          {/* Alert indicator */}
          {item.hasAlert && (
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${
              item.key === 'vip' ? 'bg-amber-500' : 
              item.key === 'new' ? 'bg-purple-500' : 
              item.key === 'inactive' ? 'bg-red-500' : 'bg-blue-500'
            }`}></div>
          )}
          
          {/* Mobile Layout - Compact */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <i className={`${item.icon} ${item.iconColor} text-sm`}></i>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {item.label}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatNumber(item.value)}
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {item.percentage}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Full with progress */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${item.icon} ${item.iconColor} text-base`}></i>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatNumber(item.value)}
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
                className={`h-2 rounded-full transition-all duration-500 ease-out shadow-sm bg-gradient-to-r ${item.color}`}
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

export default CustomerStats;