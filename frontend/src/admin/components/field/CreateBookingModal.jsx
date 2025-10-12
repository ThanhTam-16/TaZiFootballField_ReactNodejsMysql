// ====== frontend/src/admin/components/field/CreateBookingModal.jsx (TAILWIND) ======
import { useState, useEffect } from 'react';

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

  // Calculate total amount when field or time changes
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
    // Clear error when user starts typing
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

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.customer_phone && !phoneRegex.test(formData.customer_phone.replace(/\s/g, ''))) {
      newErrors.customer_phone = 'Số điện thoại không đúng định dạng';
    }

    // Validate time range
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await onSave({
        ...formData,
        phone_number: formData.customer_phone
      });
    } catch (error) {
      console.error('Error creating booking:', error);
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
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-plus text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">Thêm đặt sân mới</h3>
                <p className="text-white/80 text-sm">Tạo đơn đặt sân cho khách hàng</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Field and Date Selection */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-futbol text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Thông tin sân và thời gian</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sân <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.field_id}
                        onChange={(e) => handleInputChange('field_id', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none cursor-pointer ${
                          errors.field_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      >
                        <option value="">Chọn sân</option>
                        {fieldsData.map(field => (
                          <option key={field.id} value={field.id}>
                            {field.name} ({field.type}) - {formatCurrency(field.price_per_hour)}/giờ
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i className="fas fa-chevron-down text-gray-400 text-sm"></i>
                      </div>
                    </div>
                    {errors.field_id && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.field_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ngày <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date"
                      value={formData.booking_date}
                      onChange={(e) => handleInputChange('booking_date', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.booking_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.booking_date && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.booking_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giờ bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.start_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.start_time && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start_time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giờ kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.end_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.end_time && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.end_time}</p>
                    )}
                  </div>
                </div>

                {/* Field Preview */}
                {selectedField && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedField.type === '5vs5' 
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : selectedField.type === '7vs7'
                              ? 'bg-blue-100 dark:bg-blue-900/20'
                              : 'bg-purple-100 dark:bg-purple-900/20'
                        }`}>
                          <i className={`fas fa-futbol ${
                            selectedField.type === '5vs5' 
                              ? 'text-green-600 dark:text-green-400'
                              : selectedField.type === '7vs7'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-purple-600 dark:text-purple-400'
                          } text-sm`}></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{selectedField.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedField.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {formatCurrency(selectedField.price_per_hour)}/giờ
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-emerald-600 dark:text-emerald-400 text-sm"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Thông tin khách hàng</h4>
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
                      placeholder="Nhập tên khách hàng"
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200 ${
                        errors.customer_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.customer_name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200 ${
                        errors.customer_phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {errors.customer_phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customer_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              {formData.total_amount > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-money-bill-wave text-amber-600 dark:text-amber-400"></i>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Tổng tiền</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.start_time && formData.end_time && (
                            `${Math.abs(
                              new Date(`2000-01-01 ${formData.end_time}:00`).getTime() - 
                              new Date(`2000-01-01 ${formData.start_time}:00`).getTime()
                            ) / (1000 * 60 * 60)} giờ x ${selectedField ? formatCurrency(selectedField.price_per_hour) : ''}`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                        {formatCurrency(formData.total_amount)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú
                </label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ghi chú thêm (tùy chọn)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-3 justify-end">
              <button 
                type="button"
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <i className="fas fa-times"></i>
                <span>Hủy</span>
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
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