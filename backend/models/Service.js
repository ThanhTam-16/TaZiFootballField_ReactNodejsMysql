// backend/models/Service.js - Model hoàn chỉnh
const db = require('../config/db');

const Service = {
  // =============== PROMISE METHODS (mới) ===============
  getAll: async () => {
    const [results] = await db.promise().query(
      `SELECT * FROM services WHERE is_active = 1 ORDER BY category, name`
    );
    return results;
  },

  getByCategory: async (category) => {
    const [results] = await db.promise().query(
      `SELECT * FROM services WHERE category = ? AND is_active = 1 ORDER BY name`,
      [category]
    );
    return results;
  },

  getById: async (id) => {
    const [results] = await db.promise().query(
      `SELECT * FROM services WHERE id = ? AND is_active = 1`,
      [id]
    );
    return results[0] || null;
  },

  create: async (serviceData) => {
    const [result] = await db.promise().query(`
      INSERT INTO services (name, category, price, description, is_available, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      serviceData.name,
      serviceData.category,
      serviceData.price,
      serviceData.description || '',
      serviceData.is_available !== undefined ? serviceData.is_available : true
    ]);
    return result;
  },

  update: async (id, updateData) => {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(id);
    const [result] = await db.promise().query(
      `UPDATE services SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    return result;
  },

  softDelete: async (id) => {
    const [result] = await db.promise().query(
      `UPDATE services SET is_active = 0, updated_at = NOW() WHERE id = ?`,
      [id]
    );
    return result;
  },

  getStats: async () => {
    const [stats] = await db.promise().query(`
      SELECT 
        COUNT(*) as total_services,
        SUM(CASE WHEN is_available = 1 THEN 1 ELSE 0 END) as available_services,
        SUM(CASE WHEN is_available = 0 THEN 1 ELSE 0 END) as unavailable_services,
        COUNT(DISTINCT category) as categories_count,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM services 
      WHERE is_active = 1
    `);
    return stats[0];
  },

  getCategories: async () => {
    const [results] = await db.promise().query(`
      SELECT DISTINCT category, COUNT(*) as service_count
      FROM services 
      WHERE is_active = 1 
      GROUP BY category 
      ORDER BY category
    `);
    return results;
  },

  updateAvailability: async (id, isAvailable) => {
    const [result] = await db.promise().query(
      `UPDATE services SET is_available = ?, updated_at = NOW() WHERE id = ?`,
      [isAvailable, id]
    );
    return result;
  },

  // =============== CALLBACK METHODS (legacy) ===============
  getAll: (callback) => {
    if (callback) {
      const sql = `SELECT * FROM services WHERE is_active = 1 ORDER BY category`;
      db.query(sql, callback);
      return;
    }
    
    // Promise version
    return Service.getAll();
  },

  getByCategory: (category, callback) => {
    if (callback) {
      const sql = `SELECT * FROM services WHERE category = ? AND is_active = 1`;
      db.query(sql, [category], callback);
      return;
    }
    
    // Promise version
    return Service.getByCategory(category);
  },

  // =============== UTILITY METHODS ===============
  searchServices: async (searchTerm) => {
    const [results] = await db.promise().query(`
      SELECT * FROM services 
      WHERE is_active = 1 AND (
        name LIKE ? OR 
        category LIKE ? OR 
        description LIKE ?
      )
      ORDER BY name
    `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
    return results;
  },

  getPopularServices: async (limit = 10) => {
    // Giả sử có bảng booking_services để track việc sử dụng dịch vụ
    try {
      const [results] = await db.promise().query(`
        SELECT s.*, COUNT(bs.service_id) as usage_count
        FROM services s
        LEFT JOIN booking_services bs ON s.id = bs.service_id
        WHERE s.is_active = 1
        GROUP BY s.id
        ORDER BY usage_count DESC, s.name
        LIMIT ?
      `, [limit]);
      return results;
    } catch (error) {
      // Nếu chưa có bảng booking_services, trả về tất cả services
      return await Service.getAll();
    }
  }
};

module.exports = Service;