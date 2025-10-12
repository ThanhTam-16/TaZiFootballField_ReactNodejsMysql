import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function BookingModal({ field, slot, searchInfo, onClose, onConfirm }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    phone: user?.phone_number || '',
    name: user?.name || '',
    note: '',
    payment: 'cash',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.phone.trim() || !form.name.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin liên hệ');
      return;
    }

    if (form.phone.length < 10) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(form);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Tính thời gian chính xác theo phút
  const getDurationAndAmount = () => {
    if (!searchInfo?.startTime || !searchInfo?.endTime) {
      return { duration: '1h', totalAmount: slot.price };
    }
    
    const [startHour, startMinute] = searchInfo.startTime.split(':').map(Number);
    const [endHour, endMinute] = searchInfo.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    let durationText;
    if (minutes === 0) {
      durationText = `${hours}h`;
    } else {
      durationText = `${hours}h${minutes}p`;
    }
    
    // Tính tiền theo phút (slot.price là giá 1 giờ)
    const totalAmount = (slot.price * durationMinutes) / 60;
    
    return { duration: durationText, totalAmount };
  };

  const { duration, totalAmount } = getDurationAndAmount();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-check text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Xác nhận đặt sân</h3>
                <p className="text-green-100 text-sm">Vui lòng kiểm tra thông tin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          
          {/* Booking Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <i className="fas fa-info-circle mr-2 text-blue-500 text-sm"></i>
              Thông tin đặt sân
            </h4>
            
            <div className="space-y-3">
              {/* Field Info */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <i className="fas fa-futbol text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {field.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Sân {field.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {formatDate(searchInfo.date)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {searchInfo.startTime} - {searchInfo.endTime} ({duration})
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-yellow-600 dark:text-yellow-400 text-sm"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      Tổng tiền
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatPrice(slot.price)}/giờ x {duration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600 dark:text-green-400">
                    {formatPrice(totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <i className="fas fa-user mr-2 text-green-500 text-sm"></i>
                Thông tin liên hệ
              </h4>

              {/* FIXED: Proper grid layout for contact fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Thông tin thêm về đặt sân..."
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <i className="fas fa-credit-card mr-2 text-blue-500 text-sm"></i>
                Phương thức thanh toán
              </h4>

              {/* FIXED: Improved payment method layout */}
              <div className="space-y-3">
                <label className={`relative block p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  form.payment === 'cash'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.payment === 'cash'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      form.payment === 'cash'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <i className="fas fa-money-bill-wave text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        form.payment === 'cash'
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Tiền mặt
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Thanh toán tại sân
                      </div>
                    </div>
                    {form.payment === 'cash' && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`relative block p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  form.payment === 'online'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={form.payment === 'online'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      form.payment === 'online'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <i className="fas fa-credit-card text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        form.payment === 'online'
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Chuyển khoản
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Thanh toán trực tuyến
                      </div>
                    </div>
                    {form.payment === 'online' && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Payment Note */}
              {form.payment === 'online' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-info-circle text-blue-500 text-sm mt-0.5"></i>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Thông tin chuyển khoản:</p>
                      <p className="text-xs">Sau khi xác nhận, bạn sẽ nhận được thông tin chuyển khoản qua SMS.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <i className="fas fa-exclamation-triangle text-yellow-500 text-sm mt-0.5"></i>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Vui lòng có mặt đúng giờ đã đặt</li>
                    <li>• Hủy sân trước 2 giờ để được hoàn tiền</li>
                    <li>• Liên hệ hotline nếu có thay đổi</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
              >
                <i className="fas fa-times text-xs"></i>
                <span>Hủy bỏ</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !form.phone.trim() || !form.name.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                  
                    <span>Xác nhận đặt sân</span>
                    <span className="hidden sm:inline">- {formatPrice(totalAmount)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;