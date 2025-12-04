// backend/models/Admin.js
const db = require('../config/db');

const Admin = {
  // =============== OPTIMIZED DASHBOARD STATS METHOD ===============
  getDashboardStats: async () => {
    try {
      console.log('Getting dashboard stats - optimized version...');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Use a single optimized query instead of multiple queries
      const [results] = await db.promise().query(`
        SELECT 
          (SELECT COALESCE(SUM(total_amount), 0) 
           FROM bookings 
           WHERE DATE(booking_date) = ? AND status IN ('approved', 'completed')) as today_revenue,
          
          (SELECT COUNT(*) 
           FROM bookings 
           WHERE DATE(booking_date) = ?) as today_bookings,
          
          (SELECT COUNT(*) 
           FROM bookings 
           WHERE status = 'pending') as pending_bookings,
          
          (SELECT COUNT(*) 
           FROM fields 
           WHERE is_active = 1) as total_fields,
          
          (SELECT COUNT(*) 
           FROM users 
           WHERE role = 'customer') as total_users
      `, [today, today]);
      
      const stats = {
        today_revenue: parseFloat(results[0].today_revenue) || 0,
        today_bookings: parseInt(results[0].today_bookings) || 0,
        pending_bookings: parseInt(results[0].pending_bookings) || 0,
        total_fields: parseInt(results[0].total_fields) || 0,
        total_users: parseInt(results[0].total_users) || 0
      };
      
      console.log('Dashboard stats retrieved successfully:', stats);
      return stats;
      
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      
      // Return default values instead of throwing error
      console.log('Returning default stats due to error');
      return {
        today_revenue: 0,
        today_bookings: 0,
        pending_bookings: 0,
        total_fields: 0,
        total_users: 0
      };
    }
  },

  // =============== MAIN ASYNC METHODS ===============
  findByEmailAsync: async (email) => {
    try {
      console.log('Looking for admin with email:', email);
      
      const [results] = await db.promise().query(
        `SELECT * FROM admins WHERE email = ? AND is_active = 1`,
        [email]
      );
      
      console.log('Query results:', results);
      
      if (results.length === 0) {
        console.log('No admin found with email:', email);
        return null;
      }
      
      return results[0];
    } catch (error) {
      console.error('Error in Admin.findByEmailAsync:', error);
      throw error;
    }
  },

  // =============== LEGACY CALLBACK METHODS - FIXED ===============
  findByEmail: (email, callback) => {
    console.log('Using callback version of findByEmail for:', email);
    
    const sql = `SELECT * FROM admins WHERE email = ? AND is_active = 1`;
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Database error in findByEmail:', err);
        return callback(err);
      }
      
      console.log('Callback findByEmail results:', results);
      
      // Return results as array (this is what the controller expects)
      callback(null, results);
    });
  },

  saveSession: (adminId, sessionToken, expiresAt, callback) => {
    console.log('Saving session for admin:', adminId);
    
    const sql = `INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES (?, ?, ?)`;
    db.query(sql, [adminId, sessionToken, expiresAt], (err, result) => {
      if (err) {
        console.error('Error saving session:', err);
        return callback(err);
      }
      
      console.log('Session saved successfully');
      callback(null, result);
    });
  },

  findSession: (sessionToken, callback) => {
    console.log('Finding session for token:', sessionToken);
    
    const sql = `
      SELECT s.*, a.id as admin_id, a.email, a.name, a.role, a.permissions
      FROM admin_sessions s
      JOIN admins a ON s.admin_id = a.id
      WHERE s.session_token = ? AND s.expires_at > NOW() AND s.is_active = 1 AND a.is_active = 1
    `;
    
    db.query(sql, [sessionToken], (err, results) => {
      if (err) {
        console.error('Error finding session:', err);
        return callback(err);
      }
      
      console.log('Session query results:', results);
      callback(null, results);
    });
  },

  removeSession: (sessionToken, callback) => {
    console.log('Removing session:', sessionToken);
    
    const sql = `UPDATE admin_sessions SET is_active = 0 WHERE session_token = ?`;
    db.query(sql, [sessionToken], (err, result) => {
      if (err) {
        console.error('Error removing session:', err);
        return callback(err);
      }
      
      console.log('Session removed successfully');
      callback(null, result);
    });
  },

  updateLastLogin: (id, callback) => {
    console.log('Updating last login for admin:', id);
    
    const sql = `UPDATE admins SET last_login = NOW() WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error updating last login:', err);
        return callback(err);
      }
      
      console.log('Last login updated successfully');
      callback(null, result);
    });
  },

  // =============== OTHER METHODS ===============
  findById: async (id) => {
    try {
      const [results] = await db.promise().query(
        `SELECT * FROM admins WHERE id = ? AND is_active = 1`,
        [id]
      );
      return results[0] || null;
    } catch (error) {
      console.error('Error in Admin.findById:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const sql = `
        INSERT INTO admins (email, password, name, role, permissions) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        data.email,
        data.password,
        data.name,
        data.role || 'admin',
        JSON.stringify(data.permissions || ['bookings', 'fields', 'users'])
      ];
      
      const [result] = await db.promise().query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error('Error in Admin.create:', error);
      throw error;
    }
  },

  updatePassword: async (id, newPassword) => {
    try {
      await db.promise().query(
        `UPDATE admins SET password = ?, updated_at = NOW() WHERE id = ?`,
        [newPassword, id]
      );
    } catch (error) {
      console.error('Error in Admin.updatePassword:', error);
      throw error;
    }
  },

  findAll: (callback) => {
    const sql = `
      SELECT id, email, name, role, permissions, is_active, last_login, created_at 
      FROM admins 
      ORDER BY created_at DESC
    `;
    db.query(sql, callback);
  },

  updateInfo: (id, data, callback) => {
    const sql = `
      UPDATE admins 
      SET name = ?, role = ?, permissions = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    const values = [
      data.name,
      data.role,
      JSON.stringify(data.permissions),
      id
    ];
    db.query(sql, values, callback);
  },

  softDelete: (id, callback) => {
    const sql = `UPDATE admins SET is_active = 0 WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Admin;