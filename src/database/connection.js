import mysql from 'mysql2/promise';
import { getDbConfig } from '../../config/database.config.js';

let pool = null;

/**
 * Get or create MySQL connection pool
 * @returns {Promise<mysql.Pool>}
 */
export async function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(getDbConfig());
      console.log('✅ MySQL connection pool created successfully');
    } catch (error) {
      console.error('❌ Error creating MySQL pool:', error.message);
      throw error;
    }
  }
  return pool;
}

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
  try {
    const connection = await (await getPool()).getConnection();
    console.log('✅ Database connection test successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

/**
 * Close database connection pool
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ MySQL connection pool closed');
  }
}
