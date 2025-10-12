// ====== frontend/src/admin/components/field/FieldLegend.jsx (DASHBOARD STYLE COMPACT) ======
const FieldLegend = () => {
  const legendItems = [
    { 
      class: 'available', 
      label: 'Trống',
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      icon: 'fas fa-check-circle',
      description: 'Sân có thể đặt'
    },
    { 
      class: 'booked', 
      label: 'Đã đặt',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: 'fas fa-calendar-check',
      description: 'Đã có khách đặt'
    },
    { 
      class: 'pending', 
      label: 'Chờ duyệt',
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      icon: 'fas fa-clock',
      description: 'Đơn đặt chờ xác nhận'
    },
    { 
      class: 'maintenance', 
      label: 'Bảo trì',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: 'fas fa-tools',
      description: 'Sân đang bảo trì'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
      {/* All in One Row - Dashboard Style */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <i className="fas fa-info-circle text-gray-600 dark:text-gray-400 text-xs"></i>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Chú thích:</h3>
        </div>

        {/* Legend Items - Inline */}
        {legendItems.map((item, index) => (
          <div 
            key={item.class}
            className="group flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-all duration-200 cursor-pointer"
            title={item.description}
          >
            {/* Color indicator - Smaller */}
            <div className={`relative w-3 h-3 ${item.color} rounded-sm shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              {item.class === 'maintenance' && (
                <div className="absolute inset-0 bg-white/20 rounded-sm bg-stripes"></div>
              )}
            </div>
            
            {/* Label - Compact */}
            <div className="flex items-center space-x-1">
              <i className={`${item.icon} text-gray-600 dark:text-gray-400 text-xs`}></i>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            </div>
          </div>
        ))}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Tips - Inline on larger screens */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
          <i className="fas fa-lightbulb"></i>
          <span>Nhấn vào ô trống để tạo đặt sân mới, nhấn vào ô đã đặt để xem chi tiết</span>
        </div>
      </div>

      {/* Mobile Tips */}
      <div className="lg:hidden mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <div className="flex items-start space-x-2">
          <i className="fas fa-lightbulb text-blue-600 dark:text-blue-400 text-xs mt-0.5"></i>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Nhấn vào ô trống để tạo đặt sân mới, nhấn vào ô đã đặt để xem chi tiết
          </p>
        </div>
      </div>

      <style jsx>{`
        .bg-stripes {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.3) 2px,
            rgba(255, 255, 255, 0.3) 4px
          );
        }
      `}</style>
    </div>
  );
};

export default FieldLegend;