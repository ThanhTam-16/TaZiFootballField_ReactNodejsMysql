// ====== frontend/src/admin/components/booking/BookingTable.jsx (OPTIMIZED) ======
import { useState } from 'react';

const BookingTable = ({ 
  bookings, 
  loading, 
  selectedBookings, 
  onSelectBooking, 
  onSelectAll, 
  onStatusUpdate, 
  onEdit, 
  onDelete,
  onRowClick
}) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

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

  if (bookings.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-clipboard-list text-gray-400 text-lg"></i>
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Không có đơn đặt sân nào
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Thử thay đổi bộ lọc hoặc thêm đơn đặt sân mới
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table - Compact */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-8 px-2 py-2 text-left">
                <input
                  type="checkbox"
                  checked={bookings.length > 0 && selectedBookings.length === bookings.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                />
              </th>
              
              {[
                { key: 'id', label: 'ID', sortable: true, width: 'w-12' },
                { key: 'customer_name', label: 'Khách hàng', sortable: true, width: 'w-32' },
                { key: 'field', label: 'Sân', sortable: false, width: 'w-20' },
                { key: 'booking_date', label: 'Ngày & Giờ', sortable: true, width: 'w-28' },
                { key: 'total_amount', label: 'Tiền', sortable: true, width: 'w-20' },
                { key: 'status', label: 'Trạng thái', sortable: true, width: 'w-24' },
                { key: 'actions', label: 'Thao tác', sortable: false, width: 'w-20' }
              ].map(column => (
                <th
                  key={column.key}
                  className={`px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.width} ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none' : ''
                  }`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{column.label}</span>
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
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                  onClick={() => onRowClick(booking)}
                >
                  <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => onSelectBooking(booking.id, e.target.checked)}
                      className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </td>
                  
                  <td className="px-2 py-2">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      #{booking.id}
                    </span>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {booking.customer_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {booking.phone_number}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {booking.field_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {booking.field_type}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(booking.start_time)}-{formatTime(booking.end_time)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </td>
                  
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                      <i className={status.icon}></i>
                      <span>{status.text}</span>
                    </span>
                  </td>
                  
                  <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-1">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(booking.id, 'approved')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors duration-200 text-xs"
                            title="Duyệt"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 text-xs"
                            title="Từ chối"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(booking);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200 text-xs"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(booking.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 text-xs"
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Compact */}
      <div className="lg:hidden space-y-2 p-3">
        {bookings.map(booking => {
          const status = getStatusConfig(booking.status);
          
          return (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-xs p-3 cursor-pointer hover:shadow-sm transition-shadow duration-150"
              onClick={() => onRowClick(booking)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectBooking(booking.id, e.target.checked);
                    }}
                    className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1 mt-0.5"
                  />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    #{booking.id}
                  </span>
                  <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                    <i className={status.icon}></i>
                    <span>{status.text}</span>
                  </span>
                </div>
                
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap ml-2">
                  {formatCurrency(booking.total_amount)}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {booking.customer_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                    {booking.phone_number}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{booking.field_name} ({booking.field_type})</span>
                  <span>{formatDate(booking.booking_date)} {formatTime(booking.start_time)}-{formatTime(booking.end_time)}</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center justify-end space-x-1 mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(booking.id, 'approved');
                      }}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center space-x-1"
                    >
                      <i className="fas fa-check text-xs"></i>
                      <span>Duyệt</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(booking.id, 'cancelled');
                      }}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center space-x-1"
                    >
                      <i className="fas fa-times text-xs"></i>
                      <span>Từ chối</span>
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(booking);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200 text-xs"
                  title="Chỉnh sửa"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(booking.id);
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 text-xs"
                  title="Xóa"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTable;