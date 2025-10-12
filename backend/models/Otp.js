// backend/models/Otp.js - Model hoàn chỉnh
const db = require('../config/db');

const Otp = {
  // =============== PROMISE METHODS (mới) ===============
  create: async (identifier, otpCode, expiresAt) => {
    // Xác định loại identifier (email hoặc phone)
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      const [result] = await db.promise().query(
        `INSERT INTO otp_codes (email, otp_code, expires_at, created_at) 
         VALUES (?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE otp_code = ?, expires_at = ?, is_used = 0, created_at = NOW()`,
        [identifier, otpCode, expiresAt, otpCode, expiresAt]
      );
      return result.insertId;
    } else {
      const [result] = await db.promise().query(
        `INSERT INTO otp_codes (phone_number, otp_code, expires_at, created_at) 
         VALUES (?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE otp_code = ?, expires_at = ?, is_used = 0, created_at = NOW()`,
        [identifier, otpCode, expiresAt, otpCode, expiresAt]
      );
      return result.insertId;
    }
  },

  verify: async (identifier, otpCode) => {
    const isEmail = identifier.includes('@');
    const condition = isEmail ? 'email = ?' : 'phone_number = ?';
    
    const [results] = await db.promise().query(
      `SELECT * FROM otp_codes 
       WHERE ${condition} AND otp_code = ? AND is_used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [identifier, otpCode]
    );

    if (results.length === 0) {
      return false;
    }

    // Đánh dấu OTP đã sử dụng
    await db.promise().query(
      `UPDATE otp_codes SET is_used = 1 WHERE id = ?`,
      [results[0].id]
    );

    return true;
  },

  // =============== CALLBACK METHODS (legacy) ===============
  insertCode: (phone, code, expiresAt, callback) => {
    const sql = `INSERT INTO otp_codes (phone_number, otp_code, expires_at) VALUES (?, ?, ?)`;
    db.query(sql, [phone, code, expiresAt], callback);
  },

  verifyCode: (phone, code, callback) => {
    const sql = `
      SELECT * FROM otp_codes 
      WHERE phone_number = ? AND otp_code = ? AND is_used = 0 AND expires_at >= NOW()
      ORDER BY created_at DESC LIMIT 1
    `;
    db.query(sql, [phone, code], callback);
  },

  markUsed: (id, callback) => {
    const sql = `UPDATE otp_codes SET is_used = 1 WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  // =============== UTILITY METHODS ===============
  cleanup: async () => {
    // Xóa các OTP đã hết hạn (chạy định kỳ)
    await db.promise().query(
      `DELETE FROM otp_codes WHERE expires_at < NOW() OR created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)`
    );
  },

  getRecentAttempts: async (identifier, minutes = 5) => {
    const isEmail = identifier.includes('@');
    const condition = isEmail ? 'email = ?' : 'phone_number = ?';
    
    const [results] = await db.promise().query(
      `SELECT COUNT(*) as attempts FROM otp_codes 
       WHERE ${condition} AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
      [identifier, minutes]
    );

    return results[0].attempts;
  }
};

module.exports = Otp;