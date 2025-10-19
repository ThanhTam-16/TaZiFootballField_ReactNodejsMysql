// ====== frontend/src/admin/components/customer/CustomerModal.jsx (OPTIMIZED)
import { useState, useEffect } from 'react';

const CustomerModal = ({ customer, onSave, onClose, loading = false }) => {
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
        name: customer.name || '',
        phone_number: customer.phone_number || '',
        email: customer.email || '',
        is_active: customer.is_active !== undefined ? customer.is_active : 1
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
    
    // Mark all fields as touched
    const allTouched = {
      name: true,
      phone_number: true,
      email: true
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
              <i className={`fas ${customer ? 'fa-edit' : 'fa-user-plus'} text-white text-sm`}></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {customer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
              </h2>
              <p className="text-blue-100 text-xs">
                {customer ? 'Cập nhật thông tin khách hàng' : 'Tạo tài khoản khách hàng mới'}
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
            {/* Customer Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <i className="fas fa-user text-blue-600 dark:text-blue-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin khách hàng
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên khách hàng"
                    disabled={loading}
                  />
                  {getFieldError('name') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('name')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    onBlur={() => handleBlur('phone_number')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('phone_number') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số điện thoại"
                    disabled={loading}
                  />
                  {getFieldError('phone_number') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('phone_number')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập email (không bắt buộc)"
                    disabled={loading}
                  />
                  {getFieldError('email') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('email')}</span>
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
                  value={formData.is_active}
                  onChange={(e) => handleChange('is_active', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
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

            {/* Additional Info for Existing Customer */}
            {customer && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <i className="fas fa-chart-bar mr-2 text-xs"></i>
                  Thống kê khách hàng
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
                      {formatCurrency(customer.total_spent)}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Hoàn thành:</span>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {customer.completed_bookings || 0} lần
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Đã hủy:</span>
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      {customer.cancelled_bookings || 0} lần
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {customer ? `Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}` : 'Điền đầy đủ thông tin bắt buộc (*)'}
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
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{customer ? 'Cập nhật' : 'Tạo'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;