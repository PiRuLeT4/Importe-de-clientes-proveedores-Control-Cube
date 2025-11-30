import dotenv from 'dotenv';
import { fetchSuppliers } from './services/supplierService.js';

dotenv.config();

async function showCountryStats() {
  const suppliers = await fetchSuppliers();
  
  // Count by country
  const countryCount = {};
  suppliers.forEach(s => {
    const country = s.pais || 'UNKNOWN';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });
  
  console.log('\n📊 Suppliers by country:');
  Object.keys(countryCount).sort().forEach(country => {
    console.log(`  ${country}: ${countryCount[country]}`);
  });
  
  console.log(`\n✅ Total: ${suppliers.length} suppliers`);
  console.log(`✅ Countries detected: ${Object.keys(countryCount).length}`);
  
  process.exit(0);
}

showCountryStats();
