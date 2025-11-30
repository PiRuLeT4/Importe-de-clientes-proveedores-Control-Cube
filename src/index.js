import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this file and go up one level to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from project root
const envPath = join(projectRoot, '.env');
console.log('🔍 Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Debug: Show what was loaded (hide password)
console.log('📋 Environment variables loaded:');
console.log('   DB_HOST:', process.env.DB_HOST || '(not set)');
console.log('   DB_PORT:', process.env.DB_PORT || '(not set)');
console.log('   DB_USER:', process.env.DB_USER || '(not set)');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(not set)');
console.log('   DB_NAME:', process.env.DB_NAME || '(not set)');
console.log('');

import { testConnection, closePool } from './database/connection.js';
import { fetchClients } from './services/clientService.js';
import { mapClientsToFacturaDirecta } from './utils/csvMapper.js';
import { generateCSV, validateClients } from './services/csvService.js';

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting FacturaDirecta CSV Export...\n');
  
  try {
    // Step 1: Test database connection
    console.log('📡 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed. Check your .env configuration.');
    }
    console.log('');

    // Step 2: Fetch clients from database
    console.log('📥 Fetching clients from database...');
    const clients = await fetchClients();
    
    if (clients.length === 0) {
      console.log('⚠️  No clients found in database.');
      return;
    }
    console.log('');

    // Step 3: Map data to FacturaDirecta format
    console.log('🔄 Mapping data to FacturaDirecta format...');
    const mappedClients = mapClientsToFacturaDirecta(clients);
    console.log(`✅ Mapped ${mappedClients.length} clients`);
    console.log('');

    // Step 4: Validate data
    console.log('✔️  Validating client data...');
    const validation = validateClients(mappedClients);
    
    if (!validation.isValid) {
      console.log('⚠️  Validation warnings:');
      validation.errors.forEach(error => console.log(`   - ${error}`));
      console.log('');
    } else {
      console.log('✅ All records validated successfully');
      console.log('');
    }

    // Step 5: Generate CSV file(s)
    console.log('📝 Generating CSV file(s)...');
    const outputPaths = await generateCSV(mappedClients);
    console.log('');

    // Success summary
    console.log('═══════════════════════════════════════');
    console.log('✅ EXPORT COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════');
    console.log(`📄 Files generated: ${outputPaths.length}`);
    outputPaths.forEach((path, index) => {
      console.log(`   ${index + 1}. ${path}`);
    });
    console.log(`📊 Total records: ${validation.totalRecords}`);
    console.log(`✅ Valid records: ${validation.validRecords}`);
    if (validation.errors.length > 0) {
      console.log(`⚠️  Warnings: ${validation.errors.length}`);
    }
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    await closePool();
  }
}

// Execute main function
main();
