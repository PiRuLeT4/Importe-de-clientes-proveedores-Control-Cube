import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this file and go up one level to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from project root
const envPath = join(projectRoot, '.env');
dotenv.config({ path: envPath });

import { testConnection, closePool } from './database/connection.js';
import { fetchClients } from './services/clientService.js';
import { fetchSuppliers } from './services/supplierService.js';

/**
 * Test script to check country detection in the database
 */
async function testCountryDetection() {
  console.log('🔍 Testing Country Detection...\n');
  
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed. Check your .env configuration.');
    }
    console.log('');

    // Fetch and analyze clients
    console.log('═══════════════════════════════════════');
    console.log('📊 ANALYZING CLIENTS');
    console.log('═══════════════════════════════════════');
    const clients = await fetchClients();
    console.log(`\nTotal clients: ${clients.length}`);
    
    // Show sample data
    console.log('\n📋 Sample client data (first 5):');
    clients.slice(0, 5).forEach((client, index) => {
      console.log(`\n${index + 1}. ${client.nombre_comercial || 'N/A'}`);
      console.log(`   Localidad: ${client.localidad || 'N/A'}`);
      console.log(`   Provincia: ${client.provincia || 'N/A'}`);
      console.log(`   País detectado: ${client.pais || 'N/A'}`);
    });

    console.log('\n');
    console.log('═══════════════════════════════════════');
    console.log('📊 ANALYZING SUPPLIERS');
    console.log('═══════════════════════════════════════');
    const suppliers = await fetchSuppliers();
    console.log(`\nTotal suppliers: ${suppliers.length}`);
    
    // Show sample data
    console.log('\n📋 Sample supplier data (first 5):');
    suppliers.slice(0, 5).forEach((supplier, index) => {
      console.log(`\n${index + 1}. ${supplier.nombre || 'N/A'}`);
      console.log(`   Localidad: ${supplier.localidad || 'N/A'}`);
      console.log(`   Provincia: ${supplier.provincia || 'N/A'}`);
      console.log(`   País detectado: ${supplier.pais || 'N/A'}`);
    });

    console.log('\n');
    console.log('═══════════════════════════════════════');
    console.log('✅ TEST COMPLETED');
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

// Execute test
testCountryDetection();
