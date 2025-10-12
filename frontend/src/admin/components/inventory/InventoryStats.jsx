// ====== frontend/src/admin/components/inventory/InventoryStats.jsx ======
const InventoryStats = ({ stats, formatPrice }) => {
  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-boxes',
      value: stats.total_stock || 0,
      label: 'Tổng tồn kho',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      key: 'value',
      icon: 'fas fa-dollar-sign',
      value: formatPrice(stats.total_value || 0),
      label: 'Giá trị tồn kho',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      isPrice: true
    },
    {
      key: 'outStock',
      icon: 'fas fa-exclamation-triangle',
      value: stats.out_of_stock || 0,
      label: 'Hết hàng',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      key: 'transactions',
      icon: 'fas fa-exchange-alt',
      value: stats.today_transactions || 0,
      label: 'Giao dịch hôm nay',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  const formatDisplayValue = (item) => {
    if (item.isPrice) {
      // For price values, show compact format on mobile
      const value = stats.total_value || 0;
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return formatPrice(value);
    }
    return item.value;
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
                <span className="block sm:hidden">
                  {formatDisplayValue(item)}
                </span>
                <span className="hidden sm:block">
                  {item.value}
                </span>
              </div>
              
              {/* Full price on mobile tooltip */}
              {item.isPrice && (
                <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatPrice(stats.total_value || 0)}
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
            item.key === 'outStock' && stats.out_of_stock > 0 
              ? 'bg-red-500 animate-pulse' 
              : item.key === 'transactions' && stats.today_transactions > 0
                ? 'bg-amber-500 animate-pulse'
                : 'bg-gray-300 dark:bg-gray-600'
          } rounded-full`}></div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;