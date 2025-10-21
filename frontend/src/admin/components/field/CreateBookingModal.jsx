// ====== frontend/src/admin/components/field/CreateBookingModal.jsx (COMPACT) ======
import { useState, useEffect } from 'react';
import API from '../../../services/api';
import { bookingService } from '../../services'; // if relative differs adjust path

const CreateBookingModal = ({ slot, fieldsData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    field_id: '',
    customer_name: '',
    customer_phone: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    total_amount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (slot) {
      const startTime = `${slot.hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(slot.hour + 1).toString().padStart(2, '0')}:00`;
      const dateStr = slot.date.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        field_id: slot.fieldId,
        booking_date: dateStr,
        start_time: startTime,
        end_time: endTime
      }));
    }
  }, [slot]);

  useEffect(() => {
    if (formData.field_id && formData.start_time && formData.end_time) {
      calculateTotalAmount();
    }
  }, [formData.field_id, formData.start_time, formData.end_time]);

  const calculateTotalAmount = () => {
    const field = fieldsData.find(f => f.id === parseInt(formData.field_id));
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
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.field_id) newErrors.field_id = 'Vui lòng chọn sân';
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Vui lòng nhập tên khách hàng';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Vui lòng nhập số điện thoại';
    if (!formData.booking_date) newErrors.booking_date = 'Vui lòng chọn ngày';
    if (!formData.start_time) newErrors.start_time = 'Vui lòng chọn giờ bắt đầu';
    if (!formData.end_time) newErrors.end_time = 'Vui lòng chọn giờ kết thúc';

    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.customer_phone && !phoneRegex.test(formData.customer_phone.replace(/\s/g, ''))) {
      newErrors.customer_phone = 'Số điện thoại không đúng định dạng';
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
      // chuẩn hóa phone
      const phone = formData.customer_phone.replace(/\s/g, '');
      let userId = null;

      // 1) Thử tìm user theo phone (API backend có thể là /users/find-by-phone hoặc /users/lookup)
      try {
        const lookup = await API.get('/users/find-by-phone', { params: { phone } });
        if (lookup?.data?.user?.id) {
          userId = lookup.data.user.id;
        }
      } catch (err) {
        // nếu endpoint không tồn tại, bỏ qua và sẽ tạo user
        console.debug('User lookup failed (ok to ignore):', err?.response?.data || err.message);
      }

      // 2) Nếu chưa có user, tạo user mới (nếu backend không cho tạo user từ admin, bỏ qua bước này)
      if (!userId) {
        try {
          const created = await API.post('/users', { name: formData.customer_name.trim(), phone_number: phone });
          userId = created?.data?.id || created?.data?.user?.id;
        } catch (err) {
          // nếu backend không cho tạo user từ đây, bạn có thể truyền phone_number thay vì user_id
          console.debug('User create failed (will fallback to phone):', err?.response?.data || err.message);
        }
      }

      // build payload giống trang quản lý đơn (admin)
      const payload = {
        user_id: userId || undefined, // nếu có userId gửi, không có thì backend có thể chấp nhận phone_number
        field_id: Number(formData.field_id),
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        total_amount: Number(formData.total_amount) || 0,
        notes: formData.notes || ''
      };

      // nếu không có userId, vẫn gửi phone_number (nếu backend xử lý)
      if (!userId) {
        payload.phone_number = phone;
        payload.customer_name = formData.customer_name.trim();
      }

      // Gọi đúng API admin (như trang Quản lý đơn)
      await bookingService.createManualBooking(payload);

      // gọi onSave để parent xử lý (nếu parent cần)
      if (onSave) onSave(payload);

      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      // hiển thị lỗi server nếu có
      const message = error.response?.data?.error || error.message || 'Có lỗi tạo đặt sân';
      // nếu dùng hook/toast ở parent, gọi ở parent; ở đây log ra console
      alert(message);
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

  const selectedField = fieldsData.find(f => f.id === parseInt(formData.field_id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fas fa-calendar-plus text-white"></i>
              <div>
                <h3 className="font-semibold">Thêm đặt sân mới</h3>
                <p className="text-white/80 text-xs">Tạo đơn đặt sân cho khách hàng</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-times text-white text-xs"></i>
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Field and Time Selection */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sân *
                    </label>
                    <select 
                      value={formData.field_id}
                      onChange={(e) => handleInputChange('field_id', e.target.value)}
                      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm appearance-none cursor-pointer ${
                        errors.field_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    >
                      <option value="">Chọn sân</option>
                      {fieldsData.map(field => (
                        <option key={field.id} value={field.id}>
                          {field.name} ({field.type})
                        </option>
                      ))}
                    </select>
                    {errors.field_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.field_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ngày *
                    </label>
                    <input 
                      type="date"
                      value={formData.booking_date}
                      onChange={(e) => handleInputChange('booking_date', e.target.value)}
                      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm ${
                        errors.booking_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.booking_date && (
                      <p className="text-red-500 text-xs mt-1">{errors.booking_date}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Giờ bắt đầu *
                    </label>
                    <input 
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm ${
                        errors.start_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.start_time && (
                      <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Giờ kết thúc *
                    </label>
                    <input 
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm ${
                        errors.end_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.end_time && (
                      <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên khách hàng *
                    </label>
                    <input 
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      placeholder="Nhập tên khách hàng"
                      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm ${
                        errors.customer_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Số điện thoại *
                    </label>
                    <input 
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className={`w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm ${
                        errors.customer_phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              {formData.total_amount > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-amber-800 dark:text-amber-400 text-sm">Tổng tiền:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {formatCurrency(formData.total_amount)}
                    </span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ghi chú
                </label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ghi chú thêm (tùy chọn)"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm resize-none"
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex gap-2 justify-end">
              <button 
                type="button"
                onClick={onClose}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors duration-200"
              >
                <i className="fas fa-times text-xs"></i>
                <span>Hủy</span>
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner animate-spin text-xs"></i>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save text-xs"></i>
                    <span>Lưu đặt sân</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;