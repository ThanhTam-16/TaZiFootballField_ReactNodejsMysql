// ====== frontend/src/admin/components/inventory/InventoryStats.jsx (OPTIMIZED - WITH ANIMATION) ======
import { useState, useEffect } from 'react';

const InventoryStats = ({ stats = {}, formatPrice }) => {
  const {
    total_products = 0,
    total_value = 0,
    out_of_stock = 0,
    low_stock = 0,
    today_transactions = 0
  } = stats;

  const [animatedProgress, setAnimatedProgress] = useState({});

  const statItems = [
    {
      key: 'total',
      icon: 'fas fa-boxes',
      value: total_products,
      label: 'Tổng sản phẩm',
      color: 'blue',
      progress: 100,
      targetProgress: 100
    },
    {
      key: 'value',
      icon: 'fas fa-dollar-sign',
      value: formatPrice(total_value),
      label: 'Giá trị tồn kho',
      color: 'emerald',
      progress: Math.min((total_value / 10000000) * 100, 100),
      targetProgress: Math.min((total_value / 10000000) * 100, 100),
      isPrice: true
    },
    {
      key: 'outStock',
      icon: 'fas fa-times-circle',
      value: out_of_stock,
      label: 'Hết hàng',
      color: 'red',
      progress: total_products > 0 ? (out_of_stock / total_products) * 100 : 0,
      targetProgress: total_products > 0 ? (out_of_stock / total_products) * 100 : 0,
      hasAlert: out_of_stock > 0
    },
    {
      key: 'lowStock',
      icon: 'fas fa-exclamation-triangle',
      value: low_stock,
      label: 'Sắp hết',
      color: 'amber',
      progress: total_products > 0 ? (low_stock / total_products) * 100 : 0,
      targetProgress: total_products > 0 ? (low_stock / total_products) * 100 : 0,
      hasAlert: low_stock > 0
    },
    {
      key: 'transactions',
      icon: 'fas fa-exchange-alt',
      value: today_transactions,
      label: 'Giao dịch hôm nay',
      color: 'purple',
      progress: Math.min((today_transactions / 50) * 100, 100),
      targetProgress: Math.min((today_transactions / 50) * 100, 100),
      hasAlert: today_transactions > 0
    }
  ];

  // Animation effect for progress bars
  useEffect(() => {
    const timer = setTimeout(() => {
      const newProgress = {};
      statItems.forEach(item => {
        newProgress[item.key] = item.targetProgress;
      });
      setAnimatedProgress(newProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [stats]);

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        progress: 'bg-gradient-to-r from-blue-500 to-blue-600'
      },
      emerald: {
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        icon: 'text-emerald-600 dark:text-emerald-400',
        progress: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
      },
      red: {
        gradient: 'from-red-500 to-red-600',
        bg: 'bg-red-50 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        progress: 'bg-gradient-to-r from-red-500 to-red-600'
      },
      amber: {
        gradient: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        icon: 'text-amber-600 dark:text-amber-400',
        progress: 'bg-gradient-to-r from-amber-500 to-amber-600'
      },
      purple: {
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        progress: 'bg-gradient-to-r from-purple-500 to-purple-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const getPercentageText = (item) => {
    if (item.key === 'total') return '100%';
    if (item.key === 'value') return total_value >= 1000000 ? `${(total_value / 1000000).toFixed(1)}M` : formatPrice(total_value);
    if (item.key === 'outStock' || item.key === 'lowStock') {
      return total_products > 0 ? `${Math.round(item.targetProgress)}%` : '0%';
    }
    if (item.key === 'transactions') return `${Math.min(today_transactions, 50)}/50`;
    return `${Math.round(item.targetProgress)}%`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {statItems.map((item, index) => {
        const colorClasses = getColorClasses(item.color);
        const currentProgress = animatedProgress[item.key] || 0;
        const percentageText = getPercentageText(item);

        return (
          <div 
            key={item.key}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Alert indicator */}
            {item.hasAlert && (
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${
                item.key === 'outStock' ? 'bg-red-500' : 
                item.key === 'lowStock' ? 'bg-amber-500' : 
                item.key === 'transactions' ? 'bg-purple-500' : 'bg-blue-500'
              }`}></div>
            )}
            
            {/* Mobile Layout - Compact */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                    <i className={`${item.icon} ${colorClasses.icon} text-sm`}></i>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {item.label}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {typeof item.value === 'string' ? item.value : formatNumber(item.value)}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {percentageText}
                </div>
              </div>

              {/* Progress Bar - Mobile */}
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${colorClasses.progress}`}
                    style={{ width: `${currentProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Full with progress */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${item.icon} ${colorClasses.icon} text-base`}></i>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {typeof item.value === 'string' ? item.value : formatNumber(item.value)}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {percentageText}
                  </div>
                </div>
              </div>
              
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {item.label}
              </div>
              
              {/* Progress bar with animation */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClasses.progress}`}
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-20"></div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryStats;