// backend/config/db.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const isAiven = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');

console.log(`🔍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔍 Database Host: ${process.env.DB_HOST}`);
console.log(`🔍 Is Aiven: ${isAiven}`);

// Cấu hình SSL chỉ cho Aiven
let sslConfig = null;
if (isAiven) {
  try {
    const caCert = fs.readFileSync(path.join(__dirname, 'ca.pem'));
    sslConfig = { 
      ca: caCert,
      rejectUnauthorized: true
    };
    console.log('✅ SSL certificate loaded for Aiven');
  } catch (error) {
    console.error('❌ SSL certificate not found for Aiven:', error.message);
  }
} else {
  console.log('ℹ️ Local development - No SSL required');
}

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+07:00'
};

// Chỉ thêm SSL config nếu là Aiven
if (sslConfig) {
  poolConfig.ssl = sslConfig;
}

// Xóa option 'reconnect' vì không được hỗ trợ
const pool = mysql.createPool(poolConfig);

// Test connection với error handling chi tiết
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
    console.error('📍 Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      isAiven: isAiven
    });
  } else {
    console.log(`✅ Đã kết nối MySQL thành công! (${isAiven ? 'Aiven' : 'Local'})`);
    connection.release();
  }
});

// Export pool với promise support
module.exports = pool;