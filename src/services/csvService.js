import { createObjectCsvWriter } from 'csv-writer';
import { getCsvConfig } from '../../config/database.config.js';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate CSV file(s) from client data
 * Splits data into multiple files if more than 1000 records
 * @param {Array} clients - Array of mapped client objects
 * @returns {Promise<Array<string>>} Array of paths to generated CSV files
 */
export async function generateCSV(clients) {
  try {
    const csvConfig = getCsvConfig();
    const MAX_RECORDS_PER_FILE = 1000;
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), csvConfig.outputDir);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }

    // Generate timestamp for all files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Define CSV headers (FacturaDirecta format)
    const headers = [
      { id: 'Cliente - NIF', title: 'Cliente - NIF' },
      { id: 'Cliente - Nombre', title: 'Cliente - Nombre' },
      { id: 'Cliente - Apellidos', title: 'Cliente - Apellidos' },
      { id: 'Cliente - Nombre comercial', title: 'Cliente - Nombre comercial' },
      { id: 'Cliente - Código cliente', title: 'Cliente - Código cliente' },
      { id: 'Cliente - No acepta facturas electrónicas', title: 'Cliente - No acepta facturas electrónicas' },
      { id: 'Cliente - Dirección 1', title: 'Cliente - Dirección 1' },
      { id: 'Cliente - Dirección 2', title: 'Cliente - Dirección 2' },
      { id: 'Cliente - Localidad', title: 'Cliente - Localidad' },
      { id: 'Cliente - Provincia', title: 'Cliente - Provincia' },
      { id: 'Cliente - Código postal', title: 'Cliente - Código postal' },
      { id: 'Cliente - País', title: 'Cliente - País' },
      { id: 'Cliente - Web', title: 'Cliente - Web' },
      { id: 'Cliente - Email', title: 'Cliente - Email' },
      { id: 'Cliente - Teléfono', title: 'Cliente - Teléfono' },
      { id: 'Cliente - Móvil', title: 'Cliente - Móvil' },
      { id: 'Cliente - Idioma', title: 'Cliente - Idioma' },
      { id: 'Cliente - Banco - País', title: 'Cliente - Banco - País' },
      { id: 'Cliente - Banco - Número cuenta', title: 'Cliente - Banco - Número cuenta' },
      { id: 'Cliente - Banco - SWIFT/BIC', title: 'Cliente - Banco - SWIFT/BIC' },
      { id: 'Cliente - Notas', title: 'Cliente - Notas' }
    ];

    // Calculate number of files needed
    const totalFiles = Math.ceil(clients.length / MAX_RECORDS_PER_FILE);
    const outputPaths = [];

    console.log(`📦 Splitting ${clients.length} clients into ${totalFiles} file(s) (max ${MAX_RECORDS_PER_FILE} per file)`);
    console.log('');

    // Generate CSV files
    for (let i = 0; i < totalFiles; i++) {
      const start = i * MAX_RECORDS_PER_FILE;
      const end = Math.min(start + MAX_RECORDS_PER_FILE, clients.length);
      const chunk = clients.slice(start, end);

      // Generate filename with part number if multiple files
      let filename;
      if (totalFiles > 1) {
        filename = csvConfig.filename.replace('.csv', `_part${i + 1}_${timestamp}.csv`);
      } else {
        filename = csvConfig.filename.replace('.csv', `_${timestamp}.csv`);
      }
      
      const outputPath = join(outputDir, filename);

      // Create CSV writer
      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: headers,
        encoding: 'utf8',
        alwaysQuote: true,
        append: false
      });

      // Write data to CSV
      await csvWriter.writeRecords(chunk);
      
      console.log(`✅ File ${i + 1}/${totalFiles}: ${filename}`);
      console.log(`   📊 Records: ${chunk.length} (${start + 1}-${end})`);
      
      outputPaths.push(outputPath);
    }
    
    console.log('');
    console.log(`✅ Generated ${totalFiles} CSV file(s) successfully`);
    
    return outputPaths;
    
  } catch (error) {
    console.error('❌ Error generating CSV:', error.message);
    throw error;
  }
}

/**
 * Validate client data before CSV generation
 * @param {Array} clients - Array of client objects
 * @returns {Object} Validation result with errors if any
 */
