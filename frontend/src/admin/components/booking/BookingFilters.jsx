// ====== frontend/src/admin/components/booking/BookingFilters.jsx (TAILWIND) ======
import { useState, useEffect } from 'react';

const BookingFilters = ({ filters, fields = [], onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      field: 'all',
      date: 'all'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.search || 
    localFilters.status !== 'all' || 
    localFilters.field !== 'all' || 
    localFilters.date !== 'all';

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái', icon: 'fas fa-list' },
    { value: 'pending', label: 'Chờ duyệt', icon: 'fas fa-clock' },
    { value: 'approved', label: 'Đã duyệt', icon: 'fas fa-check' },
    { value: 'cancelled', label: 'Đã hủy', icon: 'fas fa-times' },
    { value: 'completed', label: 'Hoàn thành', icon: 'fas fa-flag-checkered' }
  ];

  const dateOptions = [
    { value: 'all', label: 'Tất cả thời gian', icon: 'fas fa-calendar' },
    { value: 'today', label: 'Hôm nay', icon: 'fas fa-calendar-day' },
    { value: 'tomorrow', label: 'Ngày mai', icon: 'fas fa-calendar-plus' },
    { value: 'week', label: 'Tuần này', icon: 'fas fa-calendar-week' },
    { value: 'month', label: 'Tháng này', icon: 'fas fa-calendar-alt' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-filter text-blue-600 dark:text-blue-400 text-sm"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Bộ lọc</h3>
            {hasActiveFilters && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Đang áp dụng {Object.values(localFilters).filter(v => v && v !== 'all').length} bộ lọc
              </p>
            )}
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            <i className="fas fa-times text-xs"></i>
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              placeholder="Tên, SĐT, sân..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
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
              value={localFilters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
            >
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
        </div>

        {/* Field Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sân
          </label>
          <div className="relative">
            <select
              value={localFilters.field || 'all'}
              onChange={(e) => handleFilterChange('field', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
            >
              <option value="all">Tất cả sân</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.name} ({field.type})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thời gian
          </label>
          <div className="relative">
            <select
              value={localFilters.date || 'all'}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Buttons (Mobile) */}
      <div className="sm:hidden mt-4 flex flex-wrap gap-2">
        {statusOptions.slice(1).map(option => (
          <button
            key={option.value}
            onClick={() => handleFilterChange('status', option.value)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
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
  );
};

export default BookingFilters;