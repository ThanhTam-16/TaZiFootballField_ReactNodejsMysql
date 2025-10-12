// ====== frontend/src/admin/components/booking/BookingTable.jsx (TAILWIND) ======
import { useState } from 'react';

const BookingTable = ({ 
  bookings, 
  loading, 
  selectedBookings, 
  onSelectBooking, 
  onSelectAll, 
  onStatusUpdate, 
  onEdit, 
  onDelete
}) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedBooking, setExpandedBooking] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
        class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400', 
        text: 'Đã duyệt',
        icon: 'fas fa-check'
      },
      cancelled: { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', 
        text: 'Đã hủy',
        icon: 'fas fa-times'
      },
      completed: { 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', 
        text: 'Hoàn thành',
        icon: 'fas fa-flag-checkered'
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const toggleExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (bookings.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-clipboard-list text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không có đơn đặt sân nào
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Thử thay đổi bộ lọc hoặc thêm đơn đặt sân mới
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={bookings.length > 0 && selectedBookings.length === bookings.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              
              {[
                { key: 'id', label: 'ID', sortable: true },
                { key: 'customer_name', label: 'Khách hàng', sortable: true },
                { key: 'field', label: 'Sân', sortable: false },
                { key: 'booking_date', label: 'Ngày & Giờ', sortable: true },
                { key: 'status', label: 'Trạng thái', sortable: true },
                { key: 'total_amount', label: 'Tổng tiền', sortable: true },
                { key: 'actions', label: 'Thao tác', sortable: false }
              ].map(column => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none' : ''
                  }`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <i className={`fas fa-sort${
                        sortField === column.key 
                          ? (sortDirection === 'asc' ? '-up' : '-down') 
                          : ''
                      } text-xs opacity-50`}></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {bookings.map(booking => {
              const status = getStatusConfig(booking.status);
              return (
                <tr 
                  key={booking.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => onSelectBooking(booking.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      #{booking.id}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.customer_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.phone_number}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.field_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.field_type}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.class}`}>
                      <i className={status.icon}></i>
                      <span>{status.text}</span>
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-1">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(booking.id, 'approved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors duration-200"
                            title="Duyệt"
                          >
                            <i className="fas fa-check text-xs"></i>
                          </button>
                          <button
                            onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                            title="Từ chối"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onEdit(booking)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button
                        onClick={() => onDelete(booking.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                        title="Xóa"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 p-4">
        {bookings.map(booking => {
          const status = getStatusConfig(booking.status);
          const isExpanded = expandedBooking === booking.id;
          
          return (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              {/* Card Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(booking.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectBooking(booking.id, e.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      #{booking.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                      <i className={status.icon}></i>
                      <span>{status.text}</span>
                    </span>
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 text-xs`}></i>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-futbol text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {booking.customer_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{booking.phone_number}</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(booking.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Sân:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {booking.field_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ngày:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formatDate(booking.booking_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Loại sân:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {booking.field_type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Giờ chơi:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Ghi chú:</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(booking.id, 'approved')}
                          className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 min-w-0"
                        >
                          <i className="fas fa-check mr-1"></i>
                          Duyệt
                        </button>
                        <button
                          onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 min-w-0"
                        >
                          <i className="fas fa-times mr-1"></i>
                          Từ chối
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onEdit(booking)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTable;