// ====== frontend/src/admin/components/field/FieldList.jsx (TAILWIND) ======
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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-calendar-times text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không có đơn đặt sân
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {filters.fieldType !== 'all' || filters.status !== 'all' 
            ? 'Thử thay đổi bộ lọc để xem thêm kết quả' 
            : 'Chưa có đơn đặt sân nào cho ngày này'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-2">
          <i className="fas fa-info-circle text-blue-600 dark:text-blue-400"></i>
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Tổng quan ngày {currentDate.toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {filteredBookings.length}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-1">đặt sân</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {filteredBookings.filter(b => b.status === 'pending').length}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-1">chờ duyệt</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {new Set(filteredBookings.map(b => b.field_id)).size}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-1">sân có đặt</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {formatCurrency(filteredBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0))}
            </span>
            <span className="text-blue-800 dark:text-blue-300 ml-1 block md:inline">doanh thu</span>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((booking, index) => {
          const status = getStatusConfig(booking.status);
          
          return (
            <div
              key={booking.id}
              onClick={() => onBookingClick(booking)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    booking.field_type === '5vs5' 
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : booking.field_type === '7vs7'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    <i className={`fas fa-futbol ${
                      booking.field_type === '5vs5' 
                        ? 'text-green-600 dark:text-green-400'
                        : booking.field_type === '7vs7'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-purple-600 dark:text-purple-400'
                    } text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {booking.field_name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {booking.field_type}
                    </p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                  <i className={status.icon}></i>
                  <span>{status.text}</span>
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-1">
                  <i className="fas fa-user text-gray-400 text-xs"></i>
                  <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {booking.customer_name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-phone text-gray-400 text-xs"></i>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {booking.phone_number}
                  </span>
                </div>
              </div>

              {/* Time & Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-clock text-gray-400 text-xs"></i>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </span>
                  </div>
                  {booking.total_amount && (
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(booking.total_amount)}
                    </span>
                  )}
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Thời gian: {Math.abs(
                      new Date(`2000-01-01 ${booking.end_time}:00`).getTime() - 
                      new Date(`2000-01-01 ${booking.start_time}:00`).getTime()
                    ) / (1000 * 60 * 60)} giờ
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    #{booking.id}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    <i className="fas fa-sticky-note mr-1"></i>
                    {booking.notes}
                  </p>
                </div>
              )}

              {/* Hover Action Indicator */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">
                  <i className="fas fa-mouse-pointer mr-1"></i>
                  Nhấn để xem chi tiết
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load more placeholder for future pagination */}
      {filteredBookings.length > 20 && (
        <div className="text-center mt-6">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm">
            Xem thêm đặt sân
          </button>
        </div>
      )}
    </div>
  );
};

export default FieldList;