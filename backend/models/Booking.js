// backend/models/Booking.js
const db = require('../config/db');

const Booking = {
  // =============== CORE PROMISE METHODS ===============

  // Tạo booking mới (có dọn các booking cancelled trùng slot & revive nếu cần)
  create: async (data) => {
    try {
      // Clean up old cancelled bookings first
      await Booking.cleanupCancelledBookings(
        data.field_id,
        data.booking_date,
        data.start_time,
        data.end_time
      );

      const [result] = await db.promise().query(
        `
        INSERT INTO bookings 
        (user_id, field_id, booking_date, start_time, end_time, total_amount, payment_method, payment_status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          data.user_id,
          data.field_id,
          data.booking_date,
          data.start_time,
          data.end_time,
          data.total_amount,
          data.payment_method || 'cash',
          data.payment_status || 'pending',
          data.notes || null,
        ]
      );

      return result;
    } catch (error) {
      // Nếu vẫn bị trùng key, thử revive booking đã cancelled
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(
          'Duplicate entry detected, trying to reactivate cancelled booking...'
        );

        const [existing] = await db
          .promise()
          .query(
            `
          SELECT id FROM bookings 
          WHERE field_id = ? AND booking_date = ? 
          AND start_time = ? AND end_time = ?
          AND status = 'cancelled'
          ORDER BY id DESC LIMIT 1
        `,
            [
              data.field_id,
              data.booking_date,
              data.start_time,
              data.end_time,
            ]
          );

        if (existing.length > 0) {
          await db.promise().query(
            `
            UPDATE bookings 
            SET user_id = ?, total_amount = ?, payment_method = ?, 
                payment_status = ?, notes = ?, status = 'pending', 
                created_at = NOW(), updated_at = NOW()
            WHERE id = ?
          `,
            [
              data.user_id,
              data.total_amount,
              data.payment_method || 'cash',
              data.payment_status || 'pending',
              data.notes || null,
              existing[0].id,
            ]
          );

          return { insertId: existing[0].id };
        }
      }

      throw error;
    }
  },

  createManual: async (data) => {
    const [result] = await db.promise().query(
      `
      INSERT INTO bookings (
        user_id, field_id, booking_date, start_time, end_time, 
        total_amount, status, payment_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'approved', 'pending', ?, NOW())
    `,
      [
        data.user_id,
        data.field_id,
        data.booking_date,
        data.start_time,
        data.end_time,
        data.total_amount,
        data.notes,
      ]
    );
    return result;
  },

  findById: async (bookingId) => {
    const [rows] = await db
      .promise()
      .query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    return rows[0] || null;
  },

  getByUserId: async (userId) => {
    const [results] = await db.promise().query(
      `
      SELECT 
        b.*, 
        f.name as field_name, 
        f.type as field_type 
      FROM bookings b 
      JOIN fields f ON b.field_id = f.id 
      WHERE b.user_id = ? 
      ORDER BY b.booking_date DESC
    `,
      [userId]
    );
    return results;
  },

  getByDate: async (date) => {
    const [results] = await db.promise().query(
      `
      SELECT field_id, start_time, end_time 
      FROM bookings 
      WHERE booking_date = ? AND status != 'cancelled'
    `,
      [date]
    );
    return results;
  },

  // Lấy danh sách booking kèm filter cho admin
  getAllWithFilters: async ({ limit, offset, filters }) => {
    let whereClause = '';
    const params = [];
    const conditions = [];

    if (filters.search) {
      conditions.push(
        '(u.name LIKE ? OR u.phone_number LIKE ? OR f.name LIKE ?)'
      );
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    if (filters.status) {
      conditions.push('b.status = ?');
      params.push(filters.status);
    }

    if (filters.field_id) {
      conditions.push('b.field_id = ?');
      params.push(filters.field_id);
    }

    if (filters.date_filter) {
      const today = new Date().toISOString().split('T')[0];

      switch (filters.date_filter) {
        case 'today': {
          conditions.push('b.booking_date = ?');
          params.push(today);
          break;
        }
        case 'tomorrow': {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          conditions.push('b.booking_date = ?');
          params.push(d.toISOString().split('T')[0]);
          break;
        }
        case 'week': {
          const weekEnd = new Date();
          weekEnd.setDate(weekEnd.getDate() + 7);
          conditions.push('b.booking_date BETWEEN ? AND ?');
          params.push(today, weekEnd.toISOString().split('T')[0]);
          break;
        }
        case 'month': {
          const monthEnd = new Date();
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          conditions.push('b.booking_date BETWEEN ? AND ?');
          params.push(today, monthEnd.toISOString().split('T')[0]);
          break;
        }
      }
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.promise().query(
      `
      SELECT 
        b.id, b.booking_date, b.start_time, b.end_time, 
        b.total_amount, b.status, b.payment_status, b.notes, b.created_at,
        u.name as customer_name, u.phone_number, u.email,
        f.id as field_id, f.name as field_name, f.type as field_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    const [countResult] = await db.promise().query(
      `
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
      ${whereClause}
    `,
      params
    );

    return {
      rows,
      total: countResult[0]?.total || 0,
    };
  },

  updateStatus: async (bookingId, status, notes = null) => {
    const [result] = await db.promise().query(
      `
      UPDATE bookings 
      SET status = ?, notes = ?, updated_at = NOW() 
      WHERE id = ?
    `,
      [status, notes, bookingId]
    );
    return result;
  },

  update: async (bookingId, updateData) => {
    // Lấy booking hiện tại
    const [existing] = await db
      .promise()
      .query('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    if (existing.length === 0) {
      return { affectedRows: 0 };
    }

    // Cập nhật thông tin user nếu có
    if (updateData.customer_name || updateData.phone_number) {
      await db.promise().query(
        `
        UPDATE users 
        SET name = ?, phone_number = ? 
        WHERE id = ?
      `,
        [
          updateData.customer_name || existing[0].customer_name,
          updateData.phone_number || existing[0].phone_number,
          existing[0].user_id,
        ]
      );
    }

    // Cập nhật booking
    const [result] = await db.promise().query(
      `
      UPDATE bookings 
      SET field_id = ?, booking_date = ?, start_time = ?, end_time = ?, 
          total_amount = ?, status = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `,
      [
        updateData.field_id || existing[0].field_id,
        updateData.booking_date || existing[0].booking_date,
        updateData.start_time || existing[0].start_time,
        updateData.end_time || existing[0].end_time,
        updateData.total_amount || existing[0].total_amount,
        updateData.status || existing[0].status,
        updateData.notes !== undefined ? updateData.notes : existing[0].notes,
        bookingId,
      ]
    );

    return result;
  },

  delete: async (bookingId) => {
    const [result] = await db
      .promise()
      .query(`DELETE FROM bookings WHERE id = ?`, [bookingId]);
    return result;
  },

  // =============== CONFLICT & CLEANUP ===============

  // Check trùng khung giờ
  checkTimeConflict: async (
    fieldId,
    bookingDate,
    startTime,
    endTime,
    excludeBookingId = null
  ) => {
    let sql = `
      SELECT id, status FROM bookings 
      WHERE field_id = ? AND booking_date = ? 
      AND status IN ('pending', 'approved', 'completed')
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `;

    const params = [
      fieldId,
      bookingDate,
      startTime,
      startTime,
      endTime,
      endTime,
      startTime,
      endTime,
    ];

    if (excludeBookingId) {
      sql += ' AND id != ?';
      params.push(excludeBookingId);
    }

    const [existingBookings] = await db.promise().query(sql, params);
    return existingBookings.length > 0;
  },

  // Dọn các booking cancelled cũ (để tránh bị trùng key vô nghĩa)
  cleanupCancelledBookings: async (
    fieldId,
    bookingDate,
    startTime,
    endTime
  ) => {
    try {
      await db.promise().query(
        `
        DELETE FROM bookings 
        WHERE field_id = ? AND booking_date = ? 
        AND start_time = ? AND end_time = ?
        AND status = 'cancelled'
        AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)
      `,
        [fieldId, bookingDate, startTime, endTime]
      );

      console.log('Cleaned up old cancelled bookings');
    } catch (error) {
      console.log('Cleanup warning:', error.message);
      // Không throw, chỉ log
    }
  },

  // =============== PRICING & REPORTS ===============

  // Tính tiền chi tiết theo pricing_rules (30 phút / block)
  calculatePrice: async (fieldType, startTime, endTime) => {
    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      const durationMinutes = endTotalMinutes - startTotalMinutes;

      if (durationMinutes <= 0) {
        throw new Error('Invalid time range');
      }

      let totalAmount = 0;

      // Tính tiền theo từng block 30 phút
      for (
        let currentMinutes = startTotalMinutes;
        currentMinutes < endTotalMinutes;
        currentMinutes += 30
      ) {
        const currentHour = Math.floor(currentMinutes / 60);

        const [rows] = await db.promise().query(
          `
          SELECT price_per_hour 
          FROM pricing_rules 
          WHERE field_type = ? AND start_hour <= ? AND end_hour > ? 
          ORDER BY start_hour DESC 
          LIMIT 1
        `,
          [fieldType, currentHour, currentHour]
        );

        let hourlyRate = 0;
        if (rows.length > 0) {
          hourlyRate = Number(rows[0].price_per_hour);
        } else {
          const defaultPrices = {
            '5vs5': 200000,
            '7vs7': 300000,
            '11vs11': 500000,
          };
          hourlyRate = defaultPrices[fieldType] || 200000;
        }

        const segmentMinutes = Math.min(30, endTotalMinutes - currentMinutes);
        totalAmount += (hourlyRate * segmentMinutes) / 60;
      }

      return Math.round(totalAmount);
    } catch (error) {
      console.error('Price calculation error:', error);

      const defaultPrices = {
        '5vs5': 200000,
        '7vs7': 300000,
        '11vs11': 500000,
      };

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      const durationHours =
        ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;

      return Math.round(
        (defaultPrices[fieldType] || 200000) * durationHours
      );
    }
  },

  // Lấy booking gần đây (joined với user & field)
  getRecent: async (limit = 10) => {
    const [results] = await db.promise().query(
      `
      SELECT 
        b.id, b.booking_date, b.start_time, b.end_time, 
        b.total_amount, b.status, b.payment_status, b.created_at,
        u.name as customer_name, u.phone_number,
        f.name as field_name, f.type as field_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN fields f ON b.field_id = f.id
      ORDER BY b.created_at DESC
      LIMIT ?
    `,
      [parseInt(limit, 10)]
    );

    return results;
  },

  // =============== LEGACY CALLBACK METHODS ===============

  createWithCallback: (data, callback) => {
    const sql = `
      INSERT INTO bookings 
      (user_id, field_id, booking_date, start_time, end_time, total_amount, payment_method, payment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.user_id,
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.total_amount,
      data.payment_method || 'cash',
      data.payment_status || 'pending',
      data.notes || null,
    ];
    db.query(sql, values, callback);
  },

  getByUserIdWithCallback: (user_id, callback) => {
    const sql =
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC';
    db.query(sql, [user_id], callback);
  },

  // =============== UTILITY METHODS ===============

  getBookingsByFieldAndDate: async (fieldId, date) => {
    const [results] = await db.promise().query(
      `
      SELECT * FROM bookings 
      WHERE field_id = ? AND booking_date = ? AND status != 'cancelled' 
      ORDER BY start_time
    `,
      [fieldId, date]
    );
    return results;
  },

  getBookingConflicts: async (fieldId, date, startTime, endTime, excludeId) => {
    let sql = `
      SELECT * FROM bookings 
      WHERE field_id = ? AND booking_date = ? AND status != 'cancelled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `;
    const params = [
      fieldId,
      date,
      startTime,
      startTime,
      endTime,
      endTime,
      startTime,
      endTime,
    ];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const [results] = await db.promise().query(sql, params);
    return results;
  },

  // Helper validate range (30–180 phút)
  validateTimeRange: (startTime, endTime) => {
    if (!startTime || !endTime) return false;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    return durationMinutes >= 30 && durationMinutes <= 180;
  },
};

module.exports = Booking;
