// db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
  } else {
    console.log('✅ Đã kết nối MySQL thành công!');
    connection.release();
  }
});

// Export pool gốc (chưa .promise)
module.exports = pool;