export function validateClients(clients) {
  const errors = [];
  
  clients.forEach((client, index) => {
    // Check required fields
    if (!client['Cliente - NIF']) {
      errors.push(`Row ${index + 1}: Missing NIF`);
    }
    if (!client['Cliente - Nombre'] && !client['Cliente - Apellidos']) {
      errors.push(`Row ${index + 1}: Missing both Nombre and Apellidos`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    totalRecords: clients.length,
    validRecords: clients.length - errors.length
  };
}

/**
 * Generate CSV file(s) from supplier data
 * Splits data into multiple files if more than 1000 records
 * @param {Array} suppliers - Array of mapped supplier objects
 * @returns {Promise<Array<string>>} Array of paths to generated CSV files
 */
export async function generateSupplierCSV(suppliers) {
  try {
    const csvConfig = getCsvConfig();
    const MAX_RECORDS_PER_FILE = 1000;
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), csvConfig.outputDir);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }

    // Generate timestamp for all files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Define CSV headers (FacturaDirecta format for suppliers)
    const headers = [
      { id: 'Proveedor - NIF', title: 'Proveedor - NIF' },
      { id: 'Proveedor - Nombre', title: 'Proveedor - Nombre' },
      { id: 'Proveedor - Apellidos', title: 'Proveedor - Apellidos' },
      { id: 'Proveedor - Nombre comercial', title: 'Proveedor - Nombre comercial' },
      { id: 'Proveedor - Código proveedor', title: 'Proveedor - Código proveedor' },
      { id: 'Proveedor - No acepta facturas electrónicas', title: 'Proveedor - No acepta facturas electrónicas' },
      { id: 'Proveedor - Dirección 1', title: 'Proveedor - Dirección 1' },
      { id: 'Proveedor - Dirección 2', title: 'Proveedor - Dirección 2' },
      { id: 'Proveedor - Localidad', title: 'Proveedor - Localidad' },
      { id: 'Proveedor - Provincia', title: 'Proveedor - Provincia' },
      { id: 'Proveedor - Código postal', title: 'Proveedor - Código postal' },
      { id: 'Proveedor - País', title: 'Proveedor - País' },
      { id: 'Proveedor - Web', title: 'Proveedor - Web' },
      { id: 'Proveedor - Email', title: 'Proveedor - Email' },
      { id: 'Proveedor - Teléfono', title: 'Proveedor - Teléfono' },
      { id: 'Proveedor - Móvil', title: 'Proveedor - Móvil' },
      { id: 'Proveedor - Idioma', title: 'Proveedor - Idioma' },
      { id: 'Proveedor - Banco - País', title: 'Proveedor - Banco - País' },
      { id: 'Proveedor - Banco - Número cuenta', title: 'Proveedor - Banco - Número cuenta' },
      { id: 'Proveedor - Banco - SWIFT/BIC', title: 'Proveedor - Banco - SWIFT/BIC' },
      { id: 'Proveedor - Notas', title: 'Proveedor - Notas' }
    ];

    // Calculate number of files needed
    const totalFiles = Math.ceil(suppliers.length / MAX_RECORDS_PER_FILE);
    const outputPaths = [];

    console.log(`📦 Splitting ${suppliers.length} suppliers into ${totalFiles} file(s) (max ${MAX_RECORDS_PER_FILE} per file)`);
    console.log('');

    // Generate CSV files
    for (let i = 0; i < totalFiles; i++) {
      const start = i * MAX_RECORDS_PER_FILE;
      const end = Math.min(start + MAX_RECORDS_PER_FILE, suppliers.length);
      const chunk = suppliers.slice(start, end);

      // Generate filename with part number if multiple files
      let filename;
      if (totalFiles > 1) {
        filename = `facturadirecta_import_suppliers_part${i + 1}_${timestamp}.csv`;
      } else {
        filename = `facturadirecta_import_suppliers_${timestamp}.csv`;
      }
      
      const outputPath = join(outputDir, filename);

      // Create CSV writer
      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: headers,
        encoding: 'utf8',
        alwaysQuote: true,
        append: false
      });

      // Write data to CSV
      await csvWriter.writeRecords(chunk);
      
      console.log(`✅ File ${i + 1}/${totalFiles}: ${filename}`);
      console.log(`   📊 Records: ${chunk.length} (${start + 1}-${end})`);
      
      outputPaths.push(outputPath);
    }
    
    console.log('');
    console.log(`✅ Generated ${totalFiles} CSV file(s) successfully`);
    
    return outputPaths;
    
  } catch (error) {
    console.error('❌ Error generating CSV:', error.message);
    throw error;
  }
}

/**
 * Validate supplier data before CSV generation
 * @param {Array} suppliers - Array of supplier objects
 * @returns {Object} Validation result with errors if any
 */
export function validateSuppliers(suppliers) {
  const errors = [];
  
  suppliers.forEach((supplier, index) => {
    // Check required fields
    if (!supplier['Proveedor - NIF']) {
      errors.push(`Row ${index + 1}: Missing NIF`);
    }
    if (!supplier['Proveedor - Nombre'] && !supplier['Proveedor - Apellidos']) {
      errors.push(`Row ${index + 1}: Missing both Nombre and Apellidos`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    totalRecords: suppliers.length,
    validRecords: suppliers.length - errors.length
  };
}
