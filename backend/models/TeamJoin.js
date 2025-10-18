// backend/models/TeamJoin.js - FIXED VERSION
const db = require('../config/db');

const TeamJoin = {
  // =============== ASYNC METHODS (NEW) ===============
  createAsync: async (data) => {
    try {
      const sql = `
        INSERT INTO team_join_posts 
        (match_date, start_time, field_type, level, players_needed, position_needed, description, contact_name, contact_phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
      `;
      const values = [
        data.match_date,
        data.start_time,
        data.field_type,
        data.level || 'intermediate',
        data.players_needed,
        data.position_needed || 'any',
        data.description || '',
        data.contact_name,
        data.contact_phone
      ];
      
      const [result] = await db.promise().query(sql, values);
      return result;
    } catch (error) {
      console.error('Error in TeamJoin.createAsync:', error);
      throw error;
    }
  },

  listAsync: async (filter = {}) => {
    try {
      let sql = `SELECT * FROM team_join_posts WHERE status = 'open' AND match_date >= CURDATE()`;
      const values = [];

      if (filter.date) {
        sql += ' AND match_date = ?';
        values.push(filter.date);
      }
      if (filter.time) {
        sql += ' AND start_time = ?';
        values.push(filter.time);
      }
      if (filter.field_type) {
        sql += ' AND field_type = ?';
        values.push(filter.field_type);
      }
      if (filter.level) {
        sql += ' AND level = ?';
        values.push(filter.level);
      }
      if (filter.position_needed) {
        sql += ' AND position_needed = ?';
        values.push(filter.position_needed);
      }

      sql += ' ORDER BY match_date ASC, start_time ASC';
      
      const [results] = await db.promise().query(sql, values);
      return results;
    } catch (error) {
      console.error('Error in TeamJoin.listAsync:', error);
      throw error;
    }
  },

  getByIdAsync: async (id) => {
    try {
      const sql = 'SELECT * FROM team_join_posts WHERE id = ?';
      const [posts] = await db.promise().query(sql, [id]);
      return posts[0] || null;
    } catch (error) {
      console.error('Error in TeamJoin.getByIdAsync:', error);
      throw error;
    }
  },

  updateAsync: async (id, data) => {
    try {
      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) return;

      values.push(id);
      const sql = `UPDATE team_join_posts SET ${fields.join(', ')} WHERE id = ?`;
      
      const [result] = await db.promise().query(sql, values);
      return result;
    } catch (error) {
      console.error('Error in TeamJoin.updateAsync:', error);
      throw error;
    }
  },

  softDeleteAsync: async (id) => {
    try {
      const [result] = await db.promise().query(
        'UPDATE team_join_posts SET status = "closed" WHERE id = ?',
        [id]
      );
      return result;
    } catch (error) {
      console.error('Error in TeamJoin.softDeleteAsync:', error);
      throw error;
    }
  },

  // =============== CALLBACK METHODS (LEGACY) ===============
  create: (data, callback) => {
    if (callback) {
      const sql = `
        INSERT INTO team_join_posts 
        (match_date, start_time, field_type, level, players_needed, position_needed, description, contact_name, contact_phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
      `;
      const values = [
        data.match_date,
        data.start_time,
        data.field_type,
        data.level || 'intermediate',
        data.players_needed,
        data.position_needed || 'any',
        data.description || '',
        data.contact_name,
        data.contact_phone
      ];
      db.query(sql, values, callback);
      return;
    }
    
    // If no callback, return promise
    return TeamJoin.createAsync(data);
  },

  list: (filter = {}, callback) => {
    if (callback) {
      let sql = `SELECT * FROM team_join_posts WHERE status = 'open' AND match_date >= CURDATE()`;
      const values = [];

      if (filter.date) {
        sql += ' AND match_date = ?';
        values.push(filter.date);
      }
      if (filter.time) {
        sql += ' AND start_time = ?';
        values.push(filter.time);
      }
      if (filter.field_type) {
        sql += ' AND field_type = ?';
        values.push(filter.field_type);
      }
      if (filter.level) {
        sql += ' AND level = ?';
        values.push(filter.level);
      }
      if (filter.position_needed) {
        sql += ' AND position_needed = ?';
        values.push(filter.position_needed);
      }

      sql += ' ORDER BY match_date ASC, start_time ASC';
      db.query(sql, values, callback);
      return;
    }
    
    // If no callback, return promise
    return TeamJoin.listAsync(filter);
  },

  getById: (id, callback) => {
    if (callback) {
      const sql = 'SELECT * FROM team_join_posts WHERE id = ?';
      db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] || null);
      });
      return;
    }
    
    // If no callback, return promise
    return TeamJoin.getByIdAsync(id);
  },

  update: (id, data, callback) => {
    if (callback) {
      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) return callback(null, { affectedRows: 0 });

      values.push(id);
      const sql = `UPDATE team_join_posts SET ${fields.join(', ')} WHERE id = ?`;
      db.query(sql, values, callback);
      return;
    }
    
    // If no callback, return promise
    return TeamJoin.updateAsync(id, data);
  },

  softDelete: (id, callback) => {
    if (callback) {
      const sql = 'UPDATE team_join_posts SET status = "closed" WHERE id = ?';
      db.query(sql, [id], callback);
      return;
    }
    
    // If no callback, return promise
    return TeamJoin.softDeleteAsync(id);
  },

  // =============== ADMIN METHODS ===============
  getAllForAdmin: async (options) => {
    try {
      const { page, limit, status, field_type, date_from, date_to, search } = options;
      const offset = (page - 1) * limit;
      
      let sql = `
        SELECT * FROM team_join_posts
        WHERE 1=1
      `;
      const params = [];

      // Filters
      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }
      if (field_type) {
        sql += ' AND field_type = ?';
        params.push(field_type);
      }
      if (date_from) {
        sql += ' AND match_date >= ?';
        params.push(date_from);
      }
      if (date_to) {
        sql += ' AND match_date <= ?';
        params.push(date_to);
      }
      if (search) {
        sql += ' AND (contact_name LIKE ? OR contact_phone LIKE ? OR description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Count total
      const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
      const [countResult] = await db.promise().query(countSql, params);
      const total = countResult[0].total;

      // Get data with pagination
      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [posts] = await db.promise().query(sql, params);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in TeamJoin.getAllForAdmin:', error);
      throw error;
    }
  },

  getByIdForAdmin: async (id) => {
    try {
      const sql = 'SELECT * FROM team_join_posts WHERE id = ?';
      const [posts] = await db.promise().query(sql, [id]);
      return posts[0] || null;
    } catch (error) {
      console.error('Error in TeamJoin.getByIdForAdmin:', error);
      throw error;
    }
  },

  createByAdmin: async (data) => {
    try {
      const sql = `
        INSERT INTO team_join_posts 
        (match_date, start_time, field_type, level, players_needed, position_needed, 
         description, contact_name, contact_phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.match_date,
        data.start_time,
        data.field_type,
        data.level || 'intermediate',
        data.players_needed,
        data.position_needed || 'any',
        data.description || '',
        data.contact_name,
        data.contact_phone,
        data.status || 'open'
      ];
      
      const [result] = await db.promise().query(sql, values);
      return result;
    } catch (error) {
      console.error('Error in TeamJoin.createByAdmin:', error);
      throw error;
    }
  },

  updateByAdmin: async (id, data) => {
    try {
      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) return;

      values.push(id);
      const sql = `UPDATE team_join_posts SET ${fields.join(', ')} WHERE id = ?`;
      
      await db.promise().query(sql, values);
    } catch (error) {
      console.error('Error in TeamJoin.updateByAdmin:', error);
      throw error;
    }
  },

  deleteByAdmin: async (id) => {
    try {
      await db.promise().query('DELETE FROM team_join_posts WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error in TeamJoin.deleteByAdmin:', error);
      throw error;
    }
  },

  bulkUpdateStatus: async (postIds, status) => {
    try {
      if (!postIds || postIds.length === 0) return;
      
      const placeholders = postIds.map(() => '?').join(',');
      const sql = `UPDATE team_join_posts SET status = ? WHERE id IN (${placeholders})`;

      await db.promise().query(sql, [status, ...postIds]);
    } catch (error) {
      console.error('Error in TeamJoin.bulkUpdateStatus:', error);
      throw error;
    }
  },

  getAdminStats: async () => {
    try {
      const queries = [
        'SELECT COUNT(*) as total FROM team_join_posts',
        'SELECT COUNT(*) as open FROM team_join_posts WHERE status = "open"',
        'SELECT COUNT(*) as closed FROM team_join_posts WHERE status = "closed"',
        'SELECT COUNT(*) as today FROM team_join_posts WHERE match_date = CURDATE()',
        'SELECT COUNT(*) as this_week FROM team_join_posts WHERE YEARWEEK(match_date) = YEARWEEK(NOW())',
        'SELECT field_type, COUNT(*) as count FROM team_join_posts GROUP BY field_type',
        'SELECT position_needed, COUNT(*) as count FROM team_join_posts GROUP BY position_needed'
      ];

      const results = await Promise.all(
        queries.map(query => db.promise().query(query))
      );

      return {
        total: results[0][0][0].total,
        open: results[1][0][0].open,
        closed: results[2][0][0].closed,
        today: results[3][0][0].today,
        thisWeek: results[4][0][0].this_week,
        byFieldType: results[5][0],
        byPosition: results[6][0]
      };
    } catch (error) {
      console.error('Error in TeamJoin.getAdminStats:', error);
      throw error;
    }
  }
};

module.exports = TeamJoin;