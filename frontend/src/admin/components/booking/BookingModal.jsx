// ====== frontend/src/admin/components/booking/BookingModal.jsx (OPTIMIZED) ======
import { useState, useEffect } from 'react';

const BookingModal = ({ booking, fields, onSave, onClose, onStatusUpdate }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    field_id: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    total_amount: 0,
    notes: '',
    status: 'pending'
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
        notes: booking.notes || '',
        status: booking.status || 'pending'
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

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { class: 'bg-amber-100 text-amber-800', text: 'Chờ duyệt' },
      approved: { class: 'bg-emerald-100 text-emerald-800', text: 'Đã duyệt' },
      cancelled: { class: 'bg-red-100 text-red-800', text: 'Đã hủy' },
      completed: { class: 'bg-blue-100 text-blue-800', text: 'Hoàn thành' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleQuickStatusUpdate = async (newStatus) => {
    if (!booking) return;
    
    try {
      await onStatusUpdate(booking.id, newStatus);
      setFormData(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
              <i className="fas fa-clipboard-list text-white text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {booking ? 'Chỉnh sửa đơn đặt sân' : 'Thêm đơn đặt sân'}
              </h2>
              <p className="text-blue-100 text-xs">
                {booking ? 'Cập nhật thông tin đặt sân' : 'Tạo đơn đặt sân mới cho khách hàng'}
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
            {/* Status Quick Actions */}
            {booking && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái:</span>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusConfig(formData.status).class}`}>
                    {getStatusConfig(formData.status).text}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate('approved')}
                      className="flex-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <i className="fas fa-check text-xs"></i>
                      <span>Duyệt</span>
                    </button>
                  )}
                  {formData.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate('cancelled')}
                      className="flex-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <i className="fas fa-times text-xs"></i>
                      <span>Hủy</span>
                    </button>
                  )}
                  {formData.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate('completed')}
                      className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <i className="fas fa-flag-checkered text-xs"></i>
                      <span>Hoàn thành</span>
                    </button>
                  )}
                </div>
              </div>
            )}

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.customer_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên khách hàng"
                  />
                  {errors.customer_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                  <i className="fas fa-calendar text-green-600 dark:text-green-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin đặt sân
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chọn sân *
                  </label>
                  <select
                    value={formData.field_id}
                    onChange={(e) => handleInputChange('field_id', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.field_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn sân...</option>
                    {fields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name} ({field.type}) - {formatCurrency(field.price_per_hour)}/giờ
                      </option>
                    ))}
                  </select>
                  {errors.field_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.field_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ngày đá *
                  </label>
                  <input
                    type="date"
                    value={formData.booking_date}
                    onChange={(e) => handleInputChange('booking_date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.booking_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.booking_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.booking_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giờ bắt đầu *
                  </label>
                  <select
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.start_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn giờ bắt đầu...</option>
                    {generateTimeOptions()}
                  </select>
                  {errors.start_time && (
                    <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giờ kết thúc *
                  </label>
                  <select
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.end_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn giờ kết thúc...</option>
                    {getEndTimeOptions()}
                  </select>
                  {errors.end_time && (
                    <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Amount & Notes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                  <i className="fas fa-money-bill text-purple-600 dark:text-purple-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin thanh toán
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tổng tiền
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(formData.total_amount)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {booking ? `Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}` : 'Điền đầy đủ thông tin bắt buộc (*)'}
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
                  <span>{booking ? 'Cập nhật' : 'Tạo đơn'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;