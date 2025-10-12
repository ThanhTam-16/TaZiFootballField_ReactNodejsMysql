// ====== frontend/src/admin/components/field/BookingDetailModal.jsx (TAILWIND) ======
const BookingDetailModal = ({ booking, fieldsData, currentDate, onAction, onClose }) => {
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { 
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800', 
        text: 'Chờ duyệt',
        icon: 'fas fa-clock'
      },
      approved: { 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800', 
        text: 'Đã duyệt',
        icon: 'fas fa-check'
      },
      completed: { 
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', 
        text: 'Hoàn thành',
        icon: 'fas fa-flag-checkered'
      },
      cancelled: { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800', 
        text: 'Đã hủy',
        icon: 'fas fa-times-circle'
      },
      maintenance: { 
        class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800', 
        text: 'Bảo trì',
        icon: 'fas fa-tools'
      }
    };
    return statusMap[status] || statusMap.pending;
  };

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

  const field = fieldsData.find(f => f.id === booking.field_id);
  const statusConfig = getStatusConfig(booking.status);
  const isMaintenanceType = booking.type === 'maintenance';

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isMaintenanceType 
                  ? 'bg-purple-500/20' 
                  : 'bg-white/20'
              }`}>
                <i className={`${statusConfig.icon} text-white text-lg`}></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {isMaintenanceType ? 'Chi tiết bảo trì' : 'Chi tiết đặt sân'}
                </h3>
                <p className="text-white/80 text-sm">
                  #{booking.id} • {formatDateForDisplay(currentDate)}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-info-circle text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Thông tin cơ bản</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-futbol text-green-500 text-sm"></i>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sân:</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">{field?.name}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        field?.type === '5vs5' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : field?.type === '7vs7'
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                      }`}>
                        {field?.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-clock text-blue-500 text-sm"></i>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian:</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.abs(
                          new Date(`2000-01-01 ${booking.end_time}:00`).getTime() - 
                          new Date(`2000-01-01 ${booking.start_time}:00`).getTime()
                        ) / (1000 * 60 * 60)} giờ
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-calendar-day text-purple-500 text-sm"></i>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ngày:</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatDateForDisplay(currentDate)}
                      </div>
                    </div>
                  </div>

                  {!isMaintenanceType && (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-tag text-amber-500 text-sm"></i>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái:</span>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.class}`}>
                          <i className={statusConfig.icon}></i>
                          <span>{statusConfig.text}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {!isMaintenanceType && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-emerald-600 dark:text-emerald-400 text-sm"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Thông tin khách hàng</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-user-circle text-emerald-500 text-sm"></i>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Khách hàng:</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">{booking.customer_name}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-phone text-emerald-500 text-sm"></i>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">{booking.phone_number}</div>
                    </div>
                  </div>

                  {booking.total_amount && (
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-money-bill-wave text-emerald-600 dark:text-emerald-400"></i>
                          <span className="font-medium text-emerald-800 dark:text-emerald-300">Tổng tiền:</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(booking.total_amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-sticky-note text-amber-600 dark:text-amber-400 text-sm"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ghi chú</h4>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-3 justify-end">
            {!isMaintenanceType && (
              <>
                {booking.status === 'pending' && (
                  <>
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                      onClick={() => onAction('approve', booking.id)}
                    >
                      <i className="fas fa-check"></i>
                      <span>Duyệt</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                      onClick={() => onAction('cancel', booking.id)}
                    >
                      <i className="fas fa-times"></i>
                      <span>Từ chối</span>
                    </button>
                  </>
                )}
                {booking.status === 'approved' && (
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => onAction('complete', booking.id)}
                  >
                    <i className="fas fa-flag-checkered"></i>
                    <span>Hoàn thành</span>
                  </button>
                )}
                <a 
                  href={`tel:${booking.phone_number}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <i className="fas fa-phone"></i>
                  <span>Gọi</span>
                </a>
              </>
            )}
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
              <span>Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;