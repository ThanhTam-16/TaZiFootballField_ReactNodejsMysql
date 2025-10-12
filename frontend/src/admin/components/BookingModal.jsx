// frontend/src/admin/components/BookingModal.jsx
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
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        booking_date: today
      }));
    }
  }, [booking]);

  // Calculate total amount when field, date, or time changes
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
    
    // Clear error when user starts typing
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
    } else {
      const selectedDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.booking_date = 'Ngày đặt sân không thể là ngày trong quá khứ';
      }
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
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>
            <i className="fas fa-clipboard-list"></i>
            {booking ? 'Chỉnh sửa đơn đặt sân' : 'Thêm đơn đặt sân'}
          </h2>
          <button className="admin-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* Customer Information */}
          <div className="admin-form-section">
            <h3>Thông tin khách hàng</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="customer_name">
                  Tên khách hàng <span className="admin-required">*</span>
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className={errors.customer_name ? 'admin-input-error' : ''}
                  placeholder="Nhập tên khách hàng"
                />
                {errors.customer_name && (
                  <span className="admin-error-text">{errors.customer_name}</span>
                )}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="phone_number">
                  Số điện thoại <span className="admin-required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className={errors.phone_number ? 'admin-input-error' : ''}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone_number && (
                  <span className="admin-error-text">{errors.phone_number}</span>
                )}
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="admin-form-section">
            <h3>Thông tin đặt sân</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="field_id">
                  Sân <span className="admin-required">*</span>
                </label>
                <select
                  id="field_id"
                  value={formData.field_id}
                  onChange={(e) => handleInputChange('field_id', e.target.value)}
                  className={errors.field_id ? 'admin-input-error' : ''}
                >
                  <option value="">Chọn sân</option>
                  {fields.map(field => (
                    <option key={field.id} value={field.id}>
                      {field.name} ({field.type}) - {formatCurrency(field.price_per_hour)}/giờ
                    </option>
                  ))}
                </select>
                {errors.field_id && (
                  <span className="admin-error-text">{errors.field_id}</span>
                )}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="booking_date">
                  Ngày đá <span className="admin-required">*</span>
                </label>
                <input
                  type="date"
                  id="booking_date"
                  value={formData.booking_date}
                  onChange={(e) => handleInputChange('booking_date', e.target.value)}
                  className={errors.booking_date ? 'admin-input-error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.booking_date && (
                  <span className="admin-error-text">{errors.booking_date}</span>
                )}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="start_time">
                  Giờ bắt đầu <span className="admin-required">*</span>
                </label>
                <select
                  id="start_time"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className={errors.start_time ? 'admin-input-error' : ''}
                >
                  <option value="">Chọn giờ</option>
                  {generateTimeOptions()}
                </select>
                {errors.start_time && (
                  <span className="admin-error-text">{errors.start_time}</span>
                )}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="end_time">
                  Giờ kết thúc <span className="admin-required">*</span>
                </label>
                <select
                  id="end_time"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className={errors.end_time ? 'admin-input-error' : ''}
                  disabled={!formData.start_time}
                >
                  <option value="">Chọn giờ</option>
                  {getEndTimeOptions()}
                </select>
                {errors.end_time && (
                  <span className="admin-error-text">{errors.end_time}</span>
                )}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="total_amount">Tổng tiền</label>
                <div className="admin-amount-display">
                  {formatCurrency(formData.total_amount)}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="admin-form-section">
            <h3>Thông tin bổ sung</h3>
            <div className="admin-form-group">
              <label htmlFor="notes">Ghi chú</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Ghi chú thêm (tùy chọn)"
                rows="3"
              />
            </div>
          </div>
        </form>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {booking ? 'Cập nhật' : 'Tạo đơn'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;