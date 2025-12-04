// backend/models/Field.js
const db = require('../config/db');

const Field = {
  // =============== MAIN METHODS ===============

  getAllAsync: async () => {
    try {
      const [fields] = await db
        .promise()
        .query('SELECT * FROM fields WHERE is_active = 1 ORDER BY name');
      return fields;
    } catch (error) {
      console.error('Error in Field.getAllAsync:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db
        .promise()
        .query('SELECT * FROM fields WHERE id = ? AND is_active = 1', [id]);
      return results[0] || null;
    } catch (error) {
      console.error('Error in Field.findById:', error);
      throw error;
    }
  },

  create: async (fieldData) => {
    try {
      const facilitiesJson = Array.isArray(fieldData.facilities)
        ? JSON.stringify(fieldData.facilities)
        : fieldData.facilities || '[]';

      const isActive =
        fieldData.is_active === undefined ? 1 : fieldData.is_active;

      const [result] = await db.promise().query(
        `
        INSERT INTO fields 
          (name, type, price_per_hour, description, facilities, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
        [
          fieldData.name,
          fieldData.type,
          fieldData.price_per_hour,
          fieldData.description || '',
          facilitiesJson,
          isActive,
        ]
      );
      return result;
    } catch (error) {
      console.error('Error in Field.create:', error);
      throw error;
    }
  },

  update: async (fieldId, updateData) => {
    try {
      const facilitiesJson = Array.isArray(updateData.facilities)
        ? JSON.stringify(updateData.facilities)
        : updateData.facilities || '[]';

      const isActive =
        updateData.is_active === undefined ? 1 : updateData.is_active;

      const [result] = await db.promise().query(
        `
        UPDATE fields 
        SET name = ?, type = ?, price_per_hour = ?, description = ?, 
            facilities = ?, is_active = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [
          updateData.name,
          updateData.type,
          updateData.price_per_hour,
          updateData.description || '',
          facilitiesJson,
          isActive,
          fieldId,
        ]
      );
      return result;
    } catch (error) {
      console.error('Error in Field.update:', error);
      throw error;
    }
  },

  softDelete: async (fieldId) => {
    try {
      const [result] = await db
        .promise()
        .query(
          `UPDATE fields SET is_active = 0, updated_at = NOW() WHERE id = ?`,
          [fieldId]
        );
      return result;
    } catch (error) {
      console.error('Error in Field.softDelete:', error);
      throw error;
    }
  },

  getAvailableAsync: async (date, start, end, types) => {
    try {
      console.log('Field.getAvailableAsync called with:', {
        date,
        start,
        end,
        types,
      });

      if (!date || !start || !end || !types) {
        throw new Error('Missing required parameters');
      }

      let typeArray = Array.isArray(types) ? types : types.split(',');
      typeArray = typeArray.map((t) => t.trim());

      console.log('Parsed typeArray:', typeArray);

      const placeholders = typeArray.map(() => '?').join(',');

      const [fields] = await db.promise().query(
        `SELECT * FROM fields WHERE type IN (${placeholders}) AND is_active = 1`,
        typeArray
      );

      console.log(`Found ${fields.length} fields of specified types`);

      const result = [];
      for (const field of fields) {
        const [bookings] = await db.promise().query(
          `
          SELECT start_time, end_time 
          FROM bookings 
          WHERE field_id = ? AND booking_date = ? AND status != 'cancelled'
        `,
          [field.id, date]
        );

        console.log(
          `Field ${field.name} has ${bookings.length} existing bookings`
        );

        const isBooked = bookings.some(
          (b) => !(b.end_time <= start || b.start_time >= end)
        );

        if (!isBooked) {
          const total = await Field.calculateSlotPrice(
            field.type,
            start,
            end
          );

          result.push({
            ...field,
            available_slots: [
              {
                start_time: start,
                end_time: end,
                label: `${start} - ${end}`,
                price: total,
              },
            ],
          });
        }
      }

      console.log(`Returning ${result.length} available fields`);
      return result;
    } catch (error) {
      console.error('Error in Field.getAvailableAsync:', error);
      throw error;
    }
  },

  calculateSlotPrice: async (fieldType, start, end) => {
    try {
      let total = 0;
      let current = start;

      while (current < end) {
        const hour = parseInt(current.split(':')[0], 10);
        const [rows] = await db.promise().query(
          `
          SELECT price_per_hour 
          FROM pricing_rules 
          WHERE field_type = ? AND start_hour <= ? AND end_hour > ? 
          LIMIT 1
        `,
          [fieldType, hour, hour]
        );

        const pricePerHour =
          rows.length > 0 ? Number(rows[0].price_per_hour) : 100000;

        const [h, m] = current.split(':').map(Number);
        let nextTime;
        if (m === 0) {
          nextTime = `${h.toString().padStart(2, '0')}:30`;
          total += pricePerHour * 0.5;
        } else {
          nextTime = `${(h + 1).toString().padStart(2, '0')}:00`;
          total += pricePerHour * 0.5;
        }

        current = nextTime;
        if (current >= end) break;
      }

      return total;
    } catch (error) {
      console.error('Error in Field.calculateSlotPrice:', error);
      throw error;
    }
  },

  // Fields + stats cho admin
  getAllWithStats: async () => {
    try {
      const [results] = await db.promise().query(`
        SELECT 
          f.*,
          COUNT(b.id) as total_bookings,
          SUM(CASE WHEN b.booking_date = CURDATE() THEN 1 ELSE 0 END) as today_bookings,
          SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as total_revenue
        FROM fields f
        LEFT JOIN bookings b ON f.id = b.field_id AND b.status != 'cancelled'
        WHERE f.is_active = 1
        GROUP BY f.id
        ORDER BY f.name
      `);
      return results;
    } catch (error) {
      console.error('Error in Field.getAllWithStats:', error);
      throw error;
    }
  },

  // Dùng cho timeline: danh sách sân + booking theo ngày
  getWithBookingsByDate: async (date) => {
    try {
      const [results] = await db.promise().query(
        `
        SELECT 
          f.id, f.name, f.type, f.price_per_hour,
          b.id as booking_id, b.start_time, b.end_time, 
          b.status, u.name as customer_name, u.phone_number
        FROM fields f
        LEFT JOIN bookings b 
          ON f.id = b.field_id 
         AND b.booking_date = ? 
         AND b.status != 'cancelled'
        LEFT JOIN users u ON b.user_id = u.id
        WHERE f.is_active = 1
        ORDER BY f.name, b.start_time
      `,
        [date]
      );
      return results;
    } catch (error) {
      console.error('Error in Field.getWithBookingsByDate:', error);
      throw error;
    }
  },

  // Slot trống cho 1 sân cụ thể
  getAvailableTimeSlots: async (fieldId, date) => {
    try {
      const field = await Field.findById(fieldId);
      if (!field) return [];

      const [bookings] = await db.promise().query(
        `
        SELECT start_time, end_time 
        FROM bookings 
        WHERE field_id = ? AND booking_date = ? AND status != 'cancelled'
      `,
        [fieldId, date]
      );

      const openHour = 6;
      const closeHour = 22;
      const availableSlots = [];

      for (let hour = openHour; hour < closeHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const start = `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}:00`;
          const end =
            minute === 0
              ? `${hour.toString().padStart(2, '0')}:30:00`
              : `${(hour + 1).toString().padStart(2, '0')}:00:00`;

          const isBooked = bookings.some(
            (b) => !(b.end_time <= start || b.start_time >= end)
          );

          if (!isBooked) {
            const [rows] = await db.promise().query(
              `
              SELECT price_per_hour 
              FROM pricing_rules 
              WHERE field_type = ? AND start_hour <= ? AND end_hour > ? 
              LIMIT 1
            `,
              [field.type, hour, hour]
            );
            const price =
              rows.length > 0
                ? Number(rows[0].price_per_hour) * 0.5
                : 50000;

            availableSlots.push({
              start_time: start,
              end_time: end,
              label: `${hour}:${minute
                .toString()
                .padStart(2, '0')} - ${end.substring(0, 5)}`,
              price,
            });
          }
        }
      }

      return availableSlots;
    } catch (error) {
      console.error('Error in Field.getAvailableTimeSlots:', error);
      throw error;
    }
  },

  // =============== LEGACY CALLBACK METHODS ===============

  getAll: (callback) => {
    if (callback) {
      Field.getAllAsync()
        .then((results) => callback(null, results))
        .catch((error) => callback(error));
      return;
    }
    return Field.getAllAsync();
  },

  getAvailable: (date, start, end, types, callback) => {
    if (callback) {
      Field.getAvailableAsync(date, start, end, types)
        .then((results) => callback(null, results))
        .catch((error) => callback(error));
      return;
    }
    return Field.getAvailableAsync(date, start, end, types);
  },
};

module.exports = Field;
