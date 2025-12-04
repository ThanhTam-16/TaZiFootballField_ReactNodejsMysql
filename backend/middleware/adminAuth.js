// backend/middleware/adminAuth.js
const Admin = require('../models/Admin');

// Middleware xác thực admin
exports.requireAuth = (req, res, next) => {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionToken) {
    return res.status(401).json({ error: 'Thiếu token xác thực' });
  }

  Admin.findSession(sessionToken, (err, results) => {
    if (err || !results || results.length === 0) {
      return res
        .status(401)
        .json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const session = results[0];

    let permissions = [];
    try {
      permissions = JSON.parse(session.permissions || '[]');
    } catch (e) {
      console.error('⚠️ Lỗi parse permissions JSON:', e.message);
      permissions = [];
    }

    req.admin = {
      id: session.admin_id,
      email: session.email,
      name: session.name,
      role: session.role,
      permissions,
    };

    next();
  });
};

// Middleware kiểm tra quyền
exports.requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Chưa xác thực admin' });
    }

    const adminPermissions = req.admin.permissions || [];

    // Super admin có tất cả quyền
    if (adminPermissions.includes('all')) {
      return next();
    }

    // Kiểm tra quyền cụ thể
    if (!adminPermissions.includes(permission)) {
      return res.status(403).json({
        error: `Bạn không có quyền ${permission}`,
      });
    }

    next();
  };
};

// Middleware chỉ cho super admin
exports.requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Chỉ Super Admin mới có quyền thực hiện thao tác này',
    });
  }
  next();
};
