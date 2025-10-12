// ====== frontend/src/admin/components/team/TeamFilters.jsx ======
import { useState } from 'react';

const TeamFilters = ({ filters, activeTab, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('status', '');
    onFilterChange('field_type', '');
    onFilterChange('date_from', '');
    onFilterChange('date_to', '');
  };

  const hasActiveFilters = filters.search || filters.status || filters.field_type || filters.date_from || filters.date_to;

  const getStatusOptions = () => {
    if (activeTab === 'matches') {
      return [
        { value: 'open', label: 'Đang mở' },
        { value: 'full', label: 'Đầy' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'closed', label: 'Đóng' }
      ];
    } else {
      return [
        { value: 'open', label: 'Đang mở' },
        { value: 'closed', label: 'Đóng' }
      ];
    }
  };

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
              placeholder={`Tìm kiếm ${activeTab === 'matches' ? 'kèo' : 'ghép đội'}...`}
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

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer min-w-[140px]"
            >
              <option value="">Tất cả trạng thái</option>
              {getStatusOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
          </div>

          {/* Field Type Filter */}
          <div className="relative">
            <select
              value={filters.field_type}
              onChange={(e) => onFilterChange('field_type', e.target.value)}
              className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 cursor-pointer min-w-[120px]"
            >
              <option value="">Tất cả sân</option>
              <option value="5vs5">Sân 5</option>
              <option value="7vs7">Sân 7</option>
              <option value="11vs11">Sân 11</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-1"
            >
              <i className={`fas fa-calendar-alt text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
              <span className="hidden sm:inline">Ngày</span>
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-1"
              >
                <i className="fas fa-times text-xs"></i>
                <span className="hidden sm:inline">Xóa lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Date Range Filters */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => onFilterChange('date_from', e.target.value)}
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
                  onChange={(e) => onFilterChange('date_to', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  "{filters.search}"
                  <button
                    onClick={() => onFilterChange('search', '')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {getStatusOptions().find(opt => opt.value === filters.status)?.label}
                  <button
                    onClick={() => onFilterChange('status', '')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filters.field_type && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {filters.field_type}
                  <button
                    onClick={() => onFilterChange('field_type', '')}
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

export default TeamFilters;