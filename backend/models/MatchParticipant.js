// backend/models/MatchParticipant.js
const db = require('../config/db');

const MatchParticipant = {
  // =============== ASYNC METHODS ===============
  joinAsync: async (data) => {
    try {
      // Check if already joined
      const [existing] = await db.promise().query(
        'SELECT id FROM match_participants WHERE match_id = ? AND user_id = ?',
        [data.match_id, data.user_id]
      );

      if (existing.length > 0) {
        throw new Error('Bạn đã tham gia trận này rồi');
      }

      // Join the match
      const [result] = await db.promise().query(
        'INSERT INTO match_participants (match_id, user_id, joined_at) VALUES (?, ?, NOW())',
        [data.match_id, data.user_id]
      );

      return result;
    } catch (error) {
      console.error('Error in MatchParticipant.joinAsync:', error);
      throw error;
    }
  },

  leaveAsync: async (matchId, userId) => {
    try {
      const [result] = await db.promise().query(
        'DELETE FROM match_participants WHERE match_id = ? AND user_id = ?',
        [matchId, userId]
      );

      return result;
    } catch (error) {
      console.error('Error in MatchParticipant.leaveAsync:', error);
      throw error;
    }
  },

  listByMatchAsync: async (matchId) => {
    try {
      const [results] = await db.promise().query(`
        SELECT mp.*, u.name, u.phone_number, u.email
        FROM match_participants mp
        JOIN users u ON mp.user_id = u.id
        WHERE mp.match_id = ?
        ORDER BY mp.joined_at ASC
      `, [matchId]);

      return results;
    } catch (error) {
      console.error('Error in MatchParticipant.listByMatchAsync:', error);
      throw error;
    }
  },

  // =============== CALLBACK METHODS (LEGACY) ===============
  join: (data, callback) => {
    if (callback) {
      // Check if already joined
      db.query(
        'SELECT id FROM match_participants WHERE match_id = ? AND user_id = ?',
        [data.match_id, data.user_id],
        (err, existing) => {
          if (err) return callback(err);
          
          if (existing.length > 0) {
            return callback(new Error('Bạn đã tham gia trận này rồi'));
          }

          // Join the match
          db.query(
            'INSERT INTO match_participants (match_id, user_id, joined_at) VALUES (?, ?, NOW())',
            [data.match_id, data.user_id],
            callback
          );
        }
      );
      return;
    }
    
    // If no callback, return promise
    return MatchParticipant.joinAsync(data);
  },

  leave: (matchId, userId, callback) => {
    if (callback) {
      db.query(
        'DELETE FROM match_participants WHERE match_id = ? AND user_id = ?',
        [matchId, userId],
        callback
      );
      return;
    }
    
    // If no callback, return promise
    return MatchParticipant.leaveAsync(matchId, userId);
  },

  listByMatch: (matchId, callback) => {
    if (callback) {
      const sql = `
        SELECT mp.*, u.name, u.phone_number, u.email
        FROM match_participants mp
        JOIN users u ON mp.user_id = u.id
        WHERE mp.match_id = ?
        ORDER BY mp.joined_at ASC
      `;
      db.query(sql, [matchId], callback);
      return;
    }
    
    // If no callback, return promise
    return MatchParticipant.listByMatchAsync(matchId);
  }
};

module.exports = MatchParticipant;