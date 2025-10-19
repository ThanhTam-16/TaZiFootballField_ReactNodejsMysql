import { useState } from 'react';

const RecentBookings = ({ bookings, onRefresh, refreshing }) => {
  const [expandedBooking, setExpandedBooking] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.slice(0, 5) : '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { 
        class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400', 
        text: 'Chờ duyệt',
        icon: 'fas fa-clock'
      },
      approved: { 
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', 
        text: 'Đã duyệt',
        icon: 'fas fa-check-circle'
      },
      completed: { 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', 
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

  const toggleExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-list-alt text-white"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Đặt sân gần đây
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {bookings.length} đơn đặt gần nhất
            </p>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          title="Làm mới"
        >
          <i className={`fas fa-sync-alt text-sm ${refreshing ? 'animate-spin' : ''}`}></i>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-calendar-times text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Chưa có đặt sân nào
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const isExpanded = expandedBooking === booking.id;
              
              return (
                <div
                  key={booking.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleExpand(booking.id)}
                >
                  {/* Main Content */}
                  <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-futbol text-green-600 dark:text-green-400 text-sm"></i>
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {booking.customer_name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                          <i className={`${statusConfig.icon} mr-1.5`}></i>
                          {statusConfig.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <i className="fas fa-map-marker-alt"></i>
                          <span className="truncate">{booking.field_name}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="fas fa-calendar"></i>
                          <span>{formatDate(booking.booking_date)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="fas fa-clock"></i>
                          <span>{formatTime(booking.start_time)}-{formatTime(booking.end_time)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatCurrency(booking.total_amount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.phone_number}
                        </div>
                      </div>
                      <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 text-xs transition-transform duration-200`}></i>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 animate-slideDown">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Loại sân:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {booking.field_type}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Thanh toán:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {booking.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500 dark:text-gray-400">Thời gian đặt:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {new Date(booking.created_at).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        {booking.notes && (
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Ghi chú:</span>
                            <p className="mt-1 text-gray-900 dark:text-white font-medium">
                              {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex space-x-2 mt-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view details
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {bookings.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
          <a
            href="/admin/bookings"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center justify-center space-x-2 hover:underline"
          >
            <span>Xem tất cả đặt sân</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </a>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RecentBookings;