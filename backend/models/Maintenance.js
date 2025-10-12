// backend/models/Maintenance.js - FIXED VERSION
const db = require('../config/db');

const Maintenance = {
  // =============== ASYNC METHODS (NEW) ===============
  createAsync: async (data) => {
    try {
      const [result] = await db.promise().query(`
        INSERT INTO maintenance_schedules
        (field_id, maintenance_date, start_time, end_time, reason, description, type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        data.field_id,
        data.maintenance_date,
        data.start_time || '00:00:00',
        data.end_time || '23:59:59',
        data.reason,
        data.description || null,
        data.type || 'regular'
      ]);
      return result;
    } catch (error) {
      console.error('Error in Maintenance.createAsync:', error);
      throw error;
    }
  },

  getByIdAsync: async (id) => {
    try {
      const [results] = await db.promise().query(`
        SELECT 
          m.*,
          f.name as field_name,
          f.type as field_type,
          CASE 
            WHEN NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) 
                 AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59')) THEN 'active'
            WHEN NOW() < CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) THEN 'upcoming'
            ELSE 'completed'
          END as status
        FROM maintenance_schedules m
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE m.id = ? AND m.is_active = 1
      `, [id]);
      return results[0] || null;
    } catch (error) {
      console.error('Error in Maintenance.getByIdAsync:', error);
      throw error;
    }
  },

  updateAsync: async (id, updateData) => {
    try {
      const [result] = await db.promise().query(`
        UPDATE maintenance_schedules 
        SET field_id = ?, maintenance_date = ?, start_time = ?, end_time = ?, 
            reason = ?, description = ?, type = ?, updated_at = NOW()
        WHERE id = ? AND is_active = 1
      `, [
        updateData.field_id,
        updateData.maintenance_date,
        updateData.start_time || '00:00:00',
        updateData.end_time || '23:59:59',
        updateData.reason,
        updateData.description,
        updateData.type || 'regular',
        id
      ]);
      return result;
    } catch (error) {
      console.error('Error in Maintenance.updateAsync:', error);
      throw error;
    }
  },

  softDeleteAsync: async (id) => {
    try {
      const [result] = await db.promise().query(
        'UPDATE maintenance_schedules SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [id]
      );
      return result;
    } catch (error) {
      console.error('Error in Maintenance.softDeleteAsync:', error);
      throw error;
    }
  },

  getByFieldAndDateAsync: async (fieldId, date) => {
    try {
      const [results] = await db.promise().query(`
        SELECT m.*, f.name as field_name, f.type as field_type
        FROM maintenance_schedules m
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE m.field_id = ? AND m.maintenance_date = ? AND m.is_active = 1 
        ORDER BY m.start_time
      `, [fieldId, date]);
      return results;
    } catch (error) {
      console.error('Error in Maintenance.getByFieldAndDateAsync:', error);
      throw error;
    }
  },

  getActiveAsync: async () => {
    try {
      const [results] = await db.promise().query(`
        SELECT m.*, f.name as field_name, f.type as field_type
        FROM maintenance_schedules m
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE m.is_active = 1
          AND NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00'))
                        AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59'))
        ORDER BY m.maintenance_date DESC
      `);
      return results;
    } catch (error) {
      console.error('Error in Maintenance.getActiveAsync:', error);
      throw error;
    }
  },

  getAllWithFiltersAsync: async (filters) => {
    try {
      const { page, limit, search, field_id, status, type, date_filter } = filters;
      const offset = (page - 1) * limit;
      
      let whereClause = 'WHERE m.is_active = 1';
      let params = [];
      
      if (search) {
        whereClause += ' AND (f.name LIKE ? OR m.reason LIKE ? OR m.description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (field_id && field_id !== 'all') {
        whereClause += ' AND m.field_id = ?';
        params.push(field_id);
      }
      
      if (type && type !== 'all') {
        whereClause += ' AND m.type = ?';
        params.push(type);
      }
      
      if (status && status !== 'all') {
        const now = new Date();
        switch (status) {
          case 'active':
            whereClause += ' AND ? BETWEEN CONCAT(m.maintenance_date, " ", COALESCE(m.start_time, "00:00:00")) AND CONCAT(m.maintenance_date, " ", COALESCE(m.end_time, "23:59:59"))';
            params.push(now.toISOString().slice(0, 19).replace('T', ' '));
            break;
          case 'upcoming':
            whereClause += ' AND CONCAT(m.maintenance_date, " ", COALESCE(m.start_time, "00:00:00")) > ?';
            params.push(now.toISOString().slice(0, 19).replace('T', ' '));
            break;
          case 'completed':
            whereClause += ' AND CONCAT(m.maintenance_date, " ", COALESCE(m.end_time, "23:59:59")) < ?';
            params.push(now.toISOString().slice(0, 19).replace('T', ' '));
            break;
        }
      }
      
      if (date_filter && date_filter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        switch (date_filter) {
          case 'today':
            whereClause += ' AND m.maintenance_date = ?';
            params.push(today.toISOString().split('T')[0]);
            break;
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            whereClause += ' AND m.maintenance_date = ?';
            params.push(tomorrow.toISOString().split('T')[0]);
            break;
          case 'week':
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);
            whereClause += ' AND m.maintenance_date BETWEEN ? AND ?';
            params.push(today.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]);
            break;
          case 'month':
            const monthEnd = new Date(today);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            whereClause += ' AND m.maintenance_date BETWEEN ? AND ?';
            params.push(today.toISOString().split('T')[0], monthEnd.toISOString().split('T')[0]);
            break;
        }
      }
      
      const sql = `
        SELECT 
          m.*,
          f.name as field_name,
          f.type as field_type,
          CASE 
            WHEN NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) 
                 AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59')) THEN 'active'
            WHEN NOW() < CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00')) THEN 'upcoming'
            ELSE 'completed'
          END as status
        FROM maintenance_schedules m
        LEFT JOIN fields f ON m.field_id = f.id
        ${whereClause}
        ORDER BY m.maintenance_date DESC, m.start_time DESC
        LIMIT ? OFFSET ?
      `;
      
      const countSql = `
        SELECT COUNT(*) as total
        FROM maintenance_schedules m
        LEFT JOIN fields f ON m.field_id = f.id
        ${whereClause}
      `;
      
      const [results] = await db.promise().query(sql, [...params, limit, offset]);
      const [countResult] = await db.promise().query(countSql, params);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in Maintenance.getAllWithFiltersAsync:', error);
      throw error;
    }
  },

  // =============== CALLBACK METHODS (LEGACY) - FIXED ===============
  create: (data, callback) => {
    if (callback) {
      const sql = `
        INSERT INTO maintenance_schedules
        (field_id, maintenance_date, start_time, end_time, reason, description, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.field_id,
        data.maintenance_date,
        data.start_time || '00:00:00',
        data.end_time || '23:59:59',
        data.reason,
        data.description || null,
        data.type || 'regular'
      ];
      db.query(sql, values, callback);
      return;
    }
    
    // If no callback, use async version
    return Maintenance.createAsync(data);
  },

  listAll: (callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.is_active = 1 
      ORDER BY m.maintenance_date DESC
    `;
    db.query(sql, callback);
  },

  listByField: (fieldId, callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.field_id = ? AND m.is_active = 1 
      ORDER BY m.maintenance_date DESC
    `;
    db.query(sql, [fieldId], callback);
  },

  findById: (id, callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.id = ? AND m.is_active = 1
    `;
    db.query(sql, [id], callback);
  },

  update: (id, data, callback) => {
    if (callback) {
      const sql = `
        UPDATE maintenance_schedules 
        SET field_id = ?, maintenance_date = ?, start_time = ?, end_time = ?, 
            reason = ?, description = ?, type = ?, updated_at = NOW()
        WHERE id = ? AND is_active = 1
      `;
      const values = [
        data.field_id,
        data.maintenance_date,
        data.start_time || '00:00:00',
        data.end_time || '23:59:59',
        data.reason,
        data.description,
        data.type || 'regular',
        id
      ];
      db.query(sql, values, callback);
      return;
    }
    
    // If no callback, use async version
    return Maintenance.updateAsync(id, data);
  },

  delete: (id, callback) => {
    const sql = 'UPDATE maintenance_schedules SET is_active = 0 WHERE id = ?';
    db.query(sql, [id], callback);
  },

  checkFieldMaintenance: (fieldId, date, startTime, endTime, callback) => {
    const sql = `
      SELECT COUNT(*) as count
      FROM maintenance_schedules 
      WHERE field_id = ? 
        AND maintenance_date = ?
        AND is_active = 1
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
    `;
    db.query(sql, [fieldId, date, startTime, startTime, endTime, endTime, startTime, endTime], callback);
  },

  getActiveMaintenances: (callback) => {
    const sql = `
      SELECT m.*, f.name as field_name, f.type as field_type
      FROM maintenance_schedules m
      LEFT JOIN fields f ON m.field_id = f.id
      WHERE m.is_active = 1
        AND NOW() BETWEEN CONCAT(m.maintenance_date, ' ', COALESCE(m.start_time, '00:00:00'))
                      AND CONCAT(m.maintenance_date, ' ', COALESCE(m.end_time, '23:59:59'))
      ORDER BY m.maintenance_date DESC
    `;
    db.query(sql, callback);
  }
};

module.exports = Maintenance;