// Environment variables are loaded in src/index.js
// Using getter functions to ensure env vars are read AFTER dotenv loads

export function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

export function getCsvConfig() {
  return {
    outputDir: process.env.OUTPUT_DIR || './output',
    filename: process.env.CSV_FILENAME || 'clientes_facturadirecta.csv'
  };
}
