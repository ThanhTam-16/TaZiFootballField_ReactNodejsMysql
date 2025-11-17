import { useState, useEffect } from 'react';
import { createMatch } from '../services/matchService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast'

function CreateMatchModal({ onClose, onRefresh }) {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const [form, setForm] = useState({
    field_type: '5vs5',
    match_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    level: 'intermediate',
    age_min: 18,
    age_max: 30,
    price_per_person: 0,
    description: '',
    contact_name: user?.name || '',
    contact_phone: user?.phone_number || '',
    field_id: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
        showInfo('Bạn cần đăng nhập để tạo kèo!');
        onClose();
    }
  }, [user, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showInfo('Bạn cần đăng nhập để tạo kèo!');
      return;
    }

    if (!form.start_time || !form.end_time) {
      showInfo('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }

    if (form.start_time >= form.end_time) {
      showInfo('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        ...form,
        creator_id: user.id
      };
      await createMatch(data);
      onRefresh();
      onClose();
      showSuccess('Tạo kèo thành công');
    } catch (err) {
      console.error(err);
      showError('Lỗi khi tạo kèo. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = [];
  for (let h = 6; h <= 21; h++) {
    timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-plus text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Tạo kèo mới</h3>
                <p className="text-blue-100 text-sm">Tạo trận đấu cho cộng đồng</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          
          {/* Date & Time */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-calendar mr-2 text-blue-500 text-sm"></i>
              Thời gian thi đấu
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày đá
                </label>
                <input
                  type="date"
                  name="match_date"
                  value={form.match_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                />
              </div>

              <div className='grid grid-cols-2 gap-3 md:grid-cols-2 md:col-span-2'>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Giờ bắt đầu
                  </label>
                  <select
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  >
                    <option value="">Chọn giờ</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Giờ kết thúc
                  </label>
                  <select
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  >
                    <option value="">Chọn giờ</option>
                    {timeOptions
                      .filter(time => form.start_time && time > form.start_time)
                      .map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Field & Level */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-futbol mr-2 text-green-500 text-sm"></i>
              Thông tin sân
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loại sân
                </label>
                <select
                  name="field_type"
                  value={form.field_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                >
                  <option value="5vs5">Sân 5 người</option>
                  <option value="7vs7">Sân 7 người</option>
                  <option value="11vs11">Sân 11 người</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trình độ
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                >
                  <option value="beginner">Mới chơi</option>
                  <option value="intermediate">Trung bình</option>
                  <option value="advanced">Khá</option>
                  <option value="pro">Giỏi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Age & Price */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-users mr-2 text-purple-500 text-sm"></i>
              Yêu cầu tham gia
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tuổi từ
                  </label>
                  <input
                    type="number"
                    name="age_min"
                    value={form.age_min}
                    onChange={handleChange}
                    min={10}
                    max={form.age_max}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đến
                  </label>
                  <input
                    type="number"
                    name="age_max"
                    value={form.age_max}
                    onChange={handleChange}
                    min={form.age_min}
                    max={60}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giá/người (VNĐ)
                </label>
                <input
                  type="number"
                  name="price_per_person"
                  value={form.price_per_person}
                  onChange={handleChange}
                  min={0}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-address-book mr-2 text-orange-500 text-sm"></i>
              Thông tin liên hệ
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên liên hệ
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả thêm về trận đấu, yêu cầu đặc biệt..."
              rows="3"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm resize-none"
            />
          </div>

          

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 pt-2">
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
              disabled={isSubmitting || !form.start_time || !form.end_time || !form.contact_name.trim() || !form.contact_phone.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check text-xs"></i>
                  <span>Tạo kèo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;