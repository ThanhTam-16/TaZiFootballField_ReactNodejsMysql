// backend/controllers/revenueController.js - Revenue Reports
const db = require('../config/db');

exports.getRevenue = async (req, res) => {
  try {
    const { period = '7', start_date, end_date } = req.query;
    
    let dateCondition = '';
    let params = [];

    if (start_date && end_date) {
      dateCondition = 'WHERE booking_date BETWEEN ? AND ?';
      params = [start_date, end_date];
    } else {
      dateCondition = 'WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
      params = [parseInt(period)];
    }

    const [results] = await db.promise().query(`
      SELECT 
        booking_date,
        SUM(total_amount) as daily_revenue,
        COUNT(*) as daily_bookings,
        AVG(total_amount) as avg_booking_value
      FROM bookings 
      ${dateCondition} AND status != 'cancelled'
      GROUP BY booking_date
      ORDER BY booking_date DESC
    `, params);

    const [summary] = await db.promise().query(`
      SELECT 
        SUM(total_amount) as total_revenue,
        COUNT(*) as total_bookings,
        AVG(total_amount) as avg_revenue_per_booking
      FROM bookings 
      ${dateCondition} AND status != 'cancelled'
    `, params);

    res.json({
      daily_data: results,
      summary: summary[0] || { total_revenue: 0, total_bookings: 0, avg_revenue_per_booking: 0 }
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Lỗi lấy báo cáo doanh thu' });
  }
};

exports.getRevenueByField = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateCondition = '';
    let params = [];

    if (start_date && end_date) {
      dateCondition = 'AND b.booking_date BETWEEN ? AND ?';
      params = [start_date, end_date];
    } else {
      dateCondition = 'AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    }

    const [results] = await db.promise().query(`
      SELECT 
        f.id,
        f.name as field_name,
        f.type as field_type,
        COUNT(b.id) as total_bookings,
        SUM(b.total_amount) as total_revenue,
        AVG(b.total_amount) as avg_revenue_per_booking
      FROM fields f
      LEFT JOIN bookings b ON f.id = b.field_id AND b.status != 'cancelled' ${dateCondition}
      WHERE f.is_active = 1
      GROUP BY f.id, f.name, f.type
      ORDER BY total_revenue DESC
    `, params);

    res.json(results);
  } catch (error) {
    console.error('Get revenue by field error:', error);
    res.status(500).json({ error: 'Lỗi lấy doanh thu theo sân' });
  }
};

exports.getRevenueByMonth = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const [results] = await db.promise().query(`
      SELECT 
        MONTH(booking_date) as month,
        YEAR(booking_date) as year,
        SUM(total_amount) as monthly_revenue,
        COUNT(*) as monthly_bookings
      FROM bookings 
      WHERE YEAR(booking_date) = ? AND status != 'cancelled'
      GROUP BY YEAR(booking_date), MONTH(booking_date)
      ORDER BY month
    `, [year]);

    res.json(results);
  } catch (error) {
    console.error('Get revenue by month error:', error);
    res.status(500).json({ error: 'Lỗi lấy doanh thu theo tháng' });
  }
};