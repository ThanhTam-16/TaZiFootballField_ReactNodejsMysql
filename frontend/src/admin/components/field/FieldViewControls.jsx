// ====== frontend/src/admin/components/field/FieldViewControls.jsx (NORMAL SIZE INLINE) ======
const FieldViewControls = ({ currentView, filters, onViewChange, onFilterChange, onRefresh, loading }) => {
  const hasActiveFilters = filters.fieldType !== 'all' || filters.status !== 'all';

  const clearFilters = () => {
    onFilterChange({
      fieldType: 'all',
      status: 'all'
    });
  };

  const viewModes = [
    {
      key: 'timeline',
      label: 'Timeline',
      icon: 'fas fa-calendar-week',
      description: 'Xem theo lịch thời gian'
    },
    {
      key: 'list',
      label: 'Danh sách',
      icon: 'fas fa-list',
      description: 'Xem theo danh sách'
    }
  ];

  const fieldTypeOptions = [
    { value: 'all', label: 'Tất cả sân', icon: 'fas fa-futbol' },
    { value: '5vs5', label: 'Sân 5 người', icon: 'fas fa-users' },
    { value: '7vs7', label: 'Sân 7 người', icon: 'fas fa-users' },
    { value: '11vs11', label: 'Sân 11 người', icon: 'fas fa-users' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái', icon: 'fas fa-filter' },
    { value: 'available', label: 'Trống', icon: 'fas fa-check-circle' },
    { value: 'booked', label: 'Đã đặt', icon: 'fas fa-calendar-check' },
    { value: 'maintenance', label: 'Bảo trì', icon: 'fas fa-tools' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Desktop: All Controls in One Row */}
      <div className="hidden lg:flex flex-wrap items-center gap-6">
        {/* Header with Clear Filters */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-sliders-h text-purple-600 dark:text-purple-400 text-sm"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Điều khiển hiển thị</h3>
            {hasActiveFilters && (
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Đang áp dụng {Object.values(filters).filter(v => v !== 'all').length} bộ lọc
              </p>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chế độ xem:</span>
          <div className="flex space-x-2">
            {viewModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => onViewChange(mode.key)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  currentView === mode.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                title={mode.description}
              >
                <i className={mode.icon}></i>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          {/* Field Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loại sân:</span>
            <div className="relative">
              <select
                value={filters.fieldType}
                onChange={(e) => onFilterChange({...filters, fieldType: e.target.value})}
                className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer pr-8"
              >
                {fieldTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái:</span>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({...filters, status: e.target.value})}
                className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer pr-8"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm disabled:opacity-50"
        >
          <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* Mobile/Tablet: Stacked Layout */}
      <div className="lg:hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-sliders-h text-purple-600 dark:text-purple-400 text-sm"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Điều khiển hiển thị</h3>
              {hasActiveFilters && (
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Đang áp dụng {Object.values(filters).filter(v => v !== 'all').length} bộ lọc
                </p>
              )}
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chế độ xem
          </label>
          <div className="flex space-x-2">
            {viewModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => onViewChange(mode.key)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  currentView === mode.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                title={mode.description}
              >
                <i className={mode.icon}></i>
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Field Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại sân
            </label>
            <div className="relative">
              <select
                value={filters.fieldType}
                onChange={(e) => onFilterChange({...filters, fieldType: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
              >
                {fieldTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({...filters, status: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            <span>Làm mới dữ liệu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldViewControls;