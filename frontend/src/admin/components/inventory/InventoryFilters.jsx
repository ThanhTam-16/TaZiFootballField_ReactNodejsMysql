// ====== frontend/src/admin/components/inventory/InventoryFilters.jsx (OPTIMIZED - FULL FEATURES) ======
import { useState, useEffect } from 'react';

const InventoryFilters = ({ filters, onFilterChange, onClearFilters, getCategoryText, onAddProduct }) => {
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

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      stock_status: 'all',
      min_stock: '',
      max_stock: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = localFilters.search || 
    localFilters.category !== 'all' || 
    localFilters.stock_status !== 'all' ||
    localFilters.min_stock ||
    localFilters.max_stock;

  const categoryOptions = [
    { value: 'all', label: 'Tất cả danh mục', icon: 'fas fa-list' },
    { value: 'soft-drink', label: 'Nước ngọt', icon: 'fas fa-wine-bottle' },
    { value: 'energy-drink', label: 'Nước tăng lực', icon: 'fas fa-bolt' },
    { value: 'water', label: 'Nước suối', icon: 'fas fa-tint' },
    { value: 'tea', label: 'Trà', icon: 'fas fa-coffee' },
    { value: 'snack', label: 'Đồ ăn nhẹ', icon: 'fas fa-cookie' },
    { value: 'equipment', label: 'Thiết bị', icon: 'fas fa-tools' }
  ];

  const stockStatusOptions = [
    { value: 'all', label: 'Tất cả trạng thái', icon: 'fas fa-list' },
    { value: 'in-stock', label: 'Còn hàng', icon: 'fas fa-check-circle' },
    { value: 'low-stock', label: 'Sắp hết', icon: 'fas fa-exclamation-triangle' },
    { value: 'out-of-stock', label: 'Hết hàng', icon: 'fas fa-times-circle' }
  ];

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
                  Đang áp dụng {Object.values(localFilters).filter(v => v && v !== 'all').length} bộ lọc
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
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
          {stockStatusOptions.slice(1).map(option => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('stock_status', option.value)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                localFilters.stock_status === option.value
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
                placeholder="Tìm theo tên, mã sản phẩm..."
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

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Danh mục
            </label>
            <div className="relative">
              <select
                value={localFilters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
              >
                {categoryOptions.map(option => (
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

          {/* Add Product Button */}
          <div className="flex items-end">
            <button
              onClick={onAddProduct}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <i className="fas fa-plus text-xs"></i>
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters - Desktop */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stock Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trạng thái tồn kho
                </label>
                <div className="relative">
                  <select
                    value={localFilters.stock_status || 'all'}
                    onChange={(e) => handleFilterChange('stock_status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
                  >
                    {stockStatusOptions.map(option => (
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

              {/* Min Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tồn kho tối thiểu
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={localFilters.min_stock || ''}
                  onChange={(e) => handleFilterChange('min_stock', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                />
              </div>

              {/* Max Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tồn kho tối đa
                </label>
                <input
                  type="number"
                  placeholder="999"
                  value={localFilters.max_stock || ''}
                  onChange={(e) => handleFilterChange('max_stock', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sắp xếp theo
                </label>
                <div className="flex space-x-2">
                  <select
                    value={localFilters.sortBy || 'name'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer"
                  >
                    <option value="name">Tên</option>
                    <option value="price">Giá</option>
                    <option value="stock">Tồn kho</option>
                    <option value="created_at">Ngày tạo</option>
                  </select>
                  <button
                    onClick={() => handleFilterChange('sortOrder', localFilters.sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <i className={`fas fa-sort-amount-${localFilters.sortOrder === 'ASC' ? 'down' : 'up'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bộ lọc đang hoạt động:</span>
              <div className="flex flex-wrap gap-2">
                {localFilters.search && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    <span>Tìm: "{localFilters.search}"</span>
                    <button onClick={() => handleFilterChange('search', '')} className="hover:text-blue-900">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {localFilters.category !== 'all' && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    <span>Danh mục: {getCategoryText(localFilters.category)}</span>
                    <button onClick={() => handleFilterChange('category', 'all')} className="hover:text-blue-900">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {localFilters.stock_status !== 'all' && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    <span>Trạng thái: {localFilters.stock_status}</span>
                    <button onClick={() => handleFilterChange('stock_status', 'all')} className="hover:text-blue-900">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {localFilters.min_stock && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    <span>Tồn tối thiểu: {localFilters.min_stock}</span>
                    <button onClick={() => handleFilterChange('min_stock', '')} className="hover:text-blue-900">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {localFilters.max_stock && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    <span>Tồn tối đa: {localFilters.max_stock}</span>
                    <button onClick={() => handleFilterChange('max_stock', '')} className="hover:text-blue-900">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryFilters;