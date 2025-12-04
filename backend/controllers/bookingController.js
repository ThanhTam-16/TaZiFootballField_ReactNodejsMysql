// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Field = require('../models/Field');
const User = require('../models/User');

// Helper function to format duration
const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '1h';

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const durationMinutes = endTotalMinutes - startTotalMinutes;

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes}p`;
};

// =============== CUSTOMER BOOKING APIs ===============

exports.createBooking = async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.user_id ||
      !data.field_id ||
      !data.booking_date ||
      !data.start_time ||
      !data.end_time
    ) {
      return res.status(400).json({ error: 'Thiếu thông tin đặt sân' });
    }

    if (!Booking.validateTimeRange(data.start_time, data.end_time)) {
      return res.status(400).json({
        error:
          'Thời gian đặt sân không hợp lệ (tối thiểu 30 phút, tối đa 3 giờ)',
      });
    }

    const field = await Field.findById(data.field_id);
    if (!field) {
      return res.status(400).json({ error: 'Không tìm thấy sân' });
    }

    // Check trùng giờ
    const hasConflict = await Booking.checkTimeConflict(
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time
    );

    if (hasConflict) {
      return res
        .status(400)
        .json({ error: 'Khung giờ này đã có người đặt' });
    }

    // Tính giá chính xác
    const totalAmount = await Booking.calculatePrice(
      field.type,
      data.start_time,
      data.end_time
    );
    data.total_amount = totalAmount;

    const result = await Booking.create(data);

    res.status(201).json({
      message: 'Đặt sân thành công',
      bookingId: result.insertId,
      totalAmount,
      duration: formatDuration(data.start_time, data.end_time),
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Lỗi tạo booking' });
  }
};

// Hủy đặt sân bởi khách
exports.cancelUserBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status = 'cancelled', notes } = req.body;

    console.log(
      `Cancelling booking ${bookingId} with status: ${status}`
    );

    const bookingData = await Booking.findById(bookingId);

    if (!bookingData) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy đơn đặt sân' });
    }

    if (bookingData.status === 'cancelled') {
      return res
        .status(400)
        .json({ error: 'Đơn đặt sân đã được hủy trước đó' });
    }

    if (bookingData.status === 'completed') {
      return res
        .status(400)
        .json({ error: 'Không thể hủy đơn đặt sân đã hoàn thành' });
    }

    const result = await Booking.updateStatus(
      bookingId,
      status,
      notes || 'Hủy bởi khách hàng'
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Không thể cập nhật trạng thái booking',
      });
    }

    console.log(`Booking ${bookingId} cancelled successfully`);
    res.json({ message: 'Hủy đặt sân thành công' });
  } catch (error) {
    console.error('Cancel user booking error:', error);
    res.status(500).json({
      error: 'Lỗi khi hủy đặt sân',
      details: error.message,
    });
  }
};

// Endpoint tính giá cho frontend
exports.calculatePrice = async (req, res) => {
  try {
    const { field_id, start_time, end_time } = req.query;

    if (!field_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Thiếu thông tin tính giá' });
    }

    if (!Booking.validateTimeRange(start_time, end_time)) {
      return res.status(400).json({ error: 'Thời gian không hợp lệ' });
    }

    const field = await Field.findById(field_id);
    if (!field) {
      return res.status(400).json({ error: 'Không tìm thấy sân' });
    }

    const totalAmount = await Booking.calculatePrice(
      field.type,
      start_time,
      end_time
    );

    const [startHour, startMinute] = start_time.split(':').map(Number);
    const [endHour, endMinute] = end_time.split(':').map(Number);
    const durationMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);

    const duration = formatDuration(start_time, end_time);

    res.json({
      totalAmount,
      duration,
      fieldType: field.type,
      pricePerHour: Math.round(totalAmount / (durationMinutes / 60)),
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({ error: 'Lỗi tính giá' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.getByUserId(userId);

    const bookingsWithDuration = bookings.map((booking) => ({
      ...booking,
      duration: formatDuration(booking.start_time, booking.end_time),
    }));

    res.json(bookingsWithDuration);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      error: 'Không thể lấy lịch sử đặt sân',
    });
  }
};

exports.getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Thiếu ngày' });
    }

    const bookings = await Booking.getByDate(date);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings by date error:', error);
    res.status(500).json({ error: 'Lỗi truy vấn' });
  }
};

// =============== ADMIN BOOKING MANAGEMENT ===============

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const filters = {
      search: req.query.search,
      status: req.query.status,
      field_id: req.query.field_id,
      date_filter: req.query.date_filter,
    };

    const { rows, total } = await Booking.getAllWithFilters({
      limit,
      offset,
      filters,
    });

    const bookingsWithDuration = rows.map((booking) => ({
      ...booking,
      duration: formatDuration(booking.start_time, booking.end_time),
    }));

    res.json({
      bookings: bookingsWithDuration,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res
      .status(500)
      .json({ error: 'Lỗi lấy danh sách đặt sân' });
  }
};

exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    console.log('Getting recent bookings with limit:', limit);

    const results = await Booking.getRecent(limit);

    const bookingsWithDuration = results.map((booking) => ({
      ...booking,
      duration: formatDuration(booking.start_time, booking.end_time),
    }));

    console.log(
      'Recent bookings found:',
      bookingsWithDuration.length
    );
    res.json(bookingsWithDuration);
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    if (
      !['pending', 'approved', 'cancelled', 'completed'].includes(
        status
      )
    ) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const result = await Booking.updateStatus(bookingId, status, notes);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy booking' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    if (updateData.start_time && updateData.end_time) {
      if (
        !Booking.validateTimeRange(
          updateData.start_time,
          updateData.end_time
        )
      ) {
        return res
          .status(400)
          .json({ error: 'Thời gian không hợp lệ' });
      }

      const conflicts = await Booking.getBookingConflicts(
        updateData.field_id,
        updateData.booking_date,
        updateData.start_time,
        updateData.end_time,
        bookingId
      );

      if (conflicts.length > 0) {
        return res
          .status(400)
          .json({ error: 'Khung giờ này đã có người đặt' });
      }

      if (updateData.field_id) {
        const field = await Field.findById(updateData.field_id);
        if (field) {
          updateData.total_amount = await Booking.calculatePrice(
            field.type,
            updateData.start_time,
            updateData.end_time
          );
        }
      }
    }

    const result = await Booking.update(bookingId, updateData);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Không thể cập nhật booking' });
    }

    res.json({ message: 'Cập nhật booking thành công' });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật booking' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await Booking.delete(bookingId);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy booking' });
    }

    res.json({ message: 'Xóa booking thành công' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Lỗi xóa booking' });
  }
};

exports.createManualBooking = async (req, res) => {
  try {
    const {
      field_id,
      booking_date,
      start_time,
      end_time,
      customer_name,
      phone_number,
      notes,
      total_amount,
    } = req.body;

    if (
      !field_id ||
      !booking_date ||
      !start_time ||
      !end_time ||
      !customer_name ||
      !phone_number
    ) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    if (!Booking.validateTimeRange(start_time, end_time)) {
      return res
        .status(400)
        .json({ error: 'Thời gian không hợp lệ' });
    }

    const hasConflict = await Booking.checkTimeConflict(
      field_id,
      booking_date,
      start_time,
      end_time
    );
    if (hasConflict) {
      return res
        .status(400)
        .json({ error: 'Khung giờ này đã có người đặt' });
    }

    let finalAmount = total_amount;
    if (!finalAmount) {
      const field = await Field.findById(field_id);
      if (field) {
        finalAmount = await Booking.calculatePrice(
          field.type,
          start_time,
          end_time
        );
      }
    }

    const user = await User.findOrCreateByPhone(
      phone_number,
      customer_name
    );

    const result = await Booking.createManual({
      user_id: user.id,
      field_id,
      booking_date,
      start_time,
      end_time,
      total_amount: finalAmount,
      notes,
    });

    res.status(201).json({
      message: 'Tạo booking thành công',
      bookingId: result.insertId,
      totalAmount: finalAmount,
      duration: formatDuration(start_time, end_time),
    });
  } catch (error) {
    console.error('Create manual booking error:', error);
    res.status(500).json({ error: 'Lỗi tạo booking' });
  }
};
