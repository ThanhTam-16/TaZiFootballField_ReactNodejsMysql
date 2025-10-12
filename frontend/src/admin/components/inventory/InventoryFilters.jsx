// ====== frontend/src/admin/components/inventory/InventoryFilters.jsx (MOBILE OPTIMIZED) ======
const InventoryFilters = ({ filters, onFilterChange, onClearFilters, getCategoryText }) => {
  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.stock_status !== 'all';

  const categoryOptions = [
    { value: 'soft-drink', label: 'Nước ngọt' },
    { value: 'energy-drink', label: 'Nước tăng lực' },
    { value: 'water', label: 'Nước suối' },
    { value: 'tea', label: 'Trà' },
    { value: 'snack', label: 'Đồ ăn nhẹ' },
    { value: 'equipment', label: 'Thiết bị' }
  ];

  const stockStatusOptions = [
    { value: 'in-stock', label: 'Còn hàng' },
    { value: 'low-stock', label: 'Sắp hết' },
    { value: 'out-of-stock', label: 'Hết hàng' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Main Filter Row */}
      <div className="p-3 md:p-4">
        <div className="space-y-3">
          {/* Search Input - Full width on all devices */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên, mã sản phẩm..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            )}
          </div>

          {/* Filter Row - Responsive layout */}
          <div className="flex gap-2 md:gap-3">
            {/* Category Filter */}
            <div className="flex-1 relative">
              <select
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 md:px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer"
              >
                <option value="all">
                  <span className="hidden md:inline">Tất cả danh mục</span>
                  <span className="md:hidden">Tất cả</span>
                </option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>

            {/* Stock Status Filter */}
            <div className="flex-1 relative">
              <select
                value={filters.stock_status}
                onChange={(e) => onFilterChange('stock_status', e.target.value)}
                className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 md:px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer"
              >
                <option value="all">
                  <span className="hidden md:inline">Tất cả trạng thái</span>
                  <span className="md:hidden">Tất cả</span>
                </option>
                {stockStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                title="Xóa lọc"
              >
                <i className="fas fa-times text-xs"></i>
                <span className="hidden sm:inline ml-1">Xóa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="px-3 md:px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 text-sm">
            <i className="fas fa-info-circle text-blue-500 flex-shrink-0"></i>
            <span className="text-blue-700 dark:text-blue-300 hidden sm:inline">
              Đang áp dụng bộ lọc:
            </span>
            <span className="text-blue-700 dark:text-blue-300 sm:hidden">
              Bộ lọc:
            </span>
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  "{filters.search.length > 10 ? filters.search.substring(0, 10) + '...' : filters.search}"
                  <button
                    onClick={() => onFilterChange('search', '')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {getCategoryText(filters.category)}
                  <button
                    onClick={() => onFilterChange('category', 'all')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.stock_status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {stockStatusOptions.find(opt => opt.value === filters.stock_status)?.label}
                  <button
                    onClick={() => onFilterChange('stock_status', 'all')}
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

export default InventoryFilters;