// backend/controllers/userController.js
const User = require('../models/User');
const sendOtp = require('../utils/sendOtp');

// =============== USER PROFILE MANAGEMENT ===============
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting user profile for ID:', id);
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      error: 'Lỗi lấy thông tin người dùng',
      details: error.message 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number } = req.body;

    console.log('Updating user profile:', { id, name, email, phone_number });

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Tên phải có ít nhất 2 ký tự' });
    }

    // Validate email if provided
    if (email && !sendOtp.isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    // Validate phone if provided
    if (phone_number && !sendOtp.isValidPhone(phone_number)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    }

    await User.updateInfo(id, { name: name.trim(), email, phone_number });
    
    console.log('User profile updated successfully');
    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      error: 'Lỗi cập nhật thông tin',
      details: error.message 
    });
  }
};