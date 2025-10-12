import { useState, useEffect } from 'react';
import { fetchAvailableFields } from '../services/bookingService';

function BookingSearchForm({ setFields, setSearchInfo }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    fieldTypes: ['5', '7'],
  });

  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Tạo danh sách giờ từ hiện tại đến 22:30
  const generateTimeOptions = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const timeOptions = [];
    
    // Nếu là ngày hôm nay, chỉ hiển thị giờ từ hiện tại trở đi
    const startHour = form.date === today ? currentHour : 6;
    const startMinute = form.date === today ? (currentMinute > 30 ? 30 : 0) : 0;
    
    for (let h = startHour; h <= 22; h++) {
      // Với giờ hiện tại, bắt đầu từ phút phù hợp
      if (h === startHour) {
        if (startMinute === 0) {
          timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
          if (h < 22) timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
        } else if (startMinute === 30) {
          timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
        }
      } else {
        // Các giờ khác thì bình thường
        timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < 22) timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }
    
    return timeOptions;
  };

  // Tạo danh sách giờ kết thúc dựa trên giờ bắt đầu
  const generateEndTimeOptions = (startTime) => {
    if (!startTime) return [];
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endOptions = [];
    
    // Tính thời gian bắt đầu theo phút
    const startTotalMinutes = startHour * 60 + startMinute;
    
    // Tạo các option từ 30 phút sau start time đến 22:30
    for (let totalMinutes = startTotalMinutes + 30; totalMinutes <= 22 * 60 + 30; totalMinutes += 30) {
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      if (hour <= 22) {
        endOptions.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    
    return endOptions;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setForm((prev) => {
        const types = checked
          ? [...prev.fieldTypes, value]
          : prev.fieldTypes.filter((v) => v !== value);
        return { ...prev, fieldTypes: types };
      });
    } else {
      if (name === 'startTime') {
        const newEndOptions = generateEndTimeOptions(value);
        setEndTimeOptions(newEndOptions);
        
        // Reset end time nếu không hợp lệ
        const newForm = { ...form, startTime: value };
        if (form.endTime && !newEndOptions.includes(form.endTime)) {
          newForm.endTime = '';
        }
        setForm(newForm);
      } else if (name === 'date') {
        // Reset thời gian khi đổi ngày
        setForm(prev => ({ ...prev, [name]: value, startTime: '', endTime: '' }));
        setEndTimeOptions([]);
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  // Cập nhật end time options khi form.startTime thay đổi
  useEffect(() => {
    if (form.startTime) {
      setEndTimeOptions(generateEndTimeOptions(form.startTime));
    }
  }, [form.startTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startTime || !form.endTime) {
      alert('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }

    // Tính toán thời gian theo phút
    const [startHour, startMinute] = form.startTime.split(':').map(Number);
    const [endHour, endMinute] = form.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const durationHours = durationMinutes / 60;

    if (durationMinutes < 30) {
      alert('Thời gian tối thiểu là 30 phút');
      return;
    }

    if (durationHours > 3) {
      alert('Bạn chỉ được phép đặt sân tối đa 3 giờ');
      return;
    }

    if (form.fieldTypes.length === 0) {
      alert('Vui lòng chọn ít nhất một loại sân');
      return;
    }

    setIsLoading(true);
    try {
      const fields = await fetchAvailableFields(form);
      setFields(fields);
      setSearchInfo(form);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm sân trống. Vui lòng thử lại.');
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    if (!form.startTime || !form.endTime) return 0;
    
    const [startHour, startMinute] = form.startTime.split(':').map(Number);
    const [endHour, endMinute] = form.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes}p`;
    }
  };

  const fieldTypeLabels = {
    '5': '5v5',
    '7': '7v7', 
    '11': '11v11'
  };

  // Lấy min date (không được chọn ngày quá khứ)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className={`relative transition-all duration-700 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
      {/* Background với hiệu ứng */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 border-2 border-green-500 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-green-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-green-500 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="relative mb-4 md:mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-search text-white text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                Tìm sân trống
              </h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Chọn thời gian và loại sân bạn muốn đặt
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative space-y-4 md:space-y-5">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <i className="fas fa-calendar-alt mr-2 text-green-500 text-xs"></i>
              Ngày đặt sân
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={getMinDate()}
              required
              className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateForDisplay(form.date)}
            </p>
          </div>

          {/* Time Selection */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <i className="fas fa-clock mr-2 text-green-500 text-xs"></i>
                Từ giờ
              </label>
              <select
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 text-sm"
              >
                <option value="">Chọn giờ bắt đầu</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <i className="fas fa-clock mr-2 text-green-500 text-xs"></i>
                Đến giờ
              </label>
              <select
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                disabled={!form.startTime}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Chọn giờ kết thúc</option>
                {endTimeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Info */}
          {form.startTime && form.endTime && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <i className="fas fa-hourglass-half text-blue-500 text-sm"></i>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Thời gian thuê: <span className="font-semibold">{getDuration()}</span>
                </span>
              </div>
              {(() => {
                const [startHour, startMinute] = form.startTime.split(':').map(Number);
                const [endHour, endMinute] = form.endTime.split(':').map(Number);
                const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                return (durationMinutes < 30 || durationMinutes > 180) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ⚠️ Thời gian thuê phải từ 30 phút đến 3 giờ
                  </p>
                );
              })()}
            </div>
          )}

          {/* Field Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <i className="fas fa-futbol mr-2 text-green-500 text-xs"></i>
              Loại sân
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {['5', '7', '11'].map((type) => (
                <label
                  key={type}
                  className={`relative flex items-center justify-center p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    form.fieldTypes.includes(type)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={type}
                    checked={form.fieldTypes.includes(type)}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-sm md:text-base">
                      {fieldTypeLabels[type]}
                    </div>
                    <div className="text-xs opacity-75">
                      Sân {type} người
                    </div>
                  </div>
                  {form.fieldTypes.includes(type) && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !form.startTime || !form.endTime || form.fieldTypes.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                <span>Đang tìm kiếm...</span>
              </>
            ) : (
              <>
                <i className="fas fa-search text-sm"></i>
                <span>Tìm sân trống</span>
                <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
              </>
            )}
          </button>

          {/* Search Summary */}
          {form.startTime && form.endTime && form.fieldTypes.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-2">
                <i className="fas fa-clipboard-list mr-2 text-gray-500 text-xs"></i>
                Thông tin tìm kiếm:
              </h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-calendar w-3 text-center"></i>
                  <span>{formatDateForDisplay(form.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-clock w-3 text-center"></i>
                  <span>{form.startTime} - {form.endTime} ({getDuration()})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-futbol w-3 text-center"></i>
                  <span>Sân {form.fieldTypes.map(t => fieldTypeLabels[t]).join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookingSearchForm;