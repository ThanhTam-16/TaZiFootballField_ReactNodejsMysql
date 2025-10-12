// backend/models/Booking.js - FINAL VERSION without formatDuration method
const db = require('../config/db');

const Booking = {
  // =============== PROMISE METHODS ===============
  create: async (data) => {
    const [result] = await db.promise().query(`
      INSERT INTO bookings 
      (user_id, field_id, booking_date, start_time, end_time, total_amount, payment_method, payment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.user_id,
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.total_amount,
      data.payment_method || 'cash',
      data.payment_status || 'pending',
      data.notes || null
    ]);
    return result;
  },

  createManual: async (data) => {
    const [result] = await db.promise().query(`
      INSERT INTO bookings (
        user_id, field_id, booking_date, start_time, end_time, 
        total_amount, status, payment_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'approved', 'pending', ?, NOW())
    `, [
      data.user_id,
      data.field_id,
      data.booking_date,
      data.start_time,
      data.end_time,
      data.total_amount,
      data.notes
    ]);
    return result;
  },

  getByUserId: async (userId) => {
    const [results] = await db.promise().query(
      `SELECT b.*, f.name as field_name, f.type as field_type 
       FROM bookings b 
       JOIN fields f ON b.field_id = f.id 
       WHERE b.user_id = ? 
       ORDER BY b.booking_date DESC`,
      [userId]
    );
    return results;
  },

  getByDate: async (date) => {
    const [results] = await db.promise().query(
      `SELECT field_id, start_time, end_time FROM bookings WHERE booking_date = ? AND status != 'cancelled'`,
      [date]
    );
    return results;
  },

  updateStatus: async (bookingId, status, notes = null) => {
    const [result] = await db.promise().query(
      `UPDATE bookings SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?`,
      [status, notes, bookingId]
    );
    return result;
  },

  update: async (bookingId, updateData) => {
    // Lấy booking hiện tại
    const [existing] = await db.promise().query(
      'SELECT * FROM bookings WHERE id = ?', 
      [bookingId]
    );

    if (existing.length === 0) {
      return { affectedRows: 0 };
    }

    // Cập nhật thông tin user nếu có
    if (updateData.customer_name || updateData.phone_number) {
      await db.promise().query(`
        UPDATE users SET name = ?, phone_number = ? WHERE id = ?
      `, [
        updateData.customer_name || existing[0].customer_name,
        updateData.phone_number || existing[0].phone_number,
        existing[0].user_id
      ]);
    }

    // Cập nhật booking
    const [result] = await db.promise().query(`
      UPDATE bookings 
      SET field_id = ?, booking_date = ?, start_time = ?, end_time = ?, 
          total_amount = ?, status = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      updateData.field_id || existing[0].field_id,
      updateData.booking_date || existing[0].booking_date,
      updateData.start_time || existing[0].start_time,
      updateData.end_time || existing[0].end_time,
      updateData.total_amount || existing[0].total_amount,
      updateData.status || existing[0].status,
      updateData.notes !== undefined ? updateData.notes : existing[0].notes,
      bookingId
    ]);

    return result;
  },

  delete: async (bookingId) => {
    const [result] = await db.promise().query(
      `DELETE FROM bookings WHERE id = ?`,
      [bookingId]
    );
    return result;
  },

  // FIXED: More comprehensive conflict checking
  checkTimeConflict: async (fieldId, bookingDate, startTime, endTime, excludeBookingId = null) => {
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
    
    let params = [fieldId, bookingDate, startTime, startTime, endTime, endTime, startTime, endTime];
    
    if (excludeBookingId) {
      sql += ' AND id != ?';
      params.push(excludeBookingId);
    }

    const [existingBookings] = await db.promise().query(sql, params);
    return existingBookings.length > 0;
  },

  // NEW: Clean up cancelled bookings before creating new ones
  cleanupCancelledBookings: async (fieldId, bookingDate, startTime, endTime) => {
    try {
      await db.promise().query(`
        DELETE FROM bookings 
        WHERE field_id = ? AND booking_date = ? 
        AND start_time = ? AND end_time = ?
        AND status = 'cancelled'
        AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)
      `, [fieldId, bookingDate, startTime, endTime]);
      
      console.log('Cleaned up old cancelled bookings');
    } catch (error) {
      console.log('Cleanup warning:', error.message);
      // Don't throw error, just log warning
    }
  },

  // UPDATED: Create with cleanup
  create: async (data) => {
    try {
      // Clean up old cancelled bookings first
      await Booking.cleanupCancelledBookings(
        data.field_id, 
        data.booking_date, 
        data.start_time, 
        data.end_time
      );
      
      const [result] = await db.promise().query(`
        INSERT INTO bookings 
        (user_id, field_id, booking_date, start_time, end_time, total_amount, payment_method, payment_status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.user_id,
        data.field_id,
        data.booking_date,
        data.start_time,
        data.end_time,
        data.total_amount,
        data.payment_method || 'cash',
        data.payment_status || 'pending',
        data.notes || null
      ]);
      return result;
    } catch (error) {
      // If still duplicate error, try updating cancelled booking instead
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('Duplicate entry detected, trying to reactivate cancelled booking...');
        
        const [existing] = await db.promise().query(`
          SELECT id FROM bookings 
          WHERE field_id = ? AND booking_date = ? 
          AND start_time = ? AND end_time = ?
          AND status = 'cancelled'
          ORDER BY id DESC LIMIT 1
        `, [data.field_id, data.booking_date, data.start_time, data.end_time]);
        
        if (existing.length > 0) {
          // Reactivate the cancelled booking
          await db.promise().query(`
            UPDATE bookings 
            SET user_id = ?, total_amount = ?, payment_method = ?, 
                payment_status = ?, notes = ?, status = 'pending', 
                created_at = NOW(), updated_at = NOW()
            WHERE id = ?
          `, [
            data.user_id,
            data.total_amount,
            data.payment_method || 'cash',
            data.payment_status || 'pending',
            data.notes || null,
            existing[0].id
          ]);
          
          return { insertId: existing[0].id };
        }
      }
      
      throw error;
    }
  },

  // FIXED: More accurate price calculation with minutes support
  calculatePrice: async (fieldType, startTime, endTime) => {
    try {
      // Parse time into minutes
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      const durationMinutes = endTotalMinutes - startTotalMinutes;
      
      if (durationMinutes <= 0) {
        throw new Error('Invalid time range');
      }
      
      let totalAmount = 0;
      
      // Calculate price for each 30-minute segment
      for (let currentMinutes = startTotalMinutes; currentMinutes < endTotalMinutes; currentMinutes += 30) {
        const currentHour = Math.floor(currentMinutes / 60);
        
        // Get pricing rule for this hour
        const [rows] = await db.promise().query(
          `SELECT price_per_hour FROM pricing_rules 
           WHERE field_type = ? AND start_hour <= ? AND end_hour > ? 
           ORDER BY start_hour DESC LIMIT 1`,
          [fieldType, currentHour, currentHour]
        );
        
        let hourlyRate = 0;
        if (rows.length > 0) {
          hourlyRate = Number(rows[0].price_per_hour);
        } else {
          // Fallback to default pricing if no rule found
          const defaultPrices = {
            '5vs5': 200000,
            '7vs7': 300000,
            '11vs11': 500000
          };
          hourlyRate = defaultPrices[fieldType] || 200000;
        }
        
        // Add half-hour rate (30 minutes = 0.5 hour)
        const segmentMinutes = Math.min(30, endTotalMinutes - currentMinutes);
        totalAmount += (hourlyRate * segmentMinutes) / 60;
      }
      
      return Math.round(totalAmount);
      
    } catch (error) {
      console.error('Price calculation error:', error);
      // Return default price based on field type
      const defaultPrices = {
        '5vs5': 200000,
        '7vs7': 300000,
        '11vs11': 500000
      };
      
      // Calculate based on duration
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      const durationHours = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
      
      return Math.round((defaultPrices[fieldType] || 200000) * durationHours);
    }
  },

  getRecent: async (limit = 10) => {
    const [results] = await db.promise().query(`
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
    `, [parseInt(limit)]);

    return results;
  },

  // =============== CALLBACK METHODS (legacy - with different names) ===============
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
    const sql = `SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC`;
    db.query(sql, [user_id], callback);
  },

  // =============== UTILITY METHODS ===============
  getBookingsByFieldAndDate: async (fieldId, date) => {
    const [results] = await db.promise().query(
      `SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND status != 'cancelled' ORDER BY start_time`,
      [fieldId, date]
    );
    return results;
  },

  getBookingConflicts: async (fieldId, date, startTime, endTime, excludeId = null) => {
    let sql = `
      SELECT * FROM bookings 
      WHERE field_id = ? AND booking_date = ? AND status != 'cancelled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `;
    let params = [fieldId, date, startTime, startTime, endTime, endTime, startTime, endTime];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const [results] = await db.promise().query(sql, params);
    return results;
  },

  // Helper method to validate time range
  validateTimeRange: (startTime, endTime) => {
    if (!startTime || !endTime) return false;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    // Minimum 30 minutes, maximum 3 hours (180 minutes)
    return durationMinutes >= 30 && durationMinutes <= 180;
  }
};

module.exports = Booking;