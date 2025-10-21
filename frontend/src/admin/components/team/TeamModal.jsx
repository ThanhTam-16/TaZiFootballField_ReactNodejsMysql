// ====== frontend/src/admin/components/team/TeamModal.jsx ======
import { useState, useEffect } from 'react';

const TeamModal = ({ post, onSave, onClose, loading = false, type = 'team-join' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position_needed: 'any',
    players_needed: 1,
    level: 'intermediate',
    contact_name: '',
    contact_phone: '',
    status: 'open'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        description: post.description || '',
        position_needed: post.position_needed || 'any',
        players_needed: post.players_needed || 1,
        level: post.level || 'intermediate',
        contact_name: post.contact_name || '',
        contact_phone: post.contact_phone || '',
        status: post.status || 'open'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        position_needed: 'any',
        players_needed: 1,
        level: 'intermediate',
        contact_name: '',
        contact_phone: '',
        status: 'open'
      });
    }
    setErrors({});
    setTouched({});
  }, [post]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Tiêu đề là bắt buộc';
        } else if (value.trim().length < 5) {
          newErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
        } else {
          delete newErrors.title;
        }
        break;

      case 'contact_name':
        if (!value.trim()) {
          newErrors.contact_name = 'Tên liên hệ là bắt buộc';
        } else {
          delete newErrors.contact_name;
        }
        break;

      case 'contact_phone':
        if (!value.trim()) {
          newErrors.contact_phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          newErrors.contact_phone = 'Số điện thoại không hợp lệ';
        } else {
          delete newErrors.contact_phone;
        }
        break;

      case 'players_needed':
        if (!value || value < 1) {
          newErrors.players_needed = 'Số người cần phải lớn hơn 0';
        } else {
          delete newErrors.players_needed;
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
      title: true,
      contact_name: true,
      contact_phone: true,
      players_needed: true
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

  const positionOptions = [
    { value: 'any', label: 'Bất kỳ' },
    { value: 'goalkeeper', label: 'Thủ môn' },
    { value: 'defender', label: 'Hậu vệ' },
    { value: 'midfielder', label: 'Tiền vệ' },
    { value: 'forward', label: 'Tiền đạo' }
  ];

  const levelOptions = [
    { value: 'beginner', label: 'Mới chơi' },
    { value: 'intermediate', label: 'Trung bình' },
    { value: 'advanced', label: 'Nâng cao' },
    { value: 'professional', label: 'Chuyên nghiệp' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
              <i className={`fas ${post ? 'fa-edit' : 'fa-plus'} text-white text-sm`}></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {post ? 'Chỉnh sửa bài đăng' : 'Thêm bài đăng mới'}
              </h2>
              <p className="text-purple-100 text-xs">
                {post ? 'Cập nhật thông tin bài đăng' : 'Tạo bài đăng ghép đội mới'}
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
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                  <i className="fas fa-info-circle text-purple-600 dark:text-purple-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin cơ bản
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('title') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tiêu đề bài đăng"
                    disabled={loading}
                  />
                  {getFieldError('title') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('title')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Nhập mô tả chi tiết..."
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Team Requirements */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <i className="fas fa-users text-blue-600 dark:text-blue-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Yêu cầu đội
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vị trí cần
                  </label>
                  <select
                    value={formData.position_needed}
                    onChange={(e) => handleChange('position_needed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  >
                    {positionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số người cần *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.players_needed}
                    onChange={(e) => handleChange('players_needed', parseInt(e.target.value))}
                    onBlur={() => handleBlur('players_needed')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('players_needed') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {getFieldError('players_needed') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('players_needed')}</span>
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trình độ
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  >
                    {levelOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                  <i className="fas fa-phone text-green-600 dark:text-green-400 text-xs"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thông tin liên hệ
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên liên hệ *
                  </label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => handleChange('contact_name', e.target.value)}
                    onBlur={() => handleBlur('contact_name')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('contact_name') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên người liên hệ"
                    disabled={loading}
                  />
                  {getFieldError('contact_name') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('contact_name')}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    onBlur={() => handleBlur('contact_phone')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      getFieldError('contact_phone') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số điện thoại"
                    disabled={loading}
                  />
                  {getFieldError('contact_phone') && (
                    <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      <span>{getFieldError('contact_phone')}</span>
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
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value="open">Đang mở</option>
                  <option value="closed">Đóng</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {post ? `Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}` : 'Điền đầy đủ thông tin bắt buộc (*)'}
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
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{post ? 'Cập nhật' : 'Tạo'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;