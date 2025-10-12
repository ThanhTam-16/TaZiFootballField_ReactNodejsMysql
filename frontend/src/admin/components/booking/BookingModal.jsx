// ====== frontend/src/admin/components/booking/BookingModal.jsx (TAILWIND) ======
import { useState, useEffect } from 'react';

const BookingModal = ({ booking, fields, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    field_id: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    total_amount: 0,
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        customer_name: booking.customer_name || '',
        phone_number: booking.phone_number || '',
        field_id: booking.field_id || '',
        booking_date: booking.booking_date || '',
        start_time: booking.start_time || '',
        end_time: booking.end_time || '',
        total_amount: booking.total_amount || 0,
        notes: booking.notes || ''
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        booking_date: today
      }));
    }
  }, [booking]);

  useEffect(() => {
    if (formData.field_id && formData.start_time && formData.end_time) {
      calculateTotalAmount();
    }
  }, [formData.field_id, formData.start_time, formData.end_time]);

  const calculateTotalAmount = () => {
    const field = fields.find(f => f.id === parseInt(formData.field_id));
    if (!field) return;

    const startHour = parseInt(formData.start_time.split(':')[0]);
    const endHour = parseInt(formData.end_time.split(':')[0]);
    
    if (endHour > startHour) {
      const hours = endHour - startHour;
      const total = hours * field.price_per_hour;
      setFormData(prev => ({ ...prev, total_amount: total }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateTimeOptions = (start = 5, end = 23) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      const timeStr = `${i.toString().padStart(2, '0')}:00`;
      options.push(
        <option key={i} value={timeStr}>
          {timeStr}
        </option>
      );
    }
    return options;
  };

  const getEndTimeOptions = () => {
    if (!formData.start_time) return [];
    const startHour = parseInt(formData.start_time.split(':')[0]);
    return generateTimeOptions(startHour + 1, 23);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Vui lòng nhập tên khách hàng';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number.trim())) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!formData.field_id) {
      newErrors.field_id = 'Vui lòng chọn sân';
    }

    if (!formData.booking_date) {
      newErrors.booking_date = 'Vui lòng chọn ngày đá';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Vui lòng chọn giờ bắt đầu';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'Vui lòng chọn giờ kết thúc';
    }

    if (formData.start_time && formData.end_time) {
      const startHour = parseInt(formData.start_time.split(':')[0]);
      const endHour = parseInt(formData.end_time.split(':')[0]);
      
      if (endHour <= startHour) {
        newErrors.end_time = 'Giờ kết thúc phải sau giờ bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-[modalSlideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-clipboard-list text-white"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {booking ? 'Chỉnh sửa đơn đặt sân' : 'Thêm đơn đặt sân'}
              </h2>
              <p className="text-blue-100 text-sm">
                {booking ? 'Cập nhật thông tin đặt sân' : 'Tạo đơn đặt sân mới cho khách hàng'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user text-green-600 dark:text-green-400 text-sm"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thông tin khách hàng
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.customer_name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Nhập tên khách hàng"
                  />
                  {errors.customer_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.phone_number 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-futbol text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thông tin đặt sân
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sân <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.field_id}
                    onChange={(e) => handleInputChange('field_id', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.field_id 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Chọn sân</option>
                    {fields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name} ({field.type}) - {formatCurrency(field.price_per_hour)}/giờ
                      </option>
                    ))}
                  </select>
                  {errors.field_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.field_id}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ngày đá <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.booking_date}
                    onChange={(e) => handleInputChange('booking_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.booking_date 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.booking_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.booking_date}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.start_time 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Chọn giờ</option>
                    {generateTimeOptions()}
                  </select>
                  {errors.start_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    disabled={!formData.start_time}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.end_time 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Chọn giờ</option>
                    {getEndTimeOptions()}
                  </select>
                  {errors.end_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
                  )}
                </div>
              </div>

              {/* Total Amount Display */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(formData.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <i className="fas fa-sticky-note text-gray-600 dark:text-gray-400 text-sm"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thông tin bổ sung
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>{booking ? 'Cập nhật' : 'Tạo đơn'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default BookingModal;