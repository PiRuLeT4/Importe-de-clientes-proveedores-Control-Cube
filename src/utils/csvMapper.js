/**
 * Clean email field by keeping only the first email if multiple are present
 * @param {string} email - Email field that may contain multiple emails separated by ; or / or other separators
 * @returns {string} First email only, trimmed and cleaned
 */
function cleanEmail(email) {
  if (!email) {
    return '';
  }
  
  // Convert to string in case it's not
  const emailStr = String(email);
  
  // Split by common separators (;, /, comma, multiple spaces) and take only the first part
  // Then trim all whitespace
  const firstEmail = emailStr.split(/[;\/,\s]+/)[0].trim();
  
  // Return empty string if the result is empty after cleaning
  return firstEmail || '';
}

/**
 * Map database client data to FacturaDirecta CSV format
 * @param {Object} client - Client data from database
 * @returns {Object} Mapped client data for CSV
 */
export function mapClientToFacturaDirecta(client) {
  return {
    'Cliente - NIF': client.nif || '',
    'Cliente - Nombre': client.nombre || '',
    'Cliente - Apellidos': client.apellidos || '',
    'Cliente - Nombre comercial': client.nombre_comercial || '',
    'Cliente - Código cliente': client.codigo_cliente || '',
    'Cliente - No acepta facturas electrónicas': 0,
    'Cliente - Dirección 1': client.direccion_1 || '',
    'Cliente - Dirección 2': client.direccion_2 || '',
    'Cliente - Localidad': client.localidad || '',
    'Cliente - Provincia': client.provincia || '',
    'Cliente - Código postal': client.codigo_postal || '',
    'Cliente - País': client.pais || 'ES',
    'Cliente - Web': client.web || '',
    'Cliente - Email': cleanEmail(client.email),
    'Cliente - Teléfono': client.telefono || '',
    'Cliente - Móvil': client.movil || '',
    'Cliente - Idioma': client.idioma || 'es',
    'Cliente - Banco - País': client.banco_pais || '',
    'Cliente - Banco - Número cuenta': client.banco_numero_cuenta || '',
    'Cliente - Banco - SWIFT/BIC': client.banco_swift_bic || '',
    'Cliente - Notas': client.notas || ''
  };
}

/**
 * Map database supplier data to FacturaDirecta CSV format
 * @param {Object} supplier - supplier data from database
 * @returns {Object} Mapped supplier data for CSV
 */
export function mapSupplierToFacturaDirecta(supplier) {
  return {
    'Proveedor - NIF': supplier.nif || '',
    'Proveedor - Nombre': supplier.nombre || '',
    'Proveedor - Apellidos': supplier.apellidos || '',
    'Proveedor - Nombre comercial': supplier.nombre_comercial || '',
    'Proveedor - Código proveedor': supplier.codigo_proveedor || '',
    'Proveedor - No acepta facturas electrónicas': 0,
    'Proveedor - Dirección 1': supplier.direccion_1 || '',
    'Proveedor - Dirección 2': supplier.direccion_2 || '',
    'Proveedor - Localidad': supplier.localidad || '',
    'Proveedor - Provincia': supplier.provincia || '',
    'Proveedor - Código postal': supplier.codigo_postal || '',
    'Proveedor - País': supplier.pais || 'ES',
    'Proveedor - Web': supplier.web || '',
    'Proveedor - Email': cleanEmail(supplier.email),
    'Proveedor - Teléfono': supplier.telefono || '',
    'Proveedor - Móvil': supplier.movil || '',
    'Proveedor - Idioma': supplier.idioma || 'es',
    'Proveedor - Banco - País': supplier.banco_pais || '',
    'Proveedor - Banco - Número cuenta': supplier.banco_numero_cuenta || '',
    'Proveedor - Banco - SWIFT/BIC': supplier.banco_swift_bic || '',
    'Proveedor - Notas': supplier.notas || ''
  }
}

/**
 * Format boolean values to FacturaDirecta format (Sí/No)
 * @param {*} value - Boolean value or string
 * @returns {string} 'Sí', 'No', or empty string
 */
function formatBoolean(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  // Handle different boolean representations
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  
  if (typeof value === 'number') {
    return value === 1 ? 'Sí' : 'No';
  }
  
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    if (['true', '1', 'yes', 'sí', 'si'].includes(normalized)) {
      return 'Sí';
    }
    if (['false', '0', 'no'].includes(normalized)) {
      return 'No';
    }
  }
  
  return '';
}

/**
 * Map array of clients to FacturaDirecta format
 * @param {Array} clients - Array of client objects from database
 * @returns {Array} Array of mapped client objects
 */
export function mapClientsToFacturaDirecta(clients) {
  return clients.map(mapClientToFacturaDirecta);
}

/**
 * Map array of suppliers to FacturaDirecta format
 * @param {Array} suppliers - Array of supplier objects from database
 * @returns {Array} Array of mapped supplier objects
 */
export function mapSuppliersToFacturaDirecta(suppliers) {
  return suppliers.map(mapSupplierToFacturaDirecta);
}
