// backend/controllers/adminAuthController.js - Fixed for plain text passwords
const Admin = require('../models/Admin');
const crypto = require('crypto');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
  }

  Admin.findByEmail(email, async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const admin = results[0];
    
    try {
      // So sánh mật khẩu plain text thay vì bcrypt
      if (password !== admin.password) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
      }

      // Tạo session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      // Lưu session
      Admin.saveSession(admin.id, sessionToken, expiresAt, (sessionErr) => {
        if (sessionErr) {
          console.error('Session error:', sessionErr);
          return res.status(500).json({ error: 'Lỗi tạo phiên đăng nhập' });
        }

        // Cập nhật last_login
        Admin.updateLastLogin(admin.id, () => {});

        res.json({
          message: 'Đăng nhập thành công',
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            permissions: JSON.parse(admin.permissions || '[]')
          },
          sessionToken,
          expiresAt
        });
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Lỗi xác thực' });
    }
  });
};

exports.logout = (req, res) => {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionToken) {
    return res.status(400).json({ error: 'Không tìm thấy token' });
  }

  Admin.removeSession(sessionToken, (err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Lỗi đăng xuất' });
    }
    res.json({ message: 'Đăng xuất thành công' });
  });
};

exports.verifySession = (req, res) => {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionToken) {
    return res.status(401).json({ error: 'Thiếu token xác thực' });
  }

  Admin.findSession(sessionToken, (err, results) => {
    if (err || results.length === 0) {
      console.error('Session verify error:', err);
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const session = results[0];
    res.json({
      admin: {
        id: session.admin_id,
        email: session.email,
        name: session.name,
        role: session.role,
        permissions: JSON.parse(session.permissions || '[]')
      }
    });
  });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
  }

  // Tìm admin trong database
  const db = require('../config/db');
  db.query('SELECT * FROM admins WHERE id = ?', [adminId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy admin' });
    }

    const admin = results[0];
    
    // So sánh mật khẩu hiện tại (plain text)
    if (currentPassword !== admin.password) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    // Cập nhật mật khẩu mới (plain text)
    const updateSql = `UPDATE admins SET password = ?, updated_at = NOW() WHERE id = ?`;
    db.query(updateSql, [newPassword, adminId], (updateErr) => {
      if (updateErr) {
        console.error('Password update error:', updateErr);
        return res.status(500).json({ error: 'Lỗi cập nhật mật khẩu' });
      }
      res.json({ message: 'Đổi mật khẩu thành công' });
    });
  });
};