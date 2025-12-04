// backend/models/Revenue.js - Revenue Report Queries
const db = require('../config/db');

const Revenue = {
  /**
   * Tổng hợp doanh thu theo ngày + summary
   * params: { period, start_date, end_date }
   */
  getRevenue: async (params = {}) => {
    const { period = '7', start_date, end_date } = params;

    let dateCondition = '';
    let queryParams = [];

    if (start_date && end_date) {
      dateCondition = 'WHERE booking_date BETWEEN ? AND ?';
      queryParams = [start_date, end_date];
    } else {
      dateCondition =
        'WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
      queryParams = [parseInt(period, 10)];
    }

    const [results] = await db.promise().query(
      `
      SELECT 
        booking_date,
        SUM(total_amount) as daily_revenue,
        COUNT(*) as daily_bookings,
        AVG(total_amount) as avg_booking_value
      FROM bookings 
      ${dateCondition} AND status != 'cancelled'
      GROUP BY booking_date
      ORDER BY booking_date DESC
    `,
      queryParams
    );

    const [summaryRows] = await db.promise().query(
      `
      SELECT 
        SUM(total_amount) as total_revenue,
        COUNT(*) as total_bookings,
        AVG(total_amount) as avg_revenue_per_booking
      FROM bookings 
      ${dateCondition} AND status != 'cancelled'
    `,
      queryParams
    );

    const summary =
      summaryRows[0] || {
        total_revenue: 0,
        total_bookings: 0,
        avg_revenue_per_booking: 0,
      };

    return {
      daily_data: results,
      summary,
    };
  },

  /**
   * Doanh thu theo sân (field)
   * params: { start_date, end_date }
   */
  getRevenueByField: async (params = {}) => {
    const { start_date, end_date } = params;

    let dateCondition = '';
    let queryParams = [];

    if (start_date && end_date) {
      dateCondition = 'AND b.booking_date BETWEEN ? AND ?';
      queryParams = [start_date, end_date];
    } else {
      dateCondition =
        'AND b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
      // không cần params vì dùng hàm DATE_SUB trực tiếp trong SQL
    }

    const [results] = await db.promise().query(
      `
      SELECT 
        f.id,
        f.name as field_name,
        f.type as field_type,
        COUNT(b.id) as total_bookings,
        SUM(b.total_amount) as total_revenue,
        AVG(b.total_amount) as avg_revenue_per_booking
      FROM fields f
      LEFT JOIN bookings b 
        ON f.id = b.field_id 
        AND b.status != 'cancelled' ${dateCondition}
      WHERE f.is_active = 1
      GROUP BY f.id, f.name, f.type
      ORDER BY total_revenue DESC
    `,
      queryParams
    );

    return results;
  },

  /**
   * Doanh thu theo tháng trong năm
   * params: { year }
   */
  getRevenueByMonth: async (params = {}) => {
    const { year } = params;
    const y = year || new Date().getFullYear();

    const [results] = await db.promise().query(
      `
      SELECT 
        MONTH(booking_date) as month,
        YEAR(booking_date) as year,
        SUM(total_amount) as monthly_revenue,
        COUNT(*) as monthly_bookings
      FROM bookings 
      WHERE YEAR(booking_date) = ? AND status != 'cancelled'
      GROUP BY YEAR(booking_date), MONTH(booking_date)
      ORDER BY month
    `,
      [y]
    );

    return results;
  },
};

module.exports = Revenue;
