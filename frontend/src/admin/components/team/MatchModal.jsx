// ====== frontend/src/admin/components/team/MatchModal.jsx ======
import { useState, useEffect } from 'react';

const MatchModal = ({ match, onSave, onClose, loading = false }) => {
  const [formData, setFormData] = useState({
    field_type: '5vs5',
    match_date: '',
    start_time: '',
    end_time: '',
    max_players: 10,
    price_per_person: 0,
    location: '',
    description: '',
    contact_name: '',
    contact_phone: '',
    status: 'open'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (match) {
      setFormData({
        field_type: match.field_type || '5vs5',
        match_date: match.match_date || '',
        start_time: match.start_time || '',
        end_time: match.end_time || '',
        max_players: match.max_players || 10,
        price_per_person: match.price_per_person || 0,
        location: match.location || '',
        description: match.description || '',
        contact_name: match.contact_name || '',
        contact_phone: match.contact_phone || '',
        status: match.status || 'open'
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        match_date: today
      }));
    }
    setErrors({});
    setTouched({});
  }, [match]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'match_date':
        if (!value) {
          newErrors.match_date = 'Ngày thi đấu là bắt buộc';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.match_date = 'Ngày thi đấu không được là ngày trong quá khứ';
          } else {
            delete newErrors.match_date;
          }
        }
        break;

      case 'start_time':
        if (!value) {
          newErrors.start_time = 'Giờ bắt đầu là bắt buộc';
        } else {
          delete newErrors.start_time;
        }
        break;

      case 'max_players':
        if (!value || value < 1) {
          newErrors.max_players = 'Số người tối đa phải lớn hơn 0';
        } else {
          delete newErrors.max_players;
        }
        break;

      case 'contact_name':
        if (!value.trim()) {
          newErrors.contact_name = 'Tên liên hệ là bắt buộc';
        } else {
          delete newErrors.contact_name;
        }
        break;

      case 'contact_phone':
        if (!value.trim()) {
          newErrors.contact_phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          newErrors.contact_phone = 'Số điện thoại không hợp lệ';
        } else {
          delete newErrors.contact_phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {
      match_date: true,
      start_time: true,
      max_players: true,
      contact_name: true,
      contact_phone: true
    };
    setTouched(allTouched);

    // Validate all fields
    const isValid = Object.keys(allTouched).every(field =>
      validateField(field, formData[field])
    );

    if (isValid) {
      onSave(formData);
    }
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field];
  };

  const fieldTypeOptions = [
    { value: '5vs5', label: 'Sân 5' },
    { value: '7vs7', label: 'Sân 7' },
    { value: '11vs11', label: 'Sân 11' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
              <i className={`fas ${match ? 'fa-edit' : 'fa-plus'} text-white text-sm`}></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {match ? 'Chỉnh sửa kèo' : 'Thêm kèo mới'}
              </h2>
              <p className="text-blue-100 text-xs">
                {match ? 'Cập nhật thông tin kèo' : 'Tạo kèo đá bóng mới'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors duration-200 text-white"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Match Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <i className="fas fa-futbol text-blue-600 dark:text-blue-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin kèo
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Loại sân
                  </label>
                  <select
                    value={formData.field_type}
                    onChange={(e) => handleChange('field_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  >
                    {fieldTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ngày thi đấu *
                  </label>
                  <input
                    type="date"
                    value={formData.match_date}
                    onChange={(e) => handleChange('match_date', e.target.value)}
                    onBlur={() => handleBlur('match_date')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('match_date') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {getFieldError('match_date') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('match_date')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giờ bắt đầu *
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleChange('start_time', e.target.value)}
                    onBlur={() => handleBlur('start_time')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('start_time') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {getFieldError('start_time') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('start_time')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số người tối đa *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.max_players}
                    onChange={(e) => handleChange('max_players', parseInt(e.target.value))}
                    onBlur={() => handleBlur('max_players')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('max_players') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {getFieldError('max_players') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('max_players')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giá/người (VND)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price_per_person}
                    onChange={(e) => handleChange('price_per_person', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập địa điểm thi đấu"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập mô tả chi tiết về kèo đấu..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                  <i className="fas fa-phone text-green-600 dark:text-green-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin liên hệ
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên liên hệ *
                  </label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => handleChange('contact_name', e.target.value)}
                    onBlur={() => handleBlur('contact_name')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('contact_name') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên người liên hệ"
                    disabled={loading}
                  />
                  {getFieldError('contact_name') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('contact_name')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    onBlur={() => handleBlur('contact_phone')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('contact_phone') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số điện thoại"
                    disabled={loading}
                  />
                  {getFieldError('contact_phone') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('contact_phone')}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trạng thái
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value="open">Đang mở</option>
                  <option value="full">Đầy</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="closed">Đóng</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {match ? `Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}` : 'Điền đầy đủ thông tin bắt buộc (*)'}
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{match ? 'Cập nhật' : 'Tạo'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;