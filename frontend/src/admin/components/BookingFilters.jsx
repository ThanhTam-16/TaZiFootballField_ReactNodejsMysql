// frontend/src/admin/components/BookingFilters.jsx
import { useState, useEffect } from 'react';

const BookingFilters = ({ filters, fields, onFilterChange }) => {
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

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'completed', label: 'Hoàn thành' }
  ];

  const dateOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'tomorrow', label: 'Ngày mai' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' }
  ];

  return (
    <div className="admin-filters-section">
      <div className="admin-filters-row">
        {/* Search */}
        <div className="admin-filter-group">
          <div className="admin-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SĐT, sân..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="admin-filter-group">
          <select
            className="admin-filter-select"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Field Filter */}
        <div className="admin-filter-group">
          <select
            className="admin-filter-select"
            value={localFilters.field}
            onChange={(e) => handleFilterChange('field', e.target.value)}
          >
            <option value="all">Tất cả sân</option>
            {fields.map(field => (
              <option key={field.id} value={field.id}>
                {field.name} ({field.type})
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="admin-filter-group">
          <select
            className="admin-filter-select"
            value={localFilters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="admin-filter-group">
          <button
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={handleClearFilters}
          >
            <i className="fas fa-times"></i>
            <span className="admin-desktop-only">Xóa lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;