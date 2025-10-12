// backend/models/User.js - FIXED with booking stats
const db = require('../config/db');

const User = {
  // =============== BASIC CRUD WITH STATS ===============
  findById: async (id) => {
    try {
      // Get user basic info with booking statistics
      const [results] = await db.promise().query(`
        SELECT 
          u.id, 
          u.phone_number, 
          u.name, 
          u.email, 
          u.role, 
          u.is_active, 
          u.created_at,
          COALESCE(stats.total_bookings, 0) as total_bookings,
          COALESCE(stats.completed_bookings, 0) as completed_bookings, 
          COALESCE(stats.cancelled_bookings, 0) as cancelled_bookings,
          COALESCE(stats.total_spent, 0) as total_spent,
          stats.last_booking_date
        FROM users u
        LEFT JOIN (
          SELECT 
            user_id,
            COUNT(*) as total_bookings,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
            SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
            SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent,
            MAX(booking_date) as last_booking_date
          FROM bookings 
          WHERE user_id = ?
          GROUP BY user_id
        ) stats ON u.id = stats.user_id
        WHERE u.id = ?
      `, [id, id]);
      
      const user = results[0] || null;
      if (user) {
        console.log('User stats loaded:', {
          id: user.id,
          total_bookings: user.total_bookings,
          completed_bookings: user.completed_bookings,
          cancelled_bookings: user.cancelled_bookings,
          total_spent: user.total_spent
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  },

  findByEmail: async (email) => {
    const [results] = await db.promise().query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return results[0] || null;
  },

  findByPhone: async (phone) => {
    const [results] = await db.promise().query(
      `SELECT * FROM users WHERE phone_number = ?`,
      [phone]
    );
    return results[0] || null;
  },

  create: async (userData) => {
    const { name, phone_number, email, role = 'customer' } = userData;
    const [result] = await db.promise().query(
      `INSERT INTO users (name, phone_number, email, role, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [name, phone_number, email, role]
    );
    return result.insertId;
  },

  update: async (id, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(id);
    const [result] = await db.promise().query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    return result;
  },

  softDelete: async (id) => {
    const [result] = await db.promise().query(
      `UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?`,
      [id]
    );
    return result;
  },

  // =============== AUTH RELATED ===============
  findOrCreate: async (email, phone) => {
    // Tìm user hiện có
    let user = null;
    if (email) {
      user = await User.findByEmail(email);
    }
    if (!user && phone) {
      user = await User.findByPhone(phone);
    }

    // Nếu đã có user, return
    if (user) {
      return user;
    }

    // Tạo user mới
    const userId = await User.create({
      name: 'Người dùng mới',
      phone_number: phone,
      email: email,
      role: 'customer'
    });

    return await User.findById(userId);
  },

  findOrCreateByPhone: async (phone, name = 'Người dùng mới') => {
    let user = await User.findByPhone(phone);
    
    if (user) {
      // Cập nhật tên nếu khác
      if (name && name !== user.name) {
        await User.update(user.id, { name });
        user.name = name;
      }
      return user;
    }

    // Tạo user mới
    const userId = await User.create({
      name,
      phone_number: phone,
      role: 'customer'
    });

    return await User.findById(userId);
  },

  updateInfo: async (id, data) => {
    return await User.update(id, data);
  },

  // =============== CUSTOMER MANAGEMENT ===============
  getCustomerDetail: async (customerId) => {
    const [results] = await db.promise().query(`
      SELECT 
        u.*,
        COALESCE(booking_stats.completed_bookings, 0) as completed_bookings,
        COALESCE(booking_stats.total_spent, 0) as total_spent,
        booking_stats.last_booking_date
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
          SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent,
          MAX(CASE WHEN status = 'completed' THEN booking_date ELSE NULL END) as last_booking_date
        FROM bookings 
        WHERE user_id = ?
        GROUP BY user_id
      ) booking_stats ON u.id = booking_stats.user_id
      WHERE u.id = ?
    `, [customerId, customerId]);

    return results[0] || null;
  },

  bulkUpdate: async (customerIds, action) => {
    if (!customerIds || customerIds.length === 0) {
      return { affectedRows: 0 };
    }

    let query = '';
    let newStatus = null;

    switch (action) {
      case 'activate':
        newStatus = 1;
        query = 'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id IN (?)';
        break;
      case 'deactivate':
      case 'delete':
        newStatus = 0;
        query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
        break;
      default:
        throw new Error('Hành động không hợp lệ');
    }

    const [result] = await db.promise().query(query, [customerIds]);
    return result;
  },
};

// Capture the async methods BEFORE overwriting with legacy versions
const asyncFindById = User.findById;
const asyncUpdateInfo = User.updateInfo;
const asyncSoftDelete = User.softDelete;

// =============== LEGACY CALLBACK METHODS (để tương thích với code cũ) ===============
User.findById = (id, callback) => {
  if (callback) {
    // Legacy callback version - FIXED to include stats
    const sql = `
      SELECT 
        u.id, 
        u.phone_number, 
        u.name, 
        u.email, 
        u.role, 
        u.is_active,
        COALESCE(stats.total_bookings, 0) as total_bookings,
        COALESCE(stats.completed_bookings, 0) as completed_bookings, 
        COALESCE(stats.cancelled_bookings, 0) as cancelled_bookings,
        COALESCE(stats.total_spent, 0) as total_spent
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as total_bookings,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
          SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent
        FROM bookings 
        WHERE user_id = ?
        GROUP BY user_id
      ) stats ON u.id = stats.user_id
      WHERE u.id = ?
    `;
    db.query(sql, [id, id], callback);
    return;
  }
  
  // Promise version (call the captured async version to avoid recursion)
  return asyncFindById(id);
};

User.updateInfo = (id, data, callback) => {
  if (callback) {
    const sql = `UPDATE users SET name = ?, email = ?, phone_number = ?, updated_at = NOW() WHERE id = ?`;
    const values = [data.name, data.email, data.phone_number, id];
    db.query(sql, values, callback);
    return;
  }
  
  // Promise version (call the captured async version to avoid recursion)
  return asyncUpdateInfo(id, data);
};

User.findAll = (callback) => {
  const sql = `SELECT id, phone_number, name, role, total_bookings FROM users WHERE is_active = 1`;
  db.query(sql, callback);
};

User.softDelete = (id, callback) => {
  if (callback) {
    const sql = `UPDATE users SET is_active = 0 WHERE id = ?`;
    db.query(sql, [id], callback);
    return;
  }
  
  // Promise version (call the captured async version to avoid recursion)
  return asyncSoftDelete(id);
};

User.createIfNotExist = (phone, callback) => {
  const check = `SELECT * FROM users WHERE phone_number = ?`;
  db.query(check, [phone], (err, result) => {
    if (err) return callback(err);
    if (result.length > 0) return callback(null, result[0]);

    const insert = `INSERT INTO users (phone_number, name) VALUES (?, 'Người dùng mới')`;
    db.query(insert, [phone], (err2, result2) => {
      if (err2) return callback(err2);
      db.query(check, [phone], (err3, result3) => {
        if (err3) return callback(err3);
        callback(null, result3[0]);
      });
    });
  });
};

module.exports = User;