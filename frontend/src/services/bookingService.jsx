// services/bookingService.jsx - Fixed Customer Service
import API from './api';

// Lấy danh sách sân trống theo điều kiện tìm kiếm
export const fetchAvailableFields = async ({ date, startTime, endTime, fieldTypes }) => {
  // Map sang đúng format backend
  const typeMap = { '5': '5vs5', '7': '7vs7', '11': '11vs11' };
  const mappedTypes = fieldTypes.map(t => typeMap[t] || t);

  const res = await API.get('/fields/available', {
    params: {
      date,
      start: startTime,
      end: endTime,
      types: mappedTypes.join(','),
    },
  });
  return res.data;
};

// Gửi yêu cầu đặt sân
export const createBooking = async (bookingData) => {
  const res = await API.post('/bookings', bookingData);
  return res.data;
};

// Lấy booking theo user
export const getUserBookings = async (userId) => {
  const res = await API.get(`/bookings/user/${userId}`);
  return res.data;
};

// Lấy booking theo ngày
export const getBookingsByDate = async (date) => {
  const res = await API.get('/bookings/date', { params: { date } });
  return res.data;
};