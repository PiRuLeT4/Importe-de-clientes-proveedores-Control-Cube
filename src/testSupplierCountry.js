import { fetchSuppliers } from './services/supplierService.js';
import { mapSupplierToFacturaDirecta } from './utils/csvMapper.js';

async function testSupplierCountry() {
  try {
    console.log('🔍 Fetching suppliers...\n');
    const suppliers = await fetchSuppliers();
    
    // Filter non-ES suppliers
    const nonESSuppliers = suppliers.filter(s => s.pais !== 'ES');
    
    console.log(`Found ${nonESSuppliers.length} non-ES suppliers:\n`);
    
    nonESSuppliers.forEach(supplier => {
      console.log('─'.repeat(60));
      console.log(`NIF: ${supplier.nif}`);
      console.log(`Nombre: ${supplier.nombre}`);
      console.log(`Provincia (raw): ${supplier.provincia_raw}`);
      console.log(`Poblacion (raw): ${supplier.poblacion_raw}`);
      console.log(`Provincia (parsed): ${supplier.provincia}`);
      console.log(`Localidad (parsed): ${supplier.localidad}`);
      console.log(`País (detected): ${supplier.pais}`);
      
      // Now map it to FacturaDirecta format
      const mapped = mapSupplierToFacturaDirecta(supplier);
      console.log(`País (in CSV): ${mapped['Proveedor - País']}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSupplierCountry();
