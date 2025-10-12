// backend/models/StockTransaction.js
const db = require('../config/db');
const { promisify } = require('util');

// Convert callback to promise
const query = promisify(db.query).bind(db);

class StockTransaction {
  static async getAll(filters = {}) {
    let sql = `
      SELECT st.*, p.name as product_name, p.code as product_code,
             a.name as created_by_name
      FROM stock_transactions st
      LEFT JOIN products p ON st.product_id = p.id
      LEFT JOIN admins a ON st.created_by = a.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type && filters.type !== 'all') {
      sql += ` AND st.type = ?`;
      params.push(filters.type);
    }

    if (filters.product_id) {
      sql += ` AND st.product_id = ?`;
      params.push(filters.product_id);
    }

    if (filters.start_date) {
      sql += ` AND st.transaction_date >= ?`;
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      sql += ` AND st.transaction_date <= ?`;
      params.push(filters.end_date);
    }

    sql += ` ORDER BY st.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, params);
      return rows || [];
    } catch (error) {
      console.error('Database error in StockTransaction.getAll:', error);
      throw error;
    }
  }

  static async create(transactionData) {
    const {
      product_id, type, quantity, price, transaction_date,
      reference, notes, created_by
    } = transactionData;

    const total_amount = quantity * price;

    try {
      const result = await query(`
        INSERT INTO stock_transactions (
          product_id, type, quantity, price, total_amount,
          transaction_date, reference, notes, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [product_id, type, quantity, price, total_amount, transaction_date, reference, notes, created_by]);

      return result.insertId;
    } catch (error) {
      console.error('Database error in StockTransaction.create:', error);
      throw error;
    }
  }

  static async getRecentHistory(limit = 10) {
    try {
      const rows = await query(`
        SELECT st.*, p.name as product_name, p.code as product_code,
               a.name as created_by_name
        FROM stock_transactions st
        LEFT JOIN products p ON st.product_id = p.id
        LEFT JOIN admins a ON st.created_by = a.id
        ORDER BY st.created_at DESC
        LIMIT ?
      `, [limit]);

      return rows || [];
    } catch (error) {
      console.error('Database error in StockTransaction.getRecentHistory:', error);
      throw error;
    }
  }
}

module.exports = StockTransaction;