// backend/controllers/customerController.js - FIXED VERSION with proper data
const db = require('../config/db');
const User = require('../models/User');

exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const filters = {
      search: req.query.search,
      status: req.query.status,
      sort: req.query.sort || 'created_at',
      order: req.query.order || 'DESC'
    };

    let whereClause = '';
    let params = [];

    // Build WHERE clause for filtering
    if (filters.search) {
      whereClause += ' AND (u.name LIKE ? OR u.phone_number LIKE ? OR u.email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.status) {
      whereClause += ' AND u.is_active = ?';
      params.push(filters.status === 'active' ? 1 : 0);
    }

    // FIXED: Better query to get all customer data with proper booking stats
    const [results] = await db.promise().query(`
      SELECT 
        u.id, 
        u.phone_number, 
        u.name, 
        u.email, 
        u.is_active, 
        u.created_at,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN b.status = 'approved' THEN 1 ELSE 0 END) as approved_bookings,
        SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as total_spent,
        MAX(CASE WHEN b.status IN ('completed', 'approved') THEN b.booking_date ELSE NULL END) as last_booking_date,
        AVG(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE NULL END) as avg_booking_amount
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE 1=1 ${whereClause}
      GROUP BY u.id, u.phone_number, u.name, u.email, u.is_active, u.created_at
      ORDER BY ${filters.sort} ${filters.order}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Count total customers for pagination
    const [countResult] = await db.promise().query(`
      SELECT COUNT(DISTINCT u.id) as total 
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE 1=1 ${whereClause}
    `, params);

    // Format the results
    const formattedResults = results.map(customer => ({
      ...customer,
      total_bookings: parseInt(customer.total_bookings) || 0,
      completed_bookings: parseInt(customer.completed_bookings) || 0,
      cancelled_bookings: parseInt(customer.cancelled_bookings) || 0,
      pending_bookings: parseInt(customer.pending_bookings) || 0,
      approved_bookings: parseInt(customer.approved_bookings) || 0,
      total_spent: parseFloat(customer.total_spent) || 0,
      avg_booking_amount: parseFloat(customer.avg_booking_amount) || 0,
      is_active: Boolean(customer.is_active)
    }));

    console.log('Customer data sample:', formattedResults[0]); // Debug log

    res.json({
      customers: formattedResults,
      pagination: {
        page, 
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // FIXED: Get detailed customer information
    const [customerResult] = await db.promise().query(`
      SELECT 
        u.id, 
        u.phone_number, 
        u.name, 
        u.email, 
        u.is_active, 
        u.created_at,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN b.status = 'approved' THEN 1 ELSE 0 END) as approved_bookings,
        SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as total_spent,
        MAX(CASE WHEN b.status IN ('completed', 'approved') THEN b.booking_date ELSE NULL END) as last_booking_date,
        AVG(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE NULL END) as avg_booking_amount
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [customerId]);
    
    if (customerResult.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    const customer = {
      ...customerResult[0],
      total_bookings: parseInt(customerResult[0].total_bookings) || 0,
      completed_bookings: parseInt(customerResult[0].completed_bookings) || 0,
      cancelled_bookings: parseInt(customerResult[0].cancelled_bookings) || 0,
      pending_bookings: parseInt(customerResult[0].pending_bookings) || 0,
      approved_bookings: parseInt(customerResult[0].approved_bookings) || 0,
      total_spent: parseFloat(customerResult[0].total_spent) || 0,
      avg_booking_amount: parseFloat(customerResult[0].avg_booking_amount) || 0,
      is_active: Boolean(customerResult[0].is_active)
    };
    
    res.json(customer);
  } catch (error) {
    console.error('Get customer by id error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin khách hàng' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone_number, email, is_active } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Check if phone number already exists
    const [existingCustomer] = await db.promise().query(
      'SELECT id FROM users WHERE phone_number = ?',
      [phone_number]
    );

    if (existingCustomer.length > 0) {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }

    // Create new customer
    const [result] = await db.promise().query(`
      INSERT INTO users (name, phone_number, email, is_active, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `, [name, phone_number, email || null, is_active !== undefined ? is_active : 1]);
    
    res.status(201).json({ 
      message: 'Tạo khách hàng thành công', 
      customerId: result.insertId 
    });
  } catch (error) {
    console.error('Create customer error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi tạo khách hàng' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, phone_number, email, is_active } = req.body;

    // Check if customer exists
    const [existingCustomer] = await db.promise().query(
      'SELECT id FROM users WHERE id = ?',
      [customerId]
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    // Check if phone number already exists (excluding current customer)
    if (phone_number) {
      const [duplicatePhone] = await db.promise().query(
        'SELECT id FROM users WHERE phone_number = ? AND id != ?',
        [phone_number, customerId]
      );

      if (duplicatePhone.length > 0) {
        return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
      }
    }

    // Update customer
    const [result] = await db.promise().query(`
      UPDATE users 
      SET name = ?, phone_number = ?, email = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, phone_number, email || null, is_active !== undefined ? is_active : 1, customerId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không thể cập nhật khách hàng' });
    }

    res.json({ message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi cập nhật khách hàng' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Check if customer has bookings
    const [bookingCheck] = await db.promise().query(
      'SELECT COUNT(*) as count FROM bookings WHERE user_id = ?',
      [customerId]
    );

    if (bookingCheck[0].count > 0) {
      // Soft delete: just deactivate the customer
      const [result] = await db.promise().query(
        'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [customerId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
      }

      res.json({ message: 'Đã vô hiệu hóa khách hàng thành công' });
    } else {
      // Hard delete if no bookings
      const [result] = await db.promise().query(
        'DELETE FROM users WHERE id = ?',
        [customerId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
      }

      res.json({ message: 'Xóa khách hàng thành công' });
    }
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Lỗi xóa khách hàng' });
  }
};

exports.bulkUpdateCustomers = async (req, res) => {
  try {
    const { customerIds, action } = req.body;

    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({ error: 'Danh sách khách hàng không hợp lệ' });
    }

    let query = '';
    let params = [];

    switch (action) {
      case 'activate':
        query = 'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id IN (?)';
        params = [customerIds];
        break;
      case 'deactivate':
        query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
        params = [customerIds];
        break;
      case 'delete':
        query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
        params = [customerIds];
        break;
      default:
        return res.status(400).json({ error: 'Hành động không hợp lệ' });
    }

    const [result] = await db.promise().query(query, params);
    
    res.json({ 
      message: `Cập nhật thành công ${result.affectedRows} khách hàng`,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Bulk update customers error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật hàng loạt' });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const [stats] = await db.promise().query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_customers,
        SUM(CASE WHEN u.is_active = 1 THEN 1 ELSE 0 END) as active_customers,
        SUM(CASE WHEN u.is_active = 0 THEN 1 ELSE 0 END) as inactive_customers,
        SUM(CASE WHEN u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_customers_30d,
        SUM(CASE 
          WHEN (
            SELECT COUNT(*) FROM bookings b 
            WHERE b.user_id = u.id AND b.status = 'completed'
          ) >= 10 THEN 1 ELSE 0 
        END) as vip_customers
      FROM users u
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê khách hàng' });
  }
};