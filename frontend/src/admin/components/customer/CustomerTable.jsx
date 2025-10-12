// ====== frontend/src/admin/components/customer/CustomerTable.jsx (FIXED MOBILE) ======
import { customerService } from '../../services';
import { SkeletonTableRow } from '../common/LoadingSpinner';

const CustomerTable = ({
  customers,
  selectedCustomers,
  filters,
  onSelectCustomer,
  onSelectAll,
  onSort,
  onViewDetail,
  onEditCustomer,
  onDeleteCustomer,
  loading
}) => {
  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return 'fas fa-sort text-gray-300';
    return filters.sortOrder === 'ASC' 
      ? 'fas fa-sort-up text-blue-500' 
      : 'fas fa-sort-down text-blue-500';
  };

  const calculateSuccessRate = (customer) => {
    return customerService.calculateSuccessRate(customer);
  };

  const formatCurrency = (amount) => {
    return customerService.formatCurrency(amount);
  };

  const formatDate = (dateString) => {
    return customerService.formatDate(dateString);
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-emerald-500';
    if (rate >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (loading && customers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Khách hàng</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Liên hệ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đặt sân</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thành công</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chi tiêu</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <SkeletonTableRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {customers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có khách hàng
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có khách hàng nào phù hợp với bộ lọc
            </p>
          </div>
        ) : (
          customers.map((customer) => {
            const successRate = calculateSuccessRate(customer);
            const isSelected = selectedCustomers.includes(customer.id);
            
            return (
              <div 
                key={customer.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${
                  isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectCustomer(customer.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {customer.name}
                        </h3>
                        {customer.total_bookings >= 10 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">
                            <i className="fas fa-star mr-1 text-xs"></i>
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.phone_number}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    customer.is_active 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      customer.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {customer.total_bookings}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Đặt sân</div>
                    {customer.cancelled_bookings > 0 && (
                      <div className="text-xs text-red-500 dark:text-red-400">
                        {customer.cancelled_bookings} hủy
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[40px]">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(successRate)}`}
                          style={{ width: `${successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {successRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Thành công</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(customer.total_spent)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Chi tiêu</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => onViewDetail(customer.id)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
                  >
                    <i className="fas fa-eye mr-1"></i>
                    Xem
                  </button>
                  <button
                    onClick={() => onEditCustomer(customer)}
                    className="px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors duration-200"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Sửa
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(customer.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                  >
                    <i className="fas fa-trash mr-1"></i>
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Khách hàng</span>
                    <i className={`${getSortIcon('name')} text-xs`}></i>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Đặt sân
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thành công
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onSort('total_spent')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Chi tiêu</span>
                    <i className={`${getSortIcon('total_spent')} text-xs`}></i>
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onSort('is_active')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Trạng thái</span>
                    <i className={`${getSortIcon('is_active')} text-xs`}></i>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-users text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Không có khách hàng
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Chưa có khách hàng nào phù hợp với bộ lọc
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const successRate = calculateSuccessRate(customer);
                  const isSelected = selectedCustomers.includes(customer.id);
                  
                  return (
                    <tr 
                      key={customer.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectCustomer(customer.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {customer.name}
                              </p>
                              {customer.total_bookings >= 10 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">
                                  <i className="fas fa-star mr-1 text-xs"></i>
                                  VIP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Khách từ {formatDate(customer.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-phone text-gray-400 text-xs"></i>
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              {customer.phone_number}
                            </span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-envelope text-gray-400 text-xs"></i>
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                {customer.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {customer.total_bookings}
                          </div>
                          {customer.cancelled_bookings > 0 && (
                            <div className="text-xs text-red-500 dark:text-red-400">
                              {customer.cancelled_bookings} hủy
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-[40px]">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(successRate)}`}
                              style={{ width: `${successRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            {successRate.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(customer.total_spent)}
                          </div>
                          {customer.total_bookings > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              TB: {formatCurrency(customer.total_spent / customer.total_bookings)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          customer.is_active 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            customer.is_active ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                          {customer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => onViewDetail(customer.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye text-xs"></i>
                          </button>
                          <button
                            onClick={() => onEditCustomer(customer)}
                            className="p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => onDeleteCustomer(customer.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Xóa"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomerTable;