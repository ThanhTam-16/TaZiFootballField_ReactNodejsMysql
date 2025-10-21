// backend/models/Match.js - FIXED VERSION
const db = require('../config/db');

const Match = {
  // =============== ASYNC METHODS (NEW) ===============
  createAsync: async (data) => {
    try {
      const sql = `
        INSERT INTO matches 
        (creator_id, field_id, field_type, match_date, start_time, end_time, level, age_min, age_max, price_per_person, description, contact_name, contact_phone, allow_join)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.creator_id,
        data.field_id,
        data.field_type,
        data.match_date,
        data.start_time,
        data.end_time,
        data.level || 'intermediate',
        data.age_min || null,
        data.age_max || null,
        data.price_per_person || 0,
        data.description || '',
        data.contact_name,
        data.contact_phone,
        data.allow_join !== false ? 1 : 0
      ];
      
      const [result] = await db.promise().query(sql, values);
      return result;
    } catch (error) {
      console.error('Error in Match.createAsync:', error);
      throw error;
    }
  },

  listOpenMatchesAsync: async (filter = {}) => {
    try {
      let sql = `
        SELECT m.*, f.name as field_name 
        FROM matches m
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE m.status = 'open' AND m.match_date >= CURDATE()
      `;
      const params = [];

      if (filter.date) {
        sql += ' AND m.match_date = ?';
        params.push(filter.date);
      }
      if (filter.time) {
        sql += ' AND m.start_time = ?';
        params.push(filter.time);
      }
      if (filter.type) {
        sql += ' AND m.field_type = ?';
        params.push(filter.type);
      }
      if (filter.level) {
        sql += ' AND m.level = ?';
        params.push(filter.level);
      }

      sql += ' ORDER BY m.match_date ASC, m.start_time ASC';
      
      const [results] = await db.promise().query(sql, params);
      return results;
    } catch (error) {
      console.error('Error in Match.listOpenMatchesAsync:', error);
      throw error;
    }
  },

  // =============== CALLBACK METHODS (LEGACY) ===============
  create: (data, callback) => {
    if (callback) {
      const sql = `
        INSERT INTO matches 
        (creator_id, field_id, field_type, match_date, start_time, end_time, level, age_min, age_max, price_per_person, description, contact_name, contact_phone, allow_join)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.creator_id,
        data.field_id,
        data.field_type,
        data.match_date,
        data.start_time,
        data.end_time,
        data.level || 'intermediate',
        data.age_min || null,
        data.age_max || null,
        data.price_per_person || 0,
        data.description || '',
        data.contact_name,
        data.contact_phone,
        data.allow_join !== false ? 1 : 0
      ];
      db.query(sql, values, callback);
      return;
    }
    
    // If no callback, return promise
    return Match.createAsync(data);
  },

  listOpenMatches: (filter = {}, callback) => {
    if (callback) {
      let sql = `
        SELECT m.*, f.name as field_name 
        FROM matches m
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE m.status = 'open' AND m.match_date >= CURDATE()
      `;
      const params = [];

      if (filter.date) {
        sql += ' AND m.match_date = ?';
        params.push(filter.date);
      }
      if (filter.time) {
        sql += ' AND m.start_time = ?';
        params.push(filter.time);
      }
      if (filter.type) {
        sql += ' AND m.field_type = ?';
        params.push(filter.type);
      }
      if (filter.level) {
        sql += ' AND m.level = ?';
        params.push(filter.level);
      }

      sql += ' ORDER BY m.match_date ASC, m.start_time ASC';
      db.query(sql, params, callback);
      return;
    }
    
    // If no callback, return promise
    return Match.listOpenMatchesAsync(filter);
  },

  // =============== ADMIN METHODS ===============
  getAllForAdmin: async (options) => {
    try {
      const { page, limit, status, field_type, date_from, date_to, search } = options;
      const offset = (page - 1) * limit;
      
      let sql = `
        SELECT m.*, u.name as creator_name, u.phone_number as creator_phone, f.name as field_name
        FROM matches m
        LEFT JOIN users u ON m.creator_id = u.id
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE 1=1
      `;
      const params = [];

      // Filters
      if (status) {
        sql += ' AND m.status = ?';
        params.push(status);
      }
      if (field_type) {
        sql += ' AND m.field_type = ?';
        params.push(field_type);
      }
      if (date_from) {
        sql += ' AND m.match_date >= ?';
        params.push(date_from);
      }
      if (date_to) {
        sql += ' AND m.match_date <= ?';
        params.push(date_to);
      }
      if (search) {
        sql += ' AND (m.contact_name LIKE ? OR m.contact_phone LIKE ? OR m.description LIKE ? OR u.name LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Count total
      const countSql = sql.replace('SELECT m.*, u.name as creator_name, u.phone_number as creator_phone, f.name as field_name', 'SELECT COUNT(*) as total');
      const [countResult] = await db.promise().query(countSql, params);
      const total = countResult[0].total;

      // Get data with pagination
      sql += ' ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [matches] = await db.promise().query(sql, params);

      return {
        data: matches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in Match.getAllForAdmin:', error);
      throw error;
    }
  },

  getByIdForAdmin: async (id) => {
    try {
      const sql = `
        SELECT m.*, u.name as creator_name, u.phone_number as creator_phone, 
               u.email as creator_email, f.name as field_name
        FROM matches m
        LEFT JOIN users u ON m.creator_id = u.id
        LEFT JOIN fields f ON m.field_id = f.id
        WHERE m.id = ?
      `;
      const [matches] = await db.promise().query(sql, [id]);
      return matches[0] || null;
    } catch (error) {
      console.error('Error in Match.getByIdForAdmin:', error);
      throw error;
    }
  },

  createByAdmin: async (data) => {
    try {
      const sql = `
        INSERT INTO matches 
        (creator_id, field_id, field_type, match_date, start_time, end_time, 
         current_players, max_players, level, age_min, age_max, price_per_person, 
         description, contact_name, contact_phone, allow_join, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.creator_id || null,
        data.field_id || null,
        data.field_type,
        data.match_date,
        data.start_time,
        data.end_time,
        data.current_players || 1,
        data.max_players || 0,
        data.level || 'intermediate',
        data.age_min || null,
        data.age_max || null,
        data.price_per_person,
        data.description || '',
        data.contact_name,
        data.contact_phone,
        data.allow_join !== false ? 1 : 0,
        data.status || 'open'
      ];
      
      const [result] = await db.promise().query(sql, values);
      return result;
    } catch (error) {
      console.error('Error in Match.createByAdmin:', error);
      throw error;
    }
  },

  updateByAdmin: async (id, data) => {
    try {
      // Only allow known/allowed columns to avoid SQL errors from unknown frontend fields
      const allowed = new Set([
        'creator_id', 'field_id', 'field_type', 'match_date', 'start_time', 'end_time',
        'current_players', 'max_players', 'level', 'age_min', 'age_max', 'price_per_person',
        'description', 'contact_name', 'contact_phone', 'allow_join', 'status'
      ]);

      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (allowed.has(key) && data[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) return; // nothing to update after filtering

      values.push(id);
      const sql = `UPDATE matches SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await db.promise().query(sql, values);
    } catch (error) {
      console.error('Error in Match.updateByAdmin:', error);
      throw error;
    }
  },

  deleteByAdmin: async (id) => {
    try {
      await db.promise().query('DELETE FROM matches WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error in Match.deleteByAdmin:', error);
      throw error;
    }
  },

  bulkUpdateStatus: async (matchIds, status) => {
    try {
      if (!matchIds || matchIds.length === 0) return;
      
      const placeholders = matchIds.map(() => '?').join(',');
      const sql = `UPDATE matches SET status = ?, updated_at = NOW() WHERE id IN (${placeholders})`;
      
      await db.promise().query(sql, [status, ...matchIds]);
    } catch (error) {
      console.error('Error in Match.bulkUpdateStatus:', error);
      throw error;
    }
  },

  getAdminStats: async () => {
    try {
      const queries = [
        'SELECT COUNT(*) as total FROM matches',
        'SELECT COUNT(*) as open FROM matches WHERE status = "open"',
        'SELECT COUNT(*) as completed FROM matches WHERE status = "completed"',
        'SELECT COUNT(*) as today FROM matches WHERE match_date = CURDATE()',
        'SELECT COUNT(*) as this_week FROM matches WHERE YEARWEEK(match_date) = YEARWEEK(NOW())',
        'SELECT field_type, COUNT(*) as count FROM matches GROUP BY field_type'
      ];

      const results = await Promise.all(
        queries.map(query => db.promise().query(query))
      );

      return {
        total: results[0][0][0].total,
        open: results[1][0][0].open,
        completed: results[2][0][0].completed,
        today: results[3][0][0].today,
        thisWeek: results[4][0][0].this_week,
        byFieldType: results[5][0]
      };
    } catch (error) {
      console.error('Error in Match.getAdminStats:', error);
      throw error;
    }
  }
};

module.exports = Match;