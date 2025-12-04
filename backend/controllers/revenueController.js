// backend/controllers/revenueController.js
const Revenue = require('../models/Revenue');

// GET /api/admin/revenue?period=7&start_date=...&end_date=...
exports.getRevenue = async (req, res) => {
  try {
    const data = await Revenue.getRevenue(req.query);
    res.json(data);
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Lỗi lấy báo cáo doanh thu' });
  }
};

// GET /api/admin/revenue/by-field?start_date=...&end_date=...
exports.getRevenueByField = async (req, res) => {
  try {
    const results = await Revenue.getRevenueByField(req.query);
    res.json(results);
  } catch (error) {
    console.error('Get revenue by field error:', error);
    res.status(500).json({ error: 'Lỗi lấy doanh thu theo sân' });
  }
};

// GET /api/admin/revenue/by-month?year=2025
exports.getRevenueByMonth = async (req, res) => {
  try {
    const results = await Revenue.getRevenueByMonth(req.query);
    res.json(results);
  } catch (error) {
    console.error('Get revenue by month error:', error);
    res.status(500).json({ error: 'Lỗi lấy doanh thu theo tháng' });
  }
};
