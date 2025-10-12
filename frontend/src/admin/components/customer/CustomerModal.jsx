// ====== frontend/src/admin/components/customer/CustomerModal.jsx ======
import { useState, useEffect } from 'react';
import { InlineSpinner } from '../common/LoadingSpinner';

const CustomerModal = ({ customer, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    is_active: 1
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone_number: customer.phone_number,
        email: customer.email || '',
        is_active: customer.is_active
      });
    } else {
      setFormData({
        name: '',
        phone_number: '',
        email: '',
        is_active: 1
      });
    }
    setErrors({});
    setTouched({});
  }, [customer]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Tên khách hàng là bắt buộc';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Tên phải có ít nhất 2 ký tự';
        } else {
          delete newErrors.name;
        }
        break;

      case 'phone_number':
        if (!value.trim()) {
          newErrors.phone_number = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone_number = 'Số điện thoại không hợp lệ';
        } else {
          delete newErrors.phone_number;
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Email không hợp lệ';
        } else {
          delete newErrors.email;
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
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const isValid = Object.keys(formData).every(field =>
      validateField(field, formData[field])
    );

    if (isValid) {
      onSave(formData);
    }
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-modal-enter">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i className={`fas ${customer ? 'fa-edit' : 'fa-user-plus'} text-blue-600 dark:text-blue-400 text-sm`}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {customer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {customer ? 'Cập nhật thông tin khách hàng' : 'Tạo tài khoản khách hàng mới'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    getFieldError('name')
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập tên khách hàng"
                  disabled={loading}
                />
                {getFieldError('name') && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-exclamation-circle text-red-500 text-sm"></i>
                  </div>
                )}
              </div>
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                  {getFieldError('name')}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  onBlur={() => handleBlur('phone_number')}
                  className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    getFieldError('phone_number')
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập số điện thoại"
                  disabled={loading}
                />
                {getFieldError('phone_number') && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-exclamation-circle text-red-500 text-sm"></i>
                  </div>
                )}
              </div>
              {getFieldError('phone_number') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                  {getFieldError('phone_number')}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    getFieldError('email')
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập email (không bắt buộc)"
                  disabled={loading}
                />
                {getFieldError('email') && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-exclamation-circle text-red-500 text-sm"></i>
                  </div>
                )}
              </div>
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trạng thái
              </label>
              <div className="relative">
                <select
                  value={formData.is_active}
                  onChange={(e) => handleChange('is_active', parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Khách hàng không hoạt động sẽ không thể đặt sân mới
              </p>
            </div>

            {/* Additional Info */}
            {customer && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  Thông tin bổ sung
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Tổng đặt sân:</span>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {customer.total_bookings || 0} lần
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Tổng chi tiêu:</span>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(customer.total_spent || 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center"
            >
              {loading && <InlineSpinner />} Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
