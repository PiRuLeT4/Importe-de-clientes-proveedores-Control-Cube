import { getPool } from "../database/connection.js";
import { parseLocationData, getCountryStats } from "../utils/countryParser.js";

/**
 * Get all suppliers from the database
 * @returns {Promise<Array>} Array of supplier objects
 */ 
export async function fetchSuppliers() {
    try {
        const pool = await getPool();
        const query = `
      SELECT 
        CIF AS nif,
        NombreProveedor AS nombre,
        codigo AS codigo_proveedor,
        Direccion AS direccion_1,
        Poblacion AS poblacion_raw,
        provincia AS provincia_raw,
        CP AS codigo_postal,
        DireccionCorreoEl AS email,
        Tel AS telefono,
        Observaciones AS notas
      FROM proveedores
      ORDER BY codigo_proveedor
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
        console.log('📊 Suppliers by country:', stats);
        
        return parsedRows;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
}

export async function fetchDifferentCountries() {
    try {
        const pool = await getPool();
        const query = `
      SELECT DISTINCT Provincia
      FROM proveedores
    `;
        const [rows] = await pool.query(query);
        return rows.map(row => row.Provincia);
    } catch (error) {
        console.error('Error fetching different provincia:', error);
        throw error;
    }
}