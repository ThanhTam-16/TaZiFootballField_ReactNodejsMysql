// ====== frontend/src/admin/components/maintenance/MaintenanceFilters.jsx ======
import { useState } from 'react';

const MaintenanceFilters = ({ 
  filters, 
  fields, 
  onFilterChange, 
  getFieldText, 
  getStatusText, 
  getTypeText 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleFieldChange = (e) => {
    onFilterChange({ field_id: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleTypeChange = (e) => {
    onFilterChange({ type: e.target.value });
  };

  const handleDateFromChange = (e) => {
    onFilterChange({ date_from: e.target.value });
  };

  const handleDateToChange = (e) => {
    onFilterChange({ date_to: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      field_id: 'all',
      status: 'all',
      type: 'all',
      date_from: '',
      date_to: '',
      sortBy: 'scheduled_date',
      sortOrder: 'DESC'
    });
  };

  const hasActiveFilters = filters.search || 
    filters.field_id !== 'all' || 
    filters.status !== 'all' || 
    filters.type !== 'all' ||
    filters.date_from ||
    filters.date_to;

  const statusOptions = [
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'in_progress', label: 'Đang thực hiện' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const typeOptions = [
    { value: 'routine', label: 'Bảo trì định kỳ' },
    { value: 'repair', label: 'Sửa chữa' },
    { value: 'upgrade', label: 'Nâng cấp' },
    { value: 'holiday', label: 'Nghỉ lễ' },
    { value: 'emergency', label: 'Khẩn cấp' }
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
              placeholder="Tìm theo tiêu đề, mô tả..."
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

          {/* Filter Row - Responsive layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {/* Field Filter */}
            <div className="relative">
              <select
                value={filters.field_id}
                onChange={handleFieldChange}
                className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer"
              >
                <option value="all">Tất cả sân</option>
                {fields.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.status}
                onChange={handleStatusChange}
                className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filters.type}
                onChange={handleTypeChange}
                className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer"
              >
                <option value="all">Tất cả loại</option>
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center"
                title="Bộ lọc nâng cao"
              >
                <i className={`fas fa-calendar-alt text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  title="Xóa lọc"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters - Date Range */}
          {isExpanded && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={handleDateFromChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={handleDateToChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
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
                    onClick={() => onFilterChange({ search: '' })}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.field_id !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {getFieldText(filters.field_id)}
                  <button
                    onClick={() => onFilterChange({ field_id: 'all' })}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {getStatusText(filters.status)}
                  <button
                    onClick={() => onFilterChange({ status: 'all' })}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.type !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {getTypeText(filters.type)}
                  <button
                    onClick={() => onFilterChange({ type: 'all' })}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {(filters.date_from || filters.date_to) && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {filters.date_from && filters.date_to ? 
                    `${filters.date_from} - ${filters.date_to}` :
                    filters.date_from ? `Từ ${filters.date_from}` :
                    `Đến ${filters.date_to}`
                  }
                  <button
                    onClick={() => onFilterChange({ date_from: '', date_to: '' })}
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

export default MaintenanceFilters;