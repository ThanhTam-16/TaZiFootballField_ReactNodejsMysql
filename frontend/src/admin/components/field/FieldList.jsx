// ====== frontend/src/admin/components/field/FieldList.jsx (OPTIMIZED) ======
const FieldList = ({ fieldsData, currentDate, onBookingClick, filters }) => {
  const allBookings = fieldsData.flatMap(field => 
    field.bookings.map(booking => ({
      ...booking,
      field_name: field.name,
      field_type: field.type,
      field_id: field.id
    }))
  );

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { 
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', 
        text: 'Chờ duyệt',
        icon: 'fas fa-clock'
      },
      approved: { 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', 
        text: 'Đã duyệt',
        icon: 'fas fa-check'
      },
      completed: { 
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', 
        text: 'Hoàn thành',
        icon: 'fas fa-flag-checkered'
      },
      cancelled: { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', 
        text: 'Đã hủy',
        icon: 'fas fa-times-circle'
      }
    };
    return statusMap[status] || { 
      class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', 
      text: status,
      icon: 'fas fa-question'
    };
  };

  const filteredBookings = allBookings.filter(booking => {
    if (filters.fieldType !== 'all' && booking.field_type !== filters.fieldType) {
      return false;
    }
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }
    return true;
  });

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : '';
  };

  if (filteredBookings.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <i className="fas fa-calendar-times text-gray-400 text-lg"></i>
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Không có đơn đặt sân
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filters.fieldType !== 'all' || filters.status !== 'all' 
            ? 'Thử thay đổi bộ lọc để xem thêm kết quả' 
            : 'Chưa có đơn đặt sân nào cho ngày này'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Summary */}
      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-1 mb-1">
          <i className="fas fa-info-circle text-blue-600 dark:text-blue-400 text-xs"></i>
          <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
            Tổng quan ngày {currentDate.toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {filteredBookings.length}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-0.5">đặt sân</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {filteredBookings.filter(b => b.status === 'pending').length}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-0.5">chờ duyệt</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {new Set(filteredBookings.map(b => b.field_id)).size}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-0.5">sân có đặt</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {formatCurrency(filteredBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-1.5">
        {filteredBookings.map((booking, index) => {
          const statusConfig = getStatusConfig(booking.status);
          
          return (
            <div
              key={booking.id || index}
              onClick={() => onBookingClick(booking)}
              className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm hover:translate-y-[-1px]"
            >
              <div className="flex items-start justify-between">
                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate" title={booking.customer_name}>
                        {booking.customer_name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 truncate" title={booking.phone_number}>
                        {booking.phone_number}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-map-marker-alt text-xs"></i>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {booking.field_name}
                      </span>
                      <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                        booking.field_type === '5vs5' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : booking.field_type === '7vs7'
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                      }`}>
                        {booking.field_type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <i className="far fa-clock text-xs"></i>
                      <span>
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                    
                    {booking.total_amount && (
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-money-bill-wave text-xs"></i>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(booking.total_amount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Status & Actions */}
                <div className="flex items-center space-x-2 ml-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                    <i className={`${statusConfig.icon} text-xs`}></i>
                    <span>{statusConfig.text}</span>
                  </span>
                  
                  <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                </div>
              </div>
              
              {/* Additional Info */}
              {booking.note && (
                <div className="mt-1 flex items-start space-x-1">
                  <i className="fas fa-sticky-note text-gray-400 text-xs mt-0.5"></i>
                  <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1" title={booking.note}>
                    {booking.note}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FieldList;