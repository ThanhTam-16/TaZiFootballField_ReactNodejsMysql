// // backend/controllers/adminController.js
// const Admin = require('../models/Admin');
// const db = require('../config/db');

// exports.getDashboard = (req, res) => {
//   Admin.getDashboardStats((err, stats) => {
//     if (err) {
//       return res.status(500).json({ error: 'Lỗi lấy thống kê dashboard' });
//     }
//     res.json(stats);
//   });
// };

// exports.getRecentBookings = async (req, res) => {
//   try {
//     const limit = req.query.limit || 10;
//     const [results] = await db.promise().query(`
//       SELECT 
//         b.id, b.booking_date, b.start_time, b.end_time, 
//         b.total_amount, b.status, b.payment_status, b.created_at,
//         u.name as customer_name, u.phone_number,
//         f.name as field_name, f.type as field_type
//       FROM bookings b
//       JOIN users u ON b.user_id = u.id
//       JOIN fields f ON b.field_id = f.id
//       ORDER BY b.created_at DESC
//       LIMIT ?
//     `, [parseInt(limit)]);

//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
//   }
// };

// exports.getAllBookings = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
//     const status = req.query.status;
//     const date = req.query.date;

//     let whereClause = '';
//     let params = [];

//     if (status) {
//       whereClause += ' WHERE b.status = ?';
//       params.push(status);
//     }

//     if (date) {
//       whereClause += status ? ' AND' : ' WHERE';
//       whereClause += ' b.booking_date = ?';
//       params.push(date);
//     }

//     const [results] = await db.promise().query(`
//       SELECT 
//         b.id, b.booking_date, b.start_time, b.end_time, 
//         b.total_amount, b.status, b.payment_status, b.notes, b.created_at,
//         u.name as customer_name, u.phone_number, u.email,
//         f.name as field_name, f.type as field_type
//       FROM bookings b
//       JOIN users u ON b.user_id = u.id
//       JOIN fields f ON b.field_id = f.id
//       ${whereClause}
//       ORDER BY b.created_at DESC
//       LIMIT ? OFFSET ?
//     `, [...params, limit, offset]);

//     // Đếm tổng số
//     const [countResult] = await db.promise().query(`
//       SELECT COUNT(*) as total
//       FROM bookings b
//       ${whereClause}
//     `, params);

//     res.json({
//       bookings: results,
//       pagination: {
//         page,
//         limit,
//         total: countResult[0].total,
//         totalPages: Math.ceil(countResult[0].total / limit)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
//   }
// };

// exports.updateBookingStatus = async (req, res) => {
//   const { bookingId } = req.params;
//   const { status, notes } = req.body;

//   if (!['pending', 'approved', 'cancelled', 'completed'].includes(status)) {
//     return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
//   }

//   try {
//     const [result] = await db.promise().query(`
//       UPDATE bookings 
//       SET status = ?, notes = ?, updated_at = NOW() 
//       WHERE id = ?
//     `, [status, notes || null, bookingId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy booking' });
//     }

//     res.json({ message: 'Cập nhật trạng thái thành công' });
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi cập nhật trạng thái' });
//   }
// };

// exports.getUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
//     const search = req.query.search;

//     let whereClause = ' WHERE role = "customer"';
//     let params = [];

//     if (search) {
//       whereClause += ' AND (name LIKE ? OR phone_number LIKE ? OR email LIKE ?)';
//       params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }

//     const [results] = await db.promise().query(`
//       SELECT 
//         id, phone_number, name, email, is_active, 
//         total_bookings, cancelled_bookings, created_at
//       FROM users
//       ${whereClause}
//       ORDER BY created_at DESC
//       LIMIT ? OFFSET ?
//     `, [...params, limit, offset]);

//     const [countResult] = await db.promise().query(`
//       SELECT COUNT(*) as total FROM users ${whereClause}
//     `, params);

//     res.json({
//       users: results,
//       pagination: {
//         page,
//         limit,
//         total: countResult[0].total,
//         totalPages: Math.ceil(countResult[0].total / limit)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
//   }
// };

// exports.getFields = async (req, res) => {
//   try {
//     const [results] = await db.promise().query(`
//       SELECT 
//         f.*,
//         COUNT(b.id) as total_bookings,
//         SUM(CASE WHEN b.booking_date = CURDATE() THEN 1 ELSE 0 END) as today_bookings
//       FROM fields f
//       LEFT JOIN bookings b ON f.id = b.field_id AND b.status != 'cancelled'
//       WHERE f.is_active = 1
//       GROUP BY f.id
//       ORDER BY f.name
//     `);

//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi lấy danh sách sân' });
//   }
// };

// exports.createField = async (req, res) => {
//   const { name, type, price_per_hour, description, facilities } = req.body;

//   if (!name || !type || !price_per_hour) {
//     return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
//   }

//   try {
//     const [result] = await db.promise().query(`
//       INSERT INTO fields (name, type, price_per_hour, description, facilities)
//       VALUES (?, ?, ?, ?, ?)
//     `, [name, type, price_per_hour, description, JSON.stringify(facilities || [])]);

//     res.status(201).json({ 
//       message: 'Tạo sân thành công', 
//       fieldId: result.insertId 
//     });
//   } catch (error) {
//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(400).json({ error: 'Tên sân đã tồn tại' });
//     }
//     res.status(500).json({ error: 'Lỗi tạo sân' });
//   }
// };

// exports.updateField = async (req, res) => {
//   const { fieldId } = req.params;
//   const { name, type, price_per_hour, description, facilities, is_active } = req.body;

//   try {
//     const [result] = await db.promise().query(`
//       UPDATE fields 
//       SET name = ?, type = ?, price_per_hour = ?, description = ?, 
//           facilities = ?, is_active = ?, updated_at = NOW()
//       WHERE id = ?
//     `, [
//       name, type, price_per_hour, description, 
//       JSON.stringify(facilities || []), is_active, fieldId
//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy sân' });
//     }

//     res.json({ message: 'Cập nhật sân thành công' });
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi cập nhật sân' });
//   }
// };

// exports.getRevenue = async (req, res) => {
//   try {
//     const { period = '7', start_date, end_date } = req.query;
    
//     let dateCondition = '';
//     let params = [];

//     if (start_date && end_date) {
//       dateCondition = 'WHERE booking_date BETWEEN ? AND ?';
//       params = [start_date, end_date];
//     } else {
//       dateCondition = 'WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
//       params = [parseInt(period)];
//     }

//     const [results] = await db.promise().query(`
//       SELECT 
//         booking_date,
//         SUM(total_amount) as daily_revenue,
//         COUNT(*) as daily_bookings
//       FROM bookings 
//       ${dateCondition} AND status != 'cancelled'
//       GROUP BY booking_date
//       ORDER BY booking_date DESC
//     `, params);

//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: 'Lỗi lấy báo cáo doanh thu' });
//   }
// };

// // Thêm các function này vào cuối file adminController.js (trước module.exports)

// // Lấy danh sách sân kèm lịch đặt
// exports.getFieldsWithBookings = async (req, res) => {
//   try {
//     const date = req.query.date || new Date().toISOString().split('T')[0];
    
//     const [results] = await db.promise().query(`
//       SELECT 
//         f.id, f.name, f.type, f.price_per_hour,
//         b.id as booking_id, b.start_time, b.end_time, 
//         b.status, u.name as customer_name, u.phone_number
//       FROM fields f
//       LEFT JOIN bookings b ON f.id = b.field_id AND b.booking_date = ? AND b.status != 'cancelled'
//       LEFT JOIN users u ON b.user_id = u.id
//       WHERE f.is_active = 1
//       ORDER BY f.name, b.start_time
//     `, [date]);

//     // Group bookings by field
//     const fieldsMap = new Map();
//     results.forEach(row => {
//       if (!fieldsMap.has(row.id)) {
//         fieldsMap.set(row.id, {
//           id: row.id,
//           name: row.name,
//           type: row.type,
//           price_per_hour: row.price_per_hour,
//           bookings: []
//         });
//       }
      
//       if (row.booking_id) {
//         fieldsMap.get(row.id).bookings.push({
//           id: row.booking_id,
//           start_time: row.start_time,
//           end_time: row.end_time,
//           status: row.status,
//           customer_name: row.customer_name,
//           phone_number: row.phone_number
//         });
//       }
//     });

//     res.json(Array.from(fieldsMap.values()));
//   } catch (error) {
//     console.error('Error getting fields with bookings:', error);
//     res.status(500).json({ error: 'Lỗi lấy danh sách sân với lịch đặt' });
//   }
// };

// // Tạo booking thủ công bởi admin
// exports.createManualBooking = async (req, res) => {
//   const { 
//     field_id, booking_date, start_time, end_time, 
//     customer_name, phone_number, notes, total_amount 
//   } = req.body;

//   if (!field_id || !booking_date || !start_time || !end_time || !customer_name || !phone_number) {
//     return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
//   }

//   try {
//     // Kiểm tra xem khung giờ có bị trùng không
//     const [existingBookings] = await db.promise().query(`
//       SELECT id FROM bookings 
//       WHERE field_id = ? AND booking_date = ? 
//       AND status != 'cancelled'
//       AND (
//         (start_time <= ? AND end_time > ?) OR
//         (start_time < ? AND end_time >= ?) OR
//         (start_time >= ? AND end_time <= ?)
//       )
//     `, [field_id, booking_date, start_time, start_time, end_time, end_time, start_time, end_time]);

//     if (existingBookings.length > 0) {
//       return res.status(400).json({ error: 'Khung giờ này đã có người đặt' });
//     }

//     // Tìm hoặc tạo user với số điện thoại
//     let userId;
//     const [existingUser] = await db.promise().query(`
//       SELECT id FROM users WHERE phone_number = ?
//     `, [phone_number]);

//     if (existingUser.length > 0) {
//       userId = existingUser[0].id;
//       // Cập nhật tên nếu khác
//       await db.promise().query(`
//         UPDATE users SET name = ? WHERE id = ?
//       `, [customer_name, userId]);
//     } else {
//       // Tạo user mới
//       const [newUser] = await db.promise().query(`
//         INSERT INTO users (phone_number, name, role, created_at) 
//         VALUES (?, ?, 'customer', NOW())
//       `, [phone_number, customer_name]);
//       userId = newUser.insertId;
//     }

//     // Tạo booking
//     const [result] = await db.promise().query(`
//       INSERT INTO bookings (
//         user_id, field_id, booking_date, start_time, end_time, 
//         total_amount, status, payment_status, notes, created_at
//       ) VALUES (?, ?, ?, ?, ?, ?, 'approved', 'pending', ?, NOW())
//     `, [userId, field_id, booking_date, start_time, end_time, total_amount, notes]);

//     res.status(201).json({ 
//       message: 'Tạo booking thành công', 
//       bookingId: result.insertId 
//     });
//   } catch (error) {
//     console.error('Error creating manual booking:', error);
//     res.status(500).json({ error: 'Lỗi tạo booking' });
//   }
// };

// // Xóa booking
// exports.deleteBooking = async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const [result] = await db.promise().query(`
//       DELETE FROM bookings WHERE id = ?
//     `, [bookingId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy booking' });
//     }

//     res.json({ message: 'Xóa booking thành công' });
//   } catch (error) {
//     console.error('Error deleting booking:', error);
//     res.status(500).json({ error: 'Lỗi xóa booking' });
//   }
// };

// // backend/controllers/adminController.js - Bổ sung methods

// // Thêm vào cuối file, trước module.exports
// exports.getAllBookings = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
    
//     // Filters
//     const search = req.query.search;
//     const status = req.query.status;
//     const fieldId = req.query.field_id;
//     const dateFilter = req.query.date_filter;

//     let whereClause = '';
//     let params = [];

//     // Build where conditions
//     const conditions = [];
    
//     if (search) {
//       conditions.push('(u.name LIKE ? OR u.phone_number LIKE ? OR f.name LIKE ?)');
//       params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }
    
//     if (status) {
//       conditions.push('b.status = ?');
//       params.push(status);
//     }
    
//     if (fieldId) {
//       conditions.push('b.field_id = ?');
//       params.push(fieldId);
//     }
    
//     if (dateFilter) {
//       const today = new Date();
//       const todayStr = today.toISOString().split('T')[0];
      
//       switch (dateFilter) {
//         case 'today':
//           conditions.push('b.booking_date = ?');
//           params.push(todayStr);
//           break;
//         case 'tomorrow':
//           const tomorrow = new Date(today);
//           tomorrow.setDate(tomorrow.getDate() + 1);
//           conditions.push('b.booking_date = ?');
//           params.push(tomorrow.toISOString().split('T')[0]);
//           break;
//         case 'week':
//           const weekEnd = new Date(today);
//           weekEnd.setDate(weekEnd.getDate() + 7);
//           conditions.push('b.booking_date BETWEEN ? AND ?');
//           params.push(todayStr, weekEnd.toISOString().split('T')[0]);
//           break;
//         case 'month':
//           const monthEnd = new Date(today);
//           monthEnd.setMonth(monthEnd.getMonth() + 1);
//           conditions.push('b.booking_date BETWEEN ? AND ?');
//           params.push(todayStr, monthEnd.toISOString().split('T')[0]);
//           break;
//       }
//     }

//     if (conditions.length > 0) {
//       whereClause = 'WHERE ' + conditions.join(' AND ');
//     }

//     // Main query
//     const [results] = await db.promise().query(`
//       SELECT 
//         b.id, b.booking_date, b.start_time, b.end_time, 
//         b.total_amount, b.status, b.payment_status, b.notes, b.created_at,
//         u.name as customer_name, u.phone_number, u.email,
//         f.id as field_id, f.name as field_name, f.type as field_type
//       FROM bookings b
//       JOIN users u ON b.user_id = u.id
//       JOIN fields f ON b.field_id = f.id
//       ${whereClause}
//       ORDER BY b.created_at DESC
//       LIMIT ? OFFSET ?
//     `, [...params, limit, offset]);

//     // Count query
//     const [countResult] = await db.promise().query(`
//       SELECT COUNT(*) as total
//       FROM bookings b
//       JOIN users u ON b.user_id = u.id
//       JOIN fields f ON b.field_id = f.id
//       ${whereClause}
//     `, params);

//     res.json({
//       bookings: results,
//       pagination: {
//         page,
//         limit,
//         total: countResult[0].total,
//         totalPages: Math.ceil(countResult[0].total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error getting all bookings:', error);
//     res.status(500).json({ error: 'Lỗi lấy danh sách đặt sân' });
//   }
// };

// // Bổ sung method update booking (nếu cần edit booking)
// exports.updateBooking = async (req, res) => {
//   const { bookingId } = req.params;
//   const { 
//     customer_name, 
//     phone_number, 
//     field_id, 
//     booking_date, 
//     start_time, 
//     end_time, 
//     total_amount, 
//     status, 
//     notes 
//   } = req.body;

//   try {
//     // Check if booking exists
//     const [existing] = await db.promise().query(
//       'SELECT * FROM bookings WHERE id = ?', 
//       [bookingId]
//     );

//     if (existing.length === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy booking' });
//     }

//     // Update user info if provided
//     if (customer_name || phone_number) {
//       await db.promise().query(`
//         UPDATE users SET name = ?, phone_number = ? 
//         WHERE id = ?
//       `, [
//         customer_name || existing[0].customer_name,
//         phone_number || existing[0].phone_number,
//         existing[0].user_id
//       ]);
//     }

//     // Update booking
//     const [result] = await db.promise().query(`
//       UPDATE bookings 
//       SET field_id = ?, booking_date = ?, start_time = ?, end_time = ?, 
//           total_amount = ?, status = ?, notes = ?, updated_at = NOW()
//       WHERE id = ?
//     `, [
//       field_id || existing[0].field_id,
//       booking_date || existing[0].booking_date,
//       start_time || existing[0].start_time,
//       end_time || existing[0].end_time,
//       total_amount || existing[0].total_amount,
//       status || existing[0].status,
//       notes !== undefined ? notes : existing[0].notes,
//       bookingId
//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Không thể cập nhật booking' });
//     }

