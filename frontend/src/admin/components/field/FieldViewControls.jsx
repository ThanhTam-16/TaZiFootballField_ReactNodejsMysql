// ====== frontend/src/admin/components/field/FieldViewControls.jsx (COMPACT) ======
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
    },
    {
      key: 'list',
      label: 'Danh sách',
      icon: 'fas fa-list',
    }
  ];

  const fieldTypeOptions = [
    { value: 'all', label: 'Tất cả sân' },
    { value: '5vs5', label: 'Sân 5' },
    { value: '7vs7', label: 'Sân 7' },
    { value: '11vs11', label: 'Sân 11' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'available', label: 'Trống' },
    { value: 'booked', label: 'Đã đặt' },
    { value: 'maintenance', label: 'Bảo trì' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
              <i className="fas fa-sliders-h text-blue-600 dark:text-blue-400 text-xs"></i>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bộ lọc hiển thị</h3>
              {hasActiveFilters && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Đang áp dụng {Object.values(filters).filter(v => v !== 'all').length} bộ lọc
                </p>
              )}
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
            >
              <i className="fas fa-times text-xs"></i>
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* View Mode Toggle */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chế độ xem
            </label>
            <div className="flex space-x-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => onViewChange(mode.key)}
                  className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded border text-xs font-medium transition-colors duration-200 ${
                    currentView === mode.key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <i className={`${mode.icon} text-xs`}></i>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Field Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại sân
            </label>
            <div className="relative">
              <select
                value={filters.fieldType}
                onChange={(e) => onFilterChange({...filters, fieldType: e.target.value})}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-xs appearance-none cursor-pointer"
              >
                {fieldTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({...filters, status: e.target.value})}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-xs appearance-none cursor-pointer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldViewControls;