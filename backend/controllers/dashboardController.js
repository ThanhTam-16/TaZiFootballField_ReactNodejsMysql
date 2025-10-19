// backend/controllers/dashboardController.js - ENHANCED WITH CHART DATA
const db = require('../config/db');
const Admin = require('../models/Admin');

// ============== EXISTING METHODS ==============
exports.getDashboard = async (req, res) => {
  try {
    console.log('Dashboard getDashboard called - starting...');
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 5000);
    });
    
    const statsPromise = Admin.getDashboardStats();
    const stats = await Promise.race([statsPromise, timeoutPromise]);
    
    console.log('Dashboard stats completed successfully');
    res.json(stats);
  } catch (error) {
    console.error('Get dashboard error:', error);
    
    const fallbackStats = {
      today_revenue: 0,
      today_bookings: 0,
      pending_bookings: 0,
      total_fields: 0,
      total_users: 0
    };
    
    console.log('Returning fallback stats due to error');
    res.json(fallbackStats);
  }
};

exports.getDashboardFast = async (req, res) => {
  try {
    console.log('Dashboard getDashboardFast called - direct query version');
    
    const today = new Date().toISOString().split('T')[0];
    
    const [results] = await Promise.race([
      db.promise().query(`
        SELECT 
          COALESCE((SELECT SUM(total_amount) FROM bookings WHERE DATE(booking_date) = ? AND status IN ('approved', 'completed')), 0) as today_revenue,
          COALESCE((SELECT COUNT(*) FROM bookings WHERE DATE(booking_date) = ?), 0) as today_bookings,
          COALESCE((SELECT COUNT(*) FROM bookings WHERE status = 'pending'), 0) as pending_bookings,
          COALESCE((SELECT COUNT(*) FROM fields WHERE is_active = 1), 0) as total_fields,
          COALESCE((SELECT COUNT(*) FROM users WHERE role = 'customer'), 0) as total_users
      `, [today, today]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000))
    ]);
    
    const stats = {
      today_revenue: parseFloat(results[0].today_revenue) || 0,
      today_bookings: parseInt(results[0].today_bookings) || 0,
      pending_bookings: parseInt(results[0].pending_bookings) || 0,
      total_fields: parseInt(results[0].total_fields) || 0,
      total_users: parseInt(results[0].total_users) || 0
    };
    
    console.log('Fast dashboard stats completed:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Fast dashboard error:', error);
    
    res.json({
      today_revenue: 0,
      today_bookings: 0,
      pending_bookings: 3,
      total_fields: 5,
      total_users: 5
    });
  }
};

exports.getRecentBookings = async (req, res) => {
  try {
    console.log('Dashboard getRecentBookings called');
    const limit = parseInt(req.query.limit) || 10;
    
    const [results] = await Promise.race([
      db.promise().query(`
        SELECT 
          b.id, b.booking_date, b.start_time, b.end_time, 
          b.total_amount, b.status, b.payment_status, b.created_at,
          u.name as customer_name, u.phone_number,
          f.name as field_name, f.type as field_type
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN fields f ON b.field_id = f.id
        ORDER BY b.created_at DESC
        LIMIT ?
      `, [limit]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000))
    ]);
    
    console.log('Recent bookings found:', results.length);
    res.json(results);
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.json([]);
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const [stats] = await Promise.race([
      db.promise().query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role = 'customer' AND is_active = 1) as total_customers,
          (SELECT COUNT(*) FROM fields WHERE is_active = 1) as total_fields,
          (SELECT COUNT(*) FROM bookings WHERE status != 'cancelled') as total_bookings,
          (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE status = 'completed' AND booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as revenue_30_days
      `),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000))
    ]);

    res.json(stats[0]);
  } catch (error) {
    console.error('Get system stats error:', error);
    res.json({
      total_customers: 0,
      total_fields: 0,
      total_bookings: 0,
      revenue_30_days: 0
    });
  }
};

exports.getQuickStats = async (req, res) => {
  try {
    const [stats] = await Promise.race([
      db.promise().query(`
        SELECT 
          (SELECT COUNT(*) FROM bookings WHERE booking_date = CURDATE() AND status != 'cancelled') as today_bookings,
          (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
          (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE booking_date = CURDATE() AND status = 'completed') as today_revenue,
          (SELECT COUNT(*) FROM users WHERE role = 'customer' AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) as new_customers_today
      `),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000))
    ]);

    res.json(stats[0]);
  } catch (error) {
    console.error('Get quick stats error:', error);
    res.json({
      today_bookings: 0,
      pending_bookings: 0,
      today_revenue: 0,
      new_customers_today: 0
    });
  }
};

// ============== NEW CHART DATA METHODS ==============

// Revenue chart - Last 7 days
exports.getRevenueChart = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    const [results] = await db.promise().query(`
      SELECT 
        DATE(booking_date) as date,
        COUNT(*) as bookings,
        COALESCE(SUM(CASE WHEN status IN ('approved', 'completed') THEN total_amount ELSE 0 END), 0) as revenue
      FROM bookings
      WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(booking_date)
      ORDER BY date ASC
    `, [days]);
    
    res.json(results);
  } catch (error) {
    console.error('Get revenue chart error:', error);
    res.json([]);
  }
};

// Popular fields chart
exports.getPopularFields = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        f.name,
        f.type,
        COUNT(b.id) as booking_count,
        COALESCE(SUM(b.total_amount), 0) as total_revenue
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id AND b.status != 'cancelled'
      WHERE f.is_active = 1
      GROUP BY f.id, f.name, f.type
      ORDER BY booking_count DESC
      LIMIT 5
    `);
    
    res.json(results);
  } catch (error) {
    console.error('Get popular fields error:', error);
    res.json([]);
  }
};

// Booking status distribution
exports.getBookingStatusChart = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM bookings
      WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY status
    `);
    
    res.json(results);
  } catch (error) {
    console.error('Get booking status chart error:', error);
    res.json([]);
  }
};

// Hourly booking distribution
exports.getHourlyBookingChart = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        HOUR(start_time) as hour,
        COUNT(*) as booking_count
      FROM bookings
      WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND status != 'cancelled'
      GROUP BY HOUR(start_time)
      ORDER BY hour ASC
    `);
    
    res.json(results);
  } catch (error) {
    console.error('Get hourly booking chart error:', error);
    res.json([]);
  }
};

// Field type revenue comparison
exports.getFieldTypeRevenue = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        f.type,
        COUNT(b.id) as booking_count,
        COALESCE(SUM(b.total_amount), 0) as total_revenue
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id 
        AND b.status IN ('approved', 'completed')
        AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      WHERE f.is_active = 1
      GROUP BY f.type
      ORDER BY total_revenue DESC
    `);
    
    res.json(results);
  } catch (error) {
    console.error('Get field type revenue error:', error);
    res.json([]);
  }
};

// Customer growth chart
exports.getCustomerGrowth = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    const [results] = await db.promise().query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_customers
      FROM users
      WHERE role = 'customer' 
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);
    
    res.json(results);
  } catch (error) {
    console.error('Get customer growth error:', error);
    res.json([]);
  }
};