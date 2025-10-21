// ====== frontend/src/admin/components/team/TeamFilters.jsx (OPTIMIZED) ======
import { useState, useEffect } from 'react';

const TeamFilters = ({ filters, activeTab, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(key, value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      field_type: '',
      date_from: '',
      date_to: ''
    };
    setLocalFilters(clearedFilters);
    Object.keys(clearedFilters).forEach(key => {
      onFilterChange(key, clearedFilters[key]);
    });
  };

  const hasActiveFilters = localFilters.search || localFilters.status || localFilters.field_type || localFilters.date_from || localFilters.date_to;

  const getStatusOptions = () => {
    if (activeTab === 'matches') {
      return [
        { value: '', label: 'Tất cả trạng thái', icon: 'fas fa-list' },
        { value: 'open', label: 'Đang mở', icon: 'fas fa-play-circle' },
        { value: 'full', label: 'Đầy', icon: 'fas fa-users' },
        { value: 'completed', label: 'Hoàn thành', icon: 'fas fa-flag-checkered' },
        { value: 'closed', label: 'Đóng', icon: 'fas fa-times-circle' }
      ];
    } else {
      return [
        { value: '', label: 'Tất cả trạng thái', icon: 'fas fa-list' },
        { value: 'open', label: 'Đang mở', icon: 'fas fa-play-circle' },
        { value: 'closed', label: 'Đóng', icon: 'fas fa-times-circle' }
      ];
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header - Always Visible */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-filter text-blue-600 dark:text-blue-400 text-sm"></i>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bộ lọc</h3>
              {hasActiveFilters && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Đang áp dụng {Object.values(localFilters).filter(v => v).length} bộ lọc
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-times text-xs"></i>
                <span>Xóa lọc</span>
              </button>
            )}
            
            {/* Advanced Filters Toggle - Desktop */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <i className={`fas fa-sliders-h text-xs ${showAdvanced ? 'text-blue-600' : ''}`}></i>
              <span>Bộ lọc nâng cao</span>
            </button>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
            >
              <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'} text-xs`}></i>
              <span>{showFilters ? 'Ẩn' : 'Hiện'} bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Quick Status Filters - Always visible on mobile */}
        <div className="sm:hidden mt-3 flex flex-wrap gap-2">
          {getStatusOptions().slice(1).map(option => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('status', option.value)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                localFilters.status === option.value
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <i className={option.icon}></i>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Grid - Hidden on mobile by default */}
      <div className={`p-3 ${showFilters ? 'block' : 'hidden sm:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder={`Tìm kiếm ${activeTab === 'matches' ? 'kèo' : 'ghép đội'}...`}
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
              />
              {localFilters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
              >
                {getStatusOptions().map(option => (
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

          {/* Field Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại sân
            </label>
            <div className="relative">
              <select
                value={localFilters.field_type || ''}
                onChange={(e) => handleFilterChange('field_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
              >
                <option value="">Tất cả sân</option>
                <option value="5vs5">Sân 5</option>
                <option value="7vs7">Sân 7</option>
                <option value="11vs11">Sân 11</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Desktop */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Date Range - From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                />
              </div>

              {/* Date Range - To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters Toggle - Mobile */}
        <div className="sm:hidden mt-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <i className={`fas fa-sliders-h text-xs ${showAdvanced ? 'text-blue-600' : ''}`}></i>
            <span>{showAdvanced ? 'Ẩn' : 'Hiện'} bộ lọc nâng cao</span>
          </button>
        </div>

        {/* Advanced Filters - Mobile */}
        {showAdvanced && (
          <div className="sm:hidden mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Clear Filters Button - Mobile */}
        {hasActiveFilters && (
          <div className="sm:hidden mt-3">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
              <span>Xóa tất cả bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 text-sm">
            <i className="fas fa-info-circle text-blue-500"></i>
            <span className="text-blue-700 dark:text-blue-300">
              Đang áp dụng bộ lọc:
            </span>
            <div className="flex flex-wrap gap-1">
              {localFilters.search && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Tìm kiếm: "{localFilters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {localFilters.status && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {getStatusOptions().find(opt => opt.value === localFilters.status)?.label}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {localFilters.field_type && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {localFilters.field_type}
                  <button
                    onClick={() => handleFilterChange('field_type', '')}
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