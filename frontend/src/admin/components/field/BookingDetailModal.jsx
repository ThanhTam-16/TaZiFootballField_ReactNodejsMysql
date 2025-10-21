// ====== frontend/src/admin/components/field/BookingDetailModal.jsx (COMPACT) ======
const BookingDetailModal = ({ booking, fieldsData, currentDate, onAction, onClose }) => {
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
    return statusMap[status] || statusMap.pending;
  };

  const field = fieldsData.find(f => f.id === booking.field_id);
  const statusConfig = getStatusConfig(booking.status);
  const isMaintenanceType = booking.type === 'maintenance';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className={`${statusConfig.icon} text-white`}></i>
              <div>
                <h3 className="font-semibold">
                  {isMaintenanceType ? 'Chi tiết bảo trì' : 'Chi tiết đặt sân'}
                </h3>
                <p className="text-white/80 text-xs">
                  #{booking.id}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-times text-white text-xs"></i>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Thông tin cơ bản</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Sân:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{field?.name} ({field?.type})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Thời gian:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Ngày:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {currentDate.toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {!isMaintenanceType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Trạng thái:</span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.class}`}>
                      <i className={statusConfig.icon}></i>
                      <span>{statusConfig.text}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            {!isMaintenanceType && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Thông tin khách hàng</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Khách hàng:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{booking.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Số điện thoại:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{booking.phone_number}</span>
                  </div>
                  {booking.total_amount && (
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Tổng tiền:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatCurrency(booking.total_amount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Ghi chú</h4>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2 justify-end">
            {!isMaintenanceType && (
              <>
                {booking.status === 'pending' && (
                  <>
                    <button 
                      className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium transition-colors duration-200"
                      onClick={() => onAction('approve', booking.id)}
                    >
                      <i className="fas fa-check text-xs"></i>
                      <span>Duyệt</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors duration-200"
                      onClick={() => onAction('cancel', booking.id)}
                    >
                      <i className="fas fa-times text-xs"></i>
                      <span>Từ chối</span>
                    </button>
                  </>
                )}
                {booking.status === 'approved' && (
                  <button 
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors duration-200"
                    onClick={() => onAction('complete', booking.id)}
                  >
                    <i className="fas fa-flag-checkered text-xs"></i>
                    <span>Hoàn thành</span>
                  </button>
                )}
                <a 
                  href={`tel:${booking.phone_number}`}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors duration-200"
                >
                  <i className="fas fa-phone text-xs"></i>
                  <span>Gọi</span>
                </a>
              </>
            )}
            <button 
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors duration-200"
              onClick={onClose}
            >
              <i className="fas fa-times text-xs"></i>
              <span>Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;