import { useEffect, useState } from 'react';
import API from '../services/api';

function FieldStatus() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // fetchData tách ra để gọi lại khi bấm reload
  const fetchData = async (targetDate = date) => {
    try {
      setLoading(true);
      setError(null);

      const dateStr = formatDate(targetDate);
      console.log('Fetching data for date:', dateStr);

      const [fieldsRes, bookingsRes, maintenanceRes] = await Promise.all([
        API.get('/fields'),
        API.get(`/bookings/date?date=${dateStr}`),
        API.get('/maintenance/active')
      ]);

      console.log('API Responses:', {
        fields: fieldsRes.data?.length || 0,
        bookings: bookingsRes.data?.length || 0,
        maintenances: maintenanceRes.data?.length || 0
      });

      setFields(fieldsRes.data || []);
      setBookings(bookingsRes.data || []);
      const filteredMaintenances = (maintenanceRes.data || []).filter(m =>
        m.maintenance_date === dateStr
      );
      setMaintenances(filteredMaintenances);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Lỗi khi tải dữ liệu');
      setFields([]);
      setBookings([]);
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const nextDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const prevDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const reloadData = () => fetchData(date);

  const isTimeBetween = (target, start, end) => {
    return target >= start && target < end;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-400 dark:bg-green-500';
      case 'booked': return 'bg-red-400 dark:bg-red-500';
      case 'maintenance': return 'bg-gray-400 dark:bg-gray-500';
      default: return 'bg-gray-200 dark:bg-gray-600';
    }
  };

  const renderTimeline = (fieldId) => {
    const blocks = [];
    const totalBlocks = 32; // 16 hours * 2 blocks per hour

    for (let hour = 6; hour < 22; hour++) {
      for (let minute of [0, 30]) {
        const blockTime = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}:00`;
        let status = 'available';

        const hasBooking = bookings.some(
          b => b.field_id === fieldId && isTimeBetween(blockTime, b.start_time, b.end_time)
        );
        const isMaintained = maintenances.some(
          m => (m.field_id === fieldId || !m.field_id) && isTimeBetween(blockTime, m.start_time || '00:00:00', m.end_time || '23:59:59')
        );

        if (isMaintained) status = 'maintenance';
        else if (hasBooking) status = 'booked';

        blocks.push(
          <div
            key={`${hour}:${minute}`}
            className={`h-8 cursor-pointer ${getStatusColor(status)} border-r border-white/30 dark:border-gray-700/30 hover:opacity-75 transition-opacity`}
            style={{ width: `${100 / totalBlocks}%` }}
            title={`${blockTime} - ${status === 'available' ? 'Trống' : status === 'booked' ? 'Đã đặt' : 'Bảo trì'}`}
          />
        );
      }
    }

    return <div className="flex h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">{blocks}</div>;
  };

  const timeSlots = [6, 8, 10, 12, 14, 16, 18, 20];

  // ---------- RENDER ----------
  return (
    <section className="py-8 lg:py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header luôn hiển thị */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div className="text-center md:text-left md:mb-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Tình trạng{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                sân bóng
              </span>
            </h2>
          </div>

          {/* Date Picker */}
          <div className="flex items-center justify-center md:justify-end space-x-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
            <button
              onClick={prevDate}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="text-center px-4 py-2">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {date.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
            </div>

            <button
              onClick={nextDate}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Legend luôn hiển thị */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 dark:bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Trống</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 dark:bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Đã đặt</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Bảo trì</span>
          </div>
        </div>

        {/* Timeline Header (nếu loading -> hiển thị skeleton ngắn, nếu không -> giờ thực) */}
        {loading ? (
          <div className="hidden md:flex items-center mb-4">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex-1 flex justify-between text-sm text-gray-500 dark:text-gray-400 px-4">
              {timeSlots.map((_, i) => (
                <div key={i} className="h-3 rounded w-10 bg-gray-200 dark:bg-gray-700/60 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center mb-4">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex-1 flex justify-between text-sm text-gray-500 dark:text-gray-400 px-4">
              {timeSlots.map(hour => (
                <div key={hour} className="text-center">
                  {hour}:00
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fields area */}
        {error ? (
          // nếu có lỗi: chỉ hiển thị phần lỗi (vẫn giữ header/legend)
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={reloadData}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => { setError(null); setFields([]); setLoading(false); }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          // loading skeleton cho danh sách sân / timeline
          <div className="space-y-4 animate-pulse">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center">
                  {/* left info skeleton */}
                  <div className="w-32 flex-shrink-0 mr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* timeline skeleton */}
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>

                  {/* button skeleton */}
                  <div className="ml-4 hidden md:block">
                    <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // khi đã có dữ liệu: hiển thị danh sách sân thực tế
          <>
            {fields.length > 0 ? (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Field Info */}
                      <div className="w-full md:w-32 flex-shrink-0 mb-4 md:mb-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <i className="fas fa-futbol text-white"></i>
                          </div>
                          <div className='flex items-center justify-between w-full'>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{field.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{field.type}</p>
                            </div>

                            {/* Action button (mobile only) */}
                            <div className="md:hidden">
                              <a
                                href="/booking"
                                className="ml-3 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                              >
                                <i className="fas fa-calendar-plus mr-2"></i>
                                Đặt sân
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex-1 md:px-4">
                        {renderTimeline(field.id)}
                      </div>

                      {/* Action Button (desktop only) */}
                      <div className="hidden md:block md:w-auto mt-4 md:mt-0 md:ml-4">
                        <a
                          href="/booking"
                          className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                        >
                          <i className="fas fa-calendar-plus mr-2"></i>
                          Đặt sân
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-futbol text-gray-400 dark:text-gray-500 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Chưa có sân nào</h3>
                <p className="text-gray-600 dark:text-gray-400">Hiện tại chưa có thông tin sân bóng nào trong hệ thống.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default FieldStatus;