//     res.json({ message: 'Cập nhật booking thành công' });
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     res.status(500).json({ error: 'Lỗi cập nhật booking' });
//   }
// };

// // backend/controllers/adminController.js - Bổ sung Customer Management APIs

// // Thêm vào cuối file adminController.js, trước module.exports

// // === CUSTOMER MANAGEMENT APIs ===

// // Lấy danh sách khách hàng với phân trang và filter
// exports.getCustomers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
    
//     // Filters
//     const search = req.query.search;
//     const status = req.query.status; // active, inactive
//     const sortBy = req.query.sort || 'created_at';
//     const sortOrder = req.query.order || 'DESC';

//     let whereClause = ' WHERE role = "customer"';
//     let params = [];

//     // Search filter
//     if (search) {
//       whereClause += ' AND (name LIKE ? OR phone_number LIKE ? OR email LIKE ?)';
//       params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }

//     // Status filter
//     if (status) {
//       whereClause += ' AND is_active = ?';
//       params.push(status === 'active' ? 1 : 0);
//     }

//     // Get customers with booking statistics
//     const [results] = await db.promise().query(`
//       SELECT 
//         u.id, u.phone_number, u.name, u.email, u.is_active, 
//         u.total_bookings, u.cancelled_bookings, u.created_at,
//         COALESCE(booking_stats.completed_bookings, 0) as completed_bookings,
//         COALESCE(booking_stats.total_spent, 0) as total_spent,
//         booking_stats.last_booking_date
//       FROM users u
//       LEFT JOIN (
//         SELECT 
//           user_id,
//           COUNT(*) as total_bookings_calc,
//           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
//           SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent,
//           MAX(CASE WHEN status = 'completed' THEN booking_date ELSE NULL END) as last_booking_date
//         FROM bookings 
//         GROUP BY user_id
//       ) booking_stats ON u.id = booking_stats.user_id
//       ${whereClause}
//       ORDER BY ${sortBy} ${sortOrder}
//       LIMIT ? OFFSET ?
//     `, [...params, limit, offset]);

//     // Count total
//     const [countResult] = await db.promise().query(`
//       SELECT COUNT(*) as total FROM users ${whereClause}
//     `, params);

//     res.json({
//       customers: results,
//       pagination: {
//         page,
//         limit,
//         total: countResult[0].total,
//         totalPages: Math.ceil(countResult[0].total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error getting customers:', error);
//     res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
//   }
// };

// // Lấy thông tin chi tiết một khách hàng
// exports.getCustomerById = async (req, res) => {
//   try {
//     const { customerId } = req.params;

//     const [customerResult] = await db.promise().query(`
//       SELECT 
//         u.*,
//         COALESCE(booking_stats.completed_bookings, 0) as completed_bookings,
//         COALESCE(booking_stats.total_spent, 0) as total_spent,
//         booking_stats.last_booking_date
//       FROM users u
//       LEFT JOIN (
//         SELECT 
//           user_id,
//           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
//           SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent,
//           MAX(CASE WHEN status = 'completed' THEN booking_date ELSE NULL END) as last_booking_date
//         FROM bookings 
//         WHERE user_id = ?
//         GROUP BY user_id
//       ) booking_stats ON u.id = booking_stats.user_id
//       WHERE u.id = ?
//     `, [customerId, customerId]);

//     if (customerResult.length === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
//     }

//     res.json(customerResult[0]);
//   } catch (error) {
//     console.error('Error getting customer by id:', error);
//     res.status(500).json({ error: 'Lỗi lấy thông tin khách hàng' });
//   }
// };

// // Tạo khách hàng mới
// exports.createCustomer = async (req, res) => {
//   try {
//     const { name, phone_number, email } = req.body;

//     if (!name || !phone_number) {
//       return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
//     }

//     // Check phone duplicate
//     const [existing] = await db.promise().query(
//       'SELECT id FROM users WHERE phone_number = ?',
//       [phone_number]
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
//     }

