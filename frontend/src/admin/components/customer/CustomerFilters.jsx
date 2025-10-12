// ====== frontend/src/admin/components/customer/CustomerFilters.jsx (TAILWIND VERSION) ======
import { useState } from 'react';

const CustomerFilters = ({ filters, onFilterChange, onAddCustomer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Main Filter Row */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SĐT, email..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer min-w-[140px]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-1"
              >
                <i className="fas fa-times text-xs"></i>
                <span className="hidden sm:inline">Xóa bộ lọc</span>
              </button>
            )}

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-1"
            >
              <i className={`fas fa-sliders-h text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>

            {/* Add Customer Button */}
            <button
              onClick={onAddCustomer}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center space-x-2"
            >
              <i className="fas fa-plus text-xs"></i>
              <span>Thêm khách hàng</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* VIP Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loại khách hàng
                </label>
                <select className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Tất cả</option>
                  <option value="vip">Khách VIP</option>
                  <option value="regular">Khách thường</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ngày tạo từ
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Booking Count Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số lần đặt sân
                </label>
                <select className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Tất cả</option>
                  <option value="0">Chưa đặt lần nào</option>
                  <option value="1-5">1-5 lần</option>
                  <option value="6-10">6-10 lần</option>
                  <option value="10+">Trên 10 lần</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 text-sm">
            <i className="fas fa-info-circle text-blue-500"></i>
            <span className="text-blue-700 dark:text-blue-300">
              Đang áp dụng bộ lọc:
            </span>
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Tìm kiếm: "{filters.search}"
                  <button
                    onClick={() => onFilterChange({ search: '' })}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Trạng thái: {filters.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  <button
                    onClick={() => onFilterChange({ status: 'all' })}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFilters;