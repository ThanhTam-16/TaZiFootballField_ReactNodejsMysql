import { useState } from 'react';
import { createTeamJoinPost } from '../services/teamJoinService';
import { useAuth } from '../context/AuthContext';

function JoinTeamModal({ onClose, onRefresh }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    match_date: new Date().toISOString().split('T')[0],
    start_time: '',
    field_type: '5vs5',
    level: 'intermediate',
    players_needed: 1,
    position_needed: 'any',
    description: '',
    contact_name: user?.name || '',
    contact_phone: user?.phone_number || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.contact_name.trim() || !form.contact_phone.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin liên hệ');
      return;
    }

    if (form.contact_phone.length < 10) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    if (!form.start_time) {
      alert('Vui lòng chọn giờ đá');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTeamJoinPost(form);
      onClose();
      onRefresh();
      alert('Đăng tin ghép đội thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi đăng tin. Vui lòng thử lại.');
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
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-user-plus text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Đăng tin ghép đội</h3>
                <p className="text-purple-100 text-sm">Tìm đồng đội cho trận đấu</p>
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
              <i className="fas fa-calendar mr-2 text-purple-500 text-sm"></i>
              Thời gian thi đấu
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày đá *
                </label>
                <input
                  type="date"
                  name="match_date"
                  value={form.match_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giờ đá *
                </label>
                <select
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                >
                  <option value="">Chọn giờ</option>
                  {timeOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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
                  Loại sân *
                </label>
                <select
                  name="field_type"
                  value={form.field_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                >
                  <option value="5vs5">Sân 5 người</option>
                  <option value="7vs7">Sân 7 người</option>
                  <option value="11vs11">Sân 11 người</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trình độ *
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                >
                  <option value="beginner">Mới chơi</option>
                  <option value="intermediate">Trung bình</option>
                  <option value="advanced">Khá</option>
                  <option value="pro">Giỏi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Position & Players */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-users mr-2 text-blue-500 text-sm"></i>
              Yêu cầu tuyển
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vị trí cần *
                </label>
                <select
                  name="position_needed"
                  value={form.position_needed}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                >
                  <option value="goalkeeper">Thủ môn</option>
                  <option value="defender">Hậu vệ</option>
                  <option value="midfielder">Tiền vệ</option>
                  <option value="forward">Tiền đạo</option>
                  <option value="any">Vị trí nào cũng được</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số lượng cần *
                </label>
                <input
                  type="number"
                  name="players_needed"
                  value={form.players_needed}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                />
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-info-circle text-blue-500 text-sm"></i>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Sân {form.field_type.replace('vs', 'v')}
                  </span>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-running text-green-500 text-sm"></i>
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    {form.position_needed === 'any' ? 'Bất kỳ' : 
                     form.position_needed === 'goalkeeper' ? 'Thủ môn' :
                     form.position_needed === 'defender' ? 'Hậu vệ' :
                     form.position_needed === 'midfielder' ? 'Tiền vệ' : 'Tiền đạo'}
                  </span>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-user-plus text-purple-500 text-sm"></i>
                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                    {form.players_needed} người
                  </span>
                </div>
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
                  Tên liên hệ *
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  placeholder="Nhập tên liên hệ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
                  placeholder="Nhập số điện thoại"
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
              placeholder="Mô tả thêm về đội bóng, yêu cầu đặc biệt..."
              rows="3"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm resize-none"
            />
          </div>

          {/* Guidelines */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <i className="fas fa-lightbulb text-yellow-500 text-sm mt-0.5"></i>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Lưu ý khi đăng tin:</p>
                <ul className="text-xs space-y-1">
                  <li>• Cung cấp thông tin liên hệ chính xác</li>
                  <li>• Mô tả rõ ràng vị trí và trình độ cần tuyển</li>
                  <li>• Thông báo khi đã đủ người</li>
                </ul>
              </div>
            </div>
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
              disabled={isSubmitting || !form.contact_name.trim() || !form.contact_phone.trim() || !form.start_time}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang đăng tin...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check text-xs"></i>
                  <span>Đăng tin </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinTeamModal;