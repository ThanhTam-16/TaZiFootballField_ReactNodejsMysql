// backend/controllers/adminAuthController.js
// Wrapper cho các hàm admin auth trong authController
// ↓ Giữ tương thích ngược, tránh trùng logic & truy cập DB trực tiếp ở đây

const authController = require('./authController');

exports.login = authController.adminLogin;
exports.logout = authController.adminLogout;
exports.verifySession = authController.verifyAdminSession;
exports.changePassword = authController.changeAdminPassword;