//     const [result] = await db.promise().query(`
//       INSERT INTO users (name, phone_number, email, role, created_at) 
//       VALUES (?, ?, ?, 'customer', NOW())
//     `, [name, phone_number, email || null]);

//     res.status(201).json({ 
//       message: 'Tạo khách hàng thành công', 
//       customerId: result.insertId 
//     });
//   } catch (error) {
//     console.error('Error creating customer:', error);
//     res.status(500).json({ error: 'Lỗi tạo khách hàng' });
//   }
// };

// // Cập nhật thông tin khách hàng
// exports.updateCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const { name, phone_number, email, is_active } = req.body;

//     // Check if customer exists
//     const [existing] = await db.promise().query(
//       'SELECT id FROM users WHERE id = ?',
//       [customerId]
//     );

//     if (existing.length === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
//     }

//     // Check phone duplicate (exclude current customer)
//     if (phone_number) {
//       const [duplicate] = await db.promise().query(
//         'SELECT id FROM users WHERE phone_number = ? AND id != ?',
//         [phone_number, customerId]
//       );

//       if (duplicate.length > 0) {
//         return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
//       }
//     }

//     const [result] = await db.promise().query(`
//       UPDATE users 
//       SET name = ?, phone_number = ?, email = ?, is_active = ?, updated_at = NOW()
//       WHERE id = ?
//     `, [name, phone_number, email || null, is_active, customerId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Không thể cập nhật khách hàng' });
//     }

//     res.json({ message: 'Cập nhật khách hàng thành công' });
//   } catch (error) {
//     console.error('Error updating customer:', error);
//     res.status(500).json({ error: 'Lỗi cập nhật khách hàng' });
//   }
// };

// // Xóa khách hàng (soft delete)
// exports.deleteCustomer = async (req, res) => {
//   try {
//     const { customerId } = req.params;

//     const [result] = await db.promise().query(`
//       UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?
//     `, [customerId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
//     }

//     res.json({ message: 'Xóa khách hàng thành công' });
//   } catch (error) {
//     console.error('Error deleting customer:', error);
//     res.status(500).json({ error: 'Lỗi xóa khách hàng' });
//   }
// };

// // Cập nhật trạng thái nhiều khách hàng
// exports.bulkUpdateCustomers = async (req, res) => {
//   try {
//     const { customerIds, action } = req.body; // action: 'activate' | 'deactivate' | 'delete'

//     if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
//       return res.status(400).json({ error: 'Danh sách khách hàng không hợp lệ' });
//     }

//     let query = '';
//     let newStatus = null;

//     switch (action) {
//       case 'activate':
//         newStatus = 1;
//         query = 'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id IN (?)';
//         break;
//       case 'deactivate':
//         newStatus = 0;
//         query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
//         break;
//       case 'delete':
//         newStatus = 0;
//         query = 'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id IN (?)';
//         break;
//       default:
//         return res.status(400).json({ error: 'Hành động không hợp lệ' });
//     }

//     const [result] = await db.promise().query(query, [customerIds]);

//     res.json({ 
//       message: `Cập nhật thành công ${result.affectedRows} khách hàng`,
//       affectedRows: result.affectedRows
//     });
//   } catch (error) {
//     console.error('Error bulk updating customers:', error);
//     res.status(500).json({ error: 'Lỗi cập nhật hàng loạt' });
//   }
// };

// // Lấy thống kê khách hàng
// exports.getCustomerStats = async (req, res) => {
//   try {
//     const [stats] = await db.promise().query(`
//       SELECT 
//         COUNT(*) as total_customers,
//         SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_customers,
//         SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_customers,
//         SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_customers_30d,
//         SUM(CASE WHEN total_bookings >= 10 THEN 1 ELSE 0 END) as vip_customers
//       FROM users 
//       WHERE role = 'customer'
//     `);

//     res.json(stats[0]);
//   } catch (error) {
//     console.error('Error getting customer stats:', error);
//     res.status(500).json({ error: 'Lỗi lấy thống kê khách hàng' });
//   }
// };