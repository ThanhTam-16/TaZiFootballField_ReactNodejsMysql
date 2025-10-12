// backend/controllers/maintenanceController.js - FIXED VERSION
const db = require('../config/db');
const Maintenance = require('../models/Maintenance');

// =============== CUSTOMER MAINTENANCE APIs ===============
exports.getMaintenanceSchedule = async (req, res) => {
  try {
    const { field_id, date } = req.query;
    console.log('Getting maintenance schedule:', { field_id, date });
    
    if (field_id && date) {
      const schedules = await Maintenance.getByFieldAndDateAsync(field_id, date);
      res.json(schedules);
    } else {
      // If no specific field/date, return empty array
      res.json([]);
    }
  } catch (error) {
    console.error('Get maintenance schedule error:', error);
    res.status(500).json({ error: 'Lỗi lấy lịch bảo trì', details: error.message });
  }
};

exports.getActiveMaintenances = async (req, res) => {
  try {
    console.log('Getting active maintenances...');
    
    // FIXED: Use the correct method name
    const maintenances = await Maintenance.getActiveAsync();
    console.log('Active maintenances found:', maintenances.length);
    
    res.json(maintenances);
  } catch (error) {
    console.error('Get active maintenances error:', error);
    res.status(500).json({ error: 'Lỗi lấy lịch bảo trì đang hoạt động', details: error.message });
  }
};

// =============== ADMIN MAINTENANCE MANAGEMENT ===============
exports.getAllMaintenances = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const filters = {
      page,
      limit,
      search: req.query.search,
      field_id: req.query.field_id,
      status: req.query.status,
      type: req.query.type,
      date_filter: req.query.date_filter
    };
    
    // FIXED: Use the correct async method
    const result = await Maintenance.getAllWithFiltersAsync(filters);
    res.json(result);
    
  } catch (error) {
    console.error('Get maintenances error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách bảo trì', details: error.message });
  }
};

exports.createMaintenance = async (req, res) => {
  try {
    const {
      field_id,
      maintenance_date,
      start_time,
      end_time,
      reason,
      description,
      type = 'regular'
    } = req.body;
    
    if (!maintenance_date || !reason) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    
    if (field_id === 'all-fields') {
      const [fields] = await db.promise().query('SELECT id FROM fields WHERE is_active = 1');
      
      const promises = fields.map(field => {
        const data = {
          field_id: field.id,
          maintenance_date,
          start_time: start_time || '00:00:00',
          end_time: end_time || '23:59:59',
          reason,
          description,
          type
        };
        return Maintenance.createAsync(data);
      });
      
      await Promise.all(promises);
      res.status(201).json({ message: 'Đã tạo lịch bảo trì cho tất cả sân' });
      
    } else {
      const data = {
        field_id: field_id || null,
        maintenance_date,
        start_time: start_time || '00:00:00',
        end_time: end_time || '23:59:59',
        reason,
        description,
        type
      };
      
      const result = await Maintenance.createAsync(data);
      res.status(201).json({ 
        message: 'Đã tạo lịch bảo trì', 
        id: result.insertId 
      });
    }
    
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ error: 'Lỗi tạo lịch bảo trì', details: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await Maintenance.updateAsync(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json({ message: 'Cập nhật lịch bảo trì thành công' });
    
  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật lịch bảo trì', details: error.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Maintenance.softDeleteAsync(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json({ message: 'Xóa lịch bảo trì thành công' });
    
  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({ error: 'Lỗi xóa lịch bảo trì', details: error.message });
  }
};

exports.getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.getByIdAsync(id);
    
    if (!maintenance) {
      return res.status(404).json({ error: 'Không tìm thấy lịch bảo trì' });
    }
    
    res.json(maintenance);
    
  } catch (error) {
    console.error('Get maintenance detail error:', error);
    res.status(500).json({ error: 'Lỗi lấy chi tiết bảo trì', details: error.message });
  }
};

exports.getMaintenanceStats = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE 
          WHEN NOW() BETWEEN CONCAT(maintenance_date, ' ', COALESCE(start_time, '00:00:00')) 
               AND CONCAT(maintenance_date, ' ', COALESCE(end_time, '23:59:59')) 
          THEN 1 ELSE 0 END) as active,
        SUM(CASE 
          WHEN NOW() < CONCAT(maintenance_date, ' ', COALESCE(start_time, '00:00:00')) 
          THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE 
          WHEN NOW() > CONCAT(maintenance_date, ' ', COALESCE(end_time, '23:59:59')) 
          THEN 1 ELSE 0 END) as completed
      FROM maintenance_schedules 
      WHERE is_active = 1
    `);
    
    res.json(results[0]);
    
  } catch (error) {
    console.error('Get maintenance stats error:', error);
    res.status(500).json({ error: 'Lỗi lấy thống kê bảo trì', details: error.message });
  }
};