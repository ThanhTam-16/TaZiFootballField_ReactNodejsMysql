// ====== frontend/src/admin/components/customer/CustomerTable.jsx (OPTIMIZED)
import { customerService } from '../../services';

const CustomerTable = ({
  customers,
  selectedCustomers,
  onSelectCustomer,
  onSelectAll,
  onViewDetail,
  onEditCustomer,
  onDeleteCustomer
}) => {
  const calculateSuccessRate = (customer) => {
    return customerService.calculateSuccessRate(customer);
  };

  const formatCurrency = (amount) => {
    return customerService.formatCurrency(amount);
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-emerald-500';
    if (rate >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-users text-gray-400 text-lg"></i>
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Không có khách hàng nào
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Thử thay đổi bộ lọc hoặc thêm khách hàng mới
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-8 px-2 py-2 text-left">
                <input
                  type="checkbox"
                  checked={customers.length > 0 && selectedCustomers.length === customers.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                />
              </th>
              
              {[
                { key: 'customer', label: 'Khách hàng', width: 'w-40' },
                { key: 'contact', label: 'Liên hệ', width: 'w-32' },
                { key: 'bookings', label: 'Đặt sân', width: 'w-20' },
                { key: 'success', label: 'Thành công', width: 'w-24' },
                { key: 'spending', label: 'Chi tiêu', width: 'w-24' },
                { key: 'status', label: 'Trạng thái', width: 'w-20' },
                { key: 'actions', label: 'Thao tác', width: 'w-16' }
              ].map(column => (
                <th
                  key={column.key}
                  className={`px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.width}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map(customer => {
              const successRate = calculateSuccessRate(customer);
              const isSelected = selectedCustomers.includes(customer.id);
              
              return (
                // Make whole row clickable to open detail modal, but keep interactive controls working
                <tr 
                  key={customer.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onViewDetail(customer.id);
                  }}
                  onClick={() => onViewDetail(customer.id)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectCustomer(customer.id, e.target.checked)}
                      // prevent checkbox clicks from bubbling to row click
                      onClick={(e) => e.stopPropagation()}
                      className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {customer.name}
                          </p>
                          {customer.total_bookings >= 10 && (
                            <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">
                              <i className="fas fa-star text-xs"></i>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Khách từ {customerService.formatDate(customer.created_at)}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-phone text-gray-400 text-xs"></i>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {customer.phone_number}
                        </span>
                      </div>
                      {customer.email && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                          {customer.email}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {customer.total_bookings}
                      </div>
                      {customer.cancelled_bookings > 0 && (
                        <div className="text-xs text-red-500 dark:text-red-400">
                          {customer.cancelled_bookings} hủy
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 min-w-[30px]">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(successRate)}`}
                          style={{ width: `${successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {successRate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(customer.total_spent)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.is_active 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      <div className={`w-1 h-1 rounded-full mr-1 ${
                        customer.is_active ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>
                      {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  
                  <td className="px-2 py-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewDetail(customer.id); }}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-200 text-xs"
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditCustomer(customer); }}
                        className="p-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-all duration-200 text-xs"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteCustomer(customer.id); }}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200 text-xs"
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

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2 p-3">
        {customers.map(customer => {
          const successRate = calculateSuccessRate(customer);
          const isSelected = selectedCustomers.includes(customer.id);
          
          return (
            <div
              key={customer.id}
              // Make card clickable to open detail modal
              onClick={() => onViewDetail(customer.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onViewDetail(customer.id);
              }}
              className={`bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-xs p-3 ${
                isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectCustomer(customer.id, e.target.checked)}
                    // prevent checkbox clicks from triggering card click
                    onClick={(e) => e.stopPropagation()}
                    className="w-3 h-3 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-1 mt-0.5"
                  />
                  
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {customer.name}
                      </span>
                      {customer.total_bookings >= 10 && (
                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">
                          <i className="fas fa-star text-xs"></i>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {customer.phone_number}
                    </span>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.is_active 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  <div className={`w-1 h-1 rounded-full mr-1 ${
                    customer.is_active ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                  {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {customer.total_bookings}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Đặt sân</div>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {successRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Thành công</div>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(customer.total_spent)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Chi tiêu</div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center justify-end space-x-1 pt-2 border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={(e) => { e.stopPropagation(); onViewDetail(customer.id); }}
                  className="px-2 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200 text-xs flex items-center space-x-1"
                >
                  <i className="fas fa-eye text-xs"></i>
                  <span>Xem</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onEditCustomer(customer); }}
                  className="px-2 py-1 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors duration-200 text-xs flex items-center space-x-1"
                >
                  <i className="fas fa-edit text-xs"></i>
                  <span>Sửa</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteCustomer(customer.id); }}
                  className="px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 text-xs flex items-center space-x-1"
                >
                  <i className="fas fa-trash text-xs"></i>
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerTable;