import { getPool } from '../database/connection.js';
import { parseLocationData, getCountryStats } from '../utils/countryParser.js';

/**
 * Fetch all clients from the database
 * NOTA: Ajusta esta consulta SQL según tu esquema de base de datos
 * 
 * @returns {Promise<Array>} Array of client objects
 */
export async function fetchClients() {
  try {
    const pool = await getPool();
    
    // IMPORTANTE: Ajusta esta consulta según tu esquema de base de datos
    // Este es un ejemplo genérico que debes personalizar
    const query = `
      SELECT 
        CIF AS nif,
        Empresa AS nombre_comercial,
        codigo AS codigo_cliente,
        Direccion AS direccion_1,
        Poblacion AS poblacion_raw,
        provincia AS provincia_raw,
        CP AS codigo_postal,
        DireccionCorreoEl AS email,
        Tel1 AS telefono,
        Tel2,
        Observaciones AS notas
      FROM clientes
      WHERE Empresa IS NOT NULL
      ORDER BY codigo_cliente
    `;
    
    const [rows] = await pool.query(query);
    
    // Parse location data and detect countries
    const parsedRows = rows.map(row => {
      const locationData = parseLocationData(row.poblacion_raw, row.provincia_raw);
      return {
        ...row,
        localidad: locationData.localidad,
        provincia: locationData.provincia,
        pais: locationData.pais
      };
    });
    
    // Log country statistics
    const stats = getCountryStats(parsedRows);
    console.log('📊 Clients by country:', stats);
    console.log(`✅ Fetched ${parsedRows.length} clients from database`);
    
    return parsedRows;
    
  } catch (error) {
    console.error('❌ Error fetching clients:', error.message);
    throw error;
  }
}

/**
 * Fetch clients with custom query
 * @param {string} customQuery - Custom SQL query
 * @returns {Promise<Array>}
 */
export async function fetchClientsCustom(customQuery) {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(customQuery);
    console.log(`✅ Fetched ${rows.length} clients with custom query`);
    return rows;
  } catch (error) {
    console.error('❌ Error fetching clients with custom query:', error.message);
    throw error;
  }
}
