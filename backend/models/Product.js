// backend/models/Product.js
const db = require('../config/db');
const { promisify } = require('util');

// Convert callback to promise
const query = promisify(db.query).bind(db);

class Product {
  static async getAll(filters = {}) {
    let sql = `
      SELECT p.*, 
             CASE 
               WHEN p.current_stock = 0 THEN 'out-of-stock'
               WHEN p.current_stock <= p.min_stock THEN 'low-stock'
               ELSE 'in-stock'
             END as stock_status
      FROM products p 
      WHERE p.is_active = 1
    `;
    const params = [];

    if (filters.search) {
      sql += ` AND (p.name LIKE ? OR p.code LIKE ? OR p.supplier LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.category && filters.category !== 'all') {
      sql += ` AND p.category = ?`;
      params.push(filters.category);
    }

    if (filters.stock_status && filters.stock_status !== 'all') {
      if (filters.stock_status === 'out-of-stock') {
        sql += ` AND p.current_stock = 0`;
      } else if (filters.stock_status === 'low-stock') {
        sql += ` AND p.current_stock > 0 AND p.current_stock <= p.min_stock`;
      } else if (filters.stock_status === 'in-stock') {
        sql += ` AND p.current_stock > p.min_stock`;
      }
    }

    sql += ` ORDER BY p.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(filters.limit));
    }

    try {
      const rows = await query(sql, params);
      console.log('DB query result - rows count:', rows?.length || 0);
      return rows || [];
    } catch (error) {
      console.error('Database error in getAll:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const rows = await query(`
        SELECT p.*, 
               CASE 
                 WHEN p.current_stock = 0 THEN 'out-of-stock'
                 WHEN p.current_stock <= p.min_stock THEN 'low-stock'
                 ELSE 'in-stock'
               END as stock_status
        FROM products p 
        WHERE p.id = ?
      `, [id]);
      
      return rows?.[0] || null;
    } catch (error) {
      console.error('Database error in getById:', error);
      throw error;
    }
  }

  static async create(productData) {
    const {
      code, name, category, unit, purchase_price, selling_price,
      current_stock = 0, min_stock = 10, supplier, description
    } = productData;

    try {
      const result = await query(`
        INSERT INTO products (
          code, name, category, unit, purchase_price, selling_price,
          current_stock, min_stock, supplier, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [code, name, category, unit, purchase_price, selling_price, current_stock, min_stock, supplier, description]);

      return result.insertId;
    } catch (error) {
      console.error('Database error in create:', error);
      throw error;
    }
  }

  static async update(id, productData) {
    const {
      code, name, category, unit, purchase_price, selling_price,
      current_stock, min_stock, supplier, description
    } = productData;

    try {
      await query(`
        UPDATE products SET
          code = ?, name = ?, category = ?, unit = ?,
          purchase_price = ?, selling_price = ?, current_stock = ?,
          min_stock = ?, supplier = ?, description = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [code, name, category, unit, purchase_price, selling_price, current_stock, min_stock, supplier, description, id]);

      return true;
    } catch (error) {
      console.error('Database error in update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Database error in delete:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const stats = await query(`
        SELECT 
          COUNT(*) as total_products,
          COALESCE(SUM(current_stock), 0) as total_stock,
          COALESCE(SUM(current_stock * purchase_price), 0) as total_value,
          SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock,
          SUM(CASE WHEN current_stock > 0 AND current_stock <= min_stock THEN 1 ELSE 0 END) as low_stock
        FROM products 
        WHERE is_active = 1
      `);

      // Try to get transactions, but don't fail if table doesn't exist
      let todayTransactions = 0;
      try {
        const transactions = await query(`
          SELECT COUNT(*) as today_transactions
          FROM stock_transactions 
          WHERE DATE(created_at) = CURDATE()
        `);
        todayTransactions = transactions[0]?.today_transactions || 0;
      } catch (err) {
        console.log('No stock_transactions table yet, defaulting to 0');
      }

      console.log('Stats result:', stats?.[0]);

      return {
        ...stats[0],
        today_transactions: todayTransactions
      };
    } catch (error) {
      console.error('Database error in getStats:', error);
      throw error;
    }
  }

  static async updateStock(productId, quantity, type = 'import') {
    try {
      const product = await this.getById(productId);
      if (!product) throw new Error('Product not found');

      let newStock;
      if (type === 'import') {
        newStock = product.current_stock + quantity;
      } else {
        newStock = Math.max(0, product.current_stock - quantity);
      }

      await query(
        'UPDATE products SET current_stock = ? WHERE id = ?',
        [newStock, productId]
      );

      return newStock;
    } catch (error) {
      console.error('Database error in updateStock:', error);
      throw error;
    }
  }
}

module.exports = Product;