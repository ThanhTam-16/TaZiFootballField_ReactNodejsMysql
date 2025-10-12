// ====== frontend/src/admin/components/maintenance/MaintenanceModal.jsx ======
import { useState, useEffect } from 'react';
import { InlineSpinner } from '../common/LoadingSpinner';

const MaintenanceModal = ({ 
  maintenance, 
  fields, 
  onSave, 
  onClose, 
  loading, 
  getFieldText, 
  getStatusText, 
  getTypeText 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    field_id: '',
    type: 'routine',
    status: 'scheduled',
    scheduled_date: '',
    start_time: '',
    end_time: '',
    estimated_duration: '',
    priority: 'medium',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (maintenance) {
      setFormData({
        title: maintenance.title || '',
        description: maintenance.description || '',
        field_id: maintenance.field_id || '',
        type: maintenance.type || 'routine',
        status: maintenance.status || 'scheduled',
        scheduled_date: maintenance.scheduled_date ? maintenance.scheduled_date.split('T')[0] : '',
        start_time: maintenance.start_time || '',
        end_time: maintenance.end_time || '',
        estimated_duration: maintenance.estimated_duration || '',
        priority: maintenance.priority || 'medium',
        notes: maintenance.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        field_id: '',
        type: 'routine',
        status: 'scheduled',
        scheduled_date: '',
        start_time: '',
        end_time: '',
        estimated_duration: '',
        priority: 'medium',
        notes: ''
      });
    }
    setErrors({});
    setTouched({});
  }, [maintenance]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Tiêu đề là bắt buộc';
        } else if (value.trim().length < 3) {
          newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else {
          delete newErrors.title;
        }
        break;

      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Mô tả là bắt buộc';
        } else {
          delete newErrors.description;
        }
        break;

      case 'field_id':
        if (!value) {
          newErrors.field_id = 'Vui lòng chọn sân';
        } else {
          delete newErrors.field_id;
        }
        break;

      case 'scheduled_date':
        if (!value) {
          newErrors.scheduled_date = 'Ngày thực hiện là bắt buộc';
        } else {
          delete newErrors.scheduled_date;
        }
        break;

      case 'start_time':
        if (value && formData.end_time && value >= formData.end_time) {
          newErrors.start_time = 'Giờ bắt đầu phải trước giờ kết thúc';
        } else {
          delete newErrors.start_time;
          delete newErrors.end_time;
        }
        break;

      case 'end_time':
        if (value && formData.start_time && value <= formData.start_time) {
          newErrors.end_time = 'Giờ kết thúc phải sau giờ bắt đầu';
        } else {
          delete newErrors.end_time;
          delete newErrors.start_time;
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
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const isValid = Object.keys(formData).every(field =>
      validateField(field, formData[field])
    );

    if (isValid) {
      onSave(formData);
    }
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field];
  };

  const typeOptions = [
    { value: 'routine', label: 'Bảo trì định kỳ' },
    { value: 'repair', label: 'Sửa chữa' },
    { value: 'upgrade', label: 'Nâng cấp' },
    { value: 'holiday', label: 'Nghỉ lễ' },
    { value: 'emergency', label: 'Khẩn cấp' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'in_progress', label: 'Đang thực hiện' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Thấp' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Cao' },
    { value: 'urgent', label: 'Khẩn cấp' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-modal-enter">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i className={`fas ${maintenance ? 'fa-edit' : 'fa-plus'} text-blue-600 dark:text-blue-400 text-sm`}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {maintenance ? 'Chỉnh sửa lịch bảo trì' : 'Tạo lịch bảo trì mới'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {maintenance ? 'Cập nhật thông tin bảo trì' : 'Lên lịch bảo trì cho sân bóng'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title and Description */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      getFieldError('title')
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Nhập tiêu đề bảo trì"
                    disabled={loading}
                  />
                  {getFieldError('title') && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <i className="fas fa-exclamation-circle text-red-500 text-sm"></i>
                    </div>
                  )}
                </div>
                {getFieldError('title') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                    {getFieldError('title')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                    rows="3"
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none ${
                      getFieldError('description')
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Mô tả chi tiết công việc bảo trì"
                    disabled={loading}
                  />
                </div>
                {getFieldError('description') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                    {getFieldError('description')}
                  </p>
                )}
              </div>
            </div>

            {/* Field and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sân <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.field_id}
                    onChange={(e) => handleChange('field_id', e.target.value)}
                    onBlur={() => handleBlur('field_id')}
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none cursor-pointer ${
                      getFieldError('field_id')
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Chọn sân</option>
                    <option value="all">Tất cả sân</option>
                    {fields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
                {getFieldError('field_id') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                    {getFieldError('field_id')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loại bảo trì
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none cursor-pointer"
                    disabled={loading}
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ngày thực hiện <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => handleChange('scheduled_date', e.target.value)}
                    onBlur={() => handleBlur('scheduled_date')}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      getFieldError('scheduled_date')
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                </div>
                {getFieldError('scheduled_date') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                    {getFieldError('scheduled_date')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giờ bắt đầu
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleChange('start_time', e.target.value)}
                    onBlur={() => handleBlur('start_time')}
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      getFieldError('start_time')
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                </div>
                {getFieldError('start_time') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                    {getFieldError('start_time')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giờ kết thúc
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleChange('end_time', e.target.value)}
                    onBlur={() => handleBlur('end_time')}
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      getFieldError('end_time')
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                </div>
                {getFieldError('end_time') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <i className="fas fa-exclamation-triangle text-xs mr-1"></i>
                    {getFieldError('end_time')}
                  </p>
                )}
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trạng thái
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none cursor-pointer"
                    disabled={loading}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Độ ưu tiên
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none cursor-pointer"
                    disabled={loading}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows="2"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="Ghi chú thêm về công việc bảo trì..."
                disabled={loading}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-500 dark:hover:bg-blue-600 flex items-center justify-center min-w-[80px]"
            >
              {loading ? <InlineSpinner /> : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;