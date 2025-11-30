/**
 * Parse and normalize location data based on country
 * This utility handles the separation of locality/province data for different countries
 */

/**
 * List of known Spanish provinces
 */
const SPANISH_PROVINCES = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
  'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara',
  'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida',
  'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra',
  'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
  // Add unaccented and alternative names found in database
  'La Coruña', 'Alava', 'Almeria', 'Avila', 'Caceres', 'Cadiz', 'Cordoba', 'Gerona',
  'Guipuzcoa', 'Guipuzkoa', 'Jaen', 'Leon', 'Lerida', 'Malaga', 'Canarias'
];

/**
 * Detect country from province/locality data
 * @param {string} provincia - Province field from database
 * @param {string} localidad - Locality field from database
 * @returns {string} ISO country code (ES, PT, FR, etc.)
 */
export function detectCountry(provincia, localidad) {
  if (!provincia && !localidad) {
    return 'ES'; // Default to Spain
  }

  const provinciaUpper = (provincia || '').toUpperCase().trim();
  const localidadUpper = (localidad || '').toUpperCase().trim();

  // Check if it's a Spanish province
  const isSpanishProvince = SPANISH_PROVINCES.some(
    sp => sp.toUpperCase() === provinciaUpper
  );

  if (isSpanishProvince) {
    return 'ES';
  }

  // Check for Portugal
  if (provinciaUpper.includes('PORTUGAL') || localidadUpper.includes('PORTUGAL') ||
      provinciaUpper.includes('LISBOA') || provinciaUpper.includes('PORTO') ||
      localidadUpper.includes('POVOA DE VARZIM') || localidadUpper.includes('AVEIRO') ||
      localidadUpper.startsWith('P-')) {
    return 'PT';
  }

  // Check for France
  if (provinciaUpper.includes('FRANCE') || provinciaUpper.includes('FRANCIA') || provinciaUpper.includes('PARIS') ||
      localidadUpper.includes('PARIS') || localidadUpper.includes('LYON') ||
      localidadUpper.includes('ST ANDRE DES EAUX') || localidadUpper.includes('ST NAZAIRE') ||
      localidadUpper.includes('SAINT NAZAIRE') || localidadUpper.includes('LYN-FR') ||
      localidadUpper.startsWith('F-')) {
    return 'FR';
  }

  // Check for Italy
  if (provinciaUpper.includes('ITALIA') || provinciaUpper.includes('ITALY') ||
      localidadUpper.includes('ROMA') || localidadUpper.includes('MILANO') ||
      localidadUpper.includes('NAPOLI') || localidadUpper.includes('BOLOGNA') ||
      localidadUpper.includes('ARGELATO')) {
    return 'IT';
  }

  // Check for Germany
  if (provinciaUpper.includes('ALEMANIA') || provinciaUpper.includes('GERMANY') ||
      provinciaUpper.includes('DEUTSCHLAND') || localidadUpper.includes('BERLIN') ||
      localidadUpper.includes('STUTTGART') || localidadUpper.includes('SUTTGART') ||
      localidadUpper.includes('MÜNCHEN') || localidadUpper.includes('MUNICH') ||
      localidadUpper.includes('HANNOVER') || localidadUpper.includes('CHEMNITZ') ||
      localidadUpper.includes('IGERSHEIM') || localidadUpper.includes('SCHWETZINGEN') ||
      localidadUpper.includes('MOERS') || localidadUpper.includes('LEIPZIG') ||
      localidadUpper.includes('FRANKFURT') || localidadUpper.includes('MAINZ') ||
      localidadUpper.includes('UNTERHACHING') || localidadUpper.includes('AACHEN') ||
      localidadUpper.includes('ENGELSKIRCHEN') || localidadUpper.includes('BERGEN') ||
      localidadUpper.startsWith('D-') || localidadUpper.includes(' - GERMANY')) {
    return 'DE';
  }

  // Check for UK
  if (provinciaUpper.includes('REINO UNIDO') || provinciaUpper.includes('UK') ||
      provinciaUpper.includes('ENGLAND') || provinciaUpper.includes('GRAN BRETAÑA') ||
      provinciaUpper.includes('GREAT BRITAIN') || provinciaUpper.includes('BRITISH') ||
      provinciaUpper.includes('BRITSH') || provinciaUpper.includes('WALES') ||
      localidadUpper.includes('LONDON') || localidadUpper.includes('MANCHESTER') ||
      localidadUpper.includes('DERBY') || localidadUpper.includes('CREWE') ||
      localidadUpper.includes('STANMORE') || localidadUpper.includes('BRIDGEND') ||
      localidadUpper.includes('WEST SUSSEX') || localidadUpper.includes('MIDDLESEX') ||
      localidadUpper.includes('WALES') || provinciaUpper === 'GB') {
    return 'GB';
  }

  // Check for Morocco
  if (provinciaUpper.includes('MARRUECOS') || provinciaUpper.includes('MOROCCO') ||
      localidadUpper.includes('CASABLANCA') || localidadUpper.includes('RABAT')) {
    return 'MA';
  }

  // Check for China
  if (provinciaUpper.includes('CHINA') || localidadUpper.includes('CHINA') ||
      localidadUpper.includes('SHENZHEN') || localidadUpper.includes('GUANGDONG') ||
      localidadUpper.includes('GUANGZHOU') || localidadUpper.includes('BEIJING') ||
      localidadUpper.includes('DONGGUANG') || localidadUpper.includes('FUZHOU') ||
      localidadUpper.includes('ANHUI') || provinciaUpper === 'CN' ||
      localidadUpper.includes('GUAND DONG') || localidadUpper.includes('GUANDONG') ||
      localidadUpper.includes('SHENZHENSHI') || localidadUpper.includes('ZHUAI') ||
      localidadUpper.includes('ZHUHAI') ||
      localidadUpper.includes(', CN') || localidadUpper.includes('-CN')) {
    return 'CN';
  }

  // Check for Belgium
  if (provinciaUpper.includes('BELGIUM') || provinciaUpper.includes('BELGICA') ||
      localidadUpper.includes('BELGIUM') || localidadUpper.includes('DIEGEM') ||
      localidadUpper.includes('BRUSSELS') || localidadUpper.includes('BRUSELAS')) {
    return 'BE';
  }

  // Check for Netherlands
  if (provinciaUpper.includes('HOLANDA') || provinciaUpper.includes('NETHERLANDS') ||
      provinciaUpper.includes('HOLLAND') || provinciaUpper.includes('PAISES BAJOS') ||
      localidadUpper.includes('HOOFDDORP') || localidadUpper.includes('AMSTERDAM') ||
      localidadUpper.includes('THE NETHERLANDS')) {
    return 'NL';
  }

  // Check for Switzerland
  if (provinciaUpper.includes('SUIZA') || provinciaUpper.includes('SWITZERLAND') ||
      localidadUpper.includes('SWITZERLAND') || localidadUpper.includes('ZURICH') ||
      localidadUpper.includes('GENEVA') || localidadUpper.includes('GINEBRA')) {
    return 'CH';
  }

  // Check for Turkey
  if (provinciaUpper.includes('TURQUIA') || provinciaUpper.includes('TURKEY') ||
      localidadUpper.includes('TURKEY') || localidadUpper.includes('ISTANBUL') ||
      localidadUpper.includes('ANKARA')) {
    return 'TR';
  }

  // Check for Italy (enhanced)
  if (provinciaUpper.includes('ITALIA') || provinciaUpper.includes('ITALY') ||
      localidadUpper.includes('ITALIA') || localidadUpper.includes('NAPOLI') ||
      localidadUpper.includes('ROMA') || localidadUpper.includes('MILANO') ||
      localidadUpper.includes('BOLOGNA') || localidadUpper.includes('ARGELATO')) {
    return 'IT';
  }

  // Check for Poland
  if (provinciaUpper.includes('POLONIA') || provinciaUpper.includes('POLAND') ||
      localidadUpper.includes('POLONIA') || localidadUpper.includes('KRAKÓW') ||
      localidadUpper.includes('KRAKOW') || localidadUpper.includes('WARSAW') ||
      localidadUpper.includes('OLESNICA') || provinciaUpper === 'PL') {
    return 'PL';
  }

  // Check for Ireland
  if (provinciaUpper.includes('IRLANDA') || provinciaUpper.includes('IRELAND') ||
      localidadUpper.includes('IRELAND') || localidadUpper.includes('DUBLIN') ||
      localidadUpper.includes('SANDYFORD') || provinciaUpper === 'IE' ||
      localidadUpper.includes('(IE)')) {
    return 'IE';
  }

  // Check for United States
  if (provinciaUpper.includes('ESTADOS UNIDOS') || provinciaUpper.includes('UNITED STATES') ||
      provinciaUpper.includes('USA') || provinciaUpper.includes('US') ||
      localidadUpper.includes('UNITED STATES') || localidadUpper.includes('USA') ||
      localidadUpper.includes('CALIFORNIA') || localidadUpper.includes('SACRAMENTO') ||
      localidadUpper.includes(', US')) {
    return 'US';
  }

  // Check for South Korea
  if (provinciaUpper.includes('COREA') || provinciaUpper.includes('KOREA') ||
      localidadUpper.includes('SEOUL') || localidadUpper.includes('KOREA')) {
    return 'KR';
  }

  // Check for Hong Kong
  if (provinciaUpper.includes('HONG KONG') || localidadUpper.includes('HONG KONG') ||
      localidadUpper.includes('KOWLOON')) {
    return 'HK';
  }

  // Check for Bulgaria
  if (provinciaUpper.includes('BULGARIA') || provinciaUpper === 'BG' ||
      localidadUpper.includes('SOFIA') || localidadUpper.includes('BULGARIA')) {
    return 'BG';
  }

  // Check for Latvia
  if (provinciaUpper.includes('LETONIA') || provinciaUpper.includes('LATVIA') ||
      localidadUpper.includes('LETONIA') || localidadUpper.includes('RIGA')) {
    return 'LV';
  }

  // Check for Algeria
  if (provinciaUpper.includes('ARGELIA') || provinciaUpper.includes('ALGERIA') ||
      localidadUpper.includes('ARGEL') || localidadUpper.includes('ALGIERS')) {
    return 'DZ';
  }

  // Check for Andorra
  if (provinciaUpper.includes('ANDORRA') || localidadUpper.includes('ANDORRA') ||
      localidadUpper.includes('ESCALDES-ENGORDANY')) {
    return 'AD';
  }

  // Default to Spain if no match
  return 'ES';
}

/**
 * Parse location data and separate locality/province based on country
 * @param {string} poblacion - Poblacion field from database
 * @param {string} provincia - Provincia field from database
 * @returns {Object} Parsed location data with country, locality, and province
 */
export function parseLocationData(poblacion, provincia) {
  const country = detectCountry(provincia, poblacion);
  
  let localidad = poblacion || '';
  let provinciaFinal = provincia || '';

  // For Spain, ensure proper separation
  if (country === 'ES') {
    // If provincia is empty but poblacion contains a comma, try to split
    if (!provinciaFinal && localidad.includes(',')) {
      const parts = localidad.split(',').map(p => p.trim());
      localidad = parts[0];
      provinciaFinal = parts[1] || '';
    }
    
    // If provincia is not in the list of Spanish provinces, it might be in poblacion
    const isValidSpanishProvince = SPANISH_PROVINCES.some(
      sp => sp.toUpperCase() === provinciaFinal.toUpperCase()
    );
    
    if (!isValidSpanishProvince && provinciaFinal) {
      // Check if provincia value is actually a locality
      const foundProvince = SPANISH_PROVINCES.find(
        sp => localidad.toUpperCase().includes(sp.toUpperCase())
      );
      
      if (foundProvince) {
        provinciaFinal = foundProvince;
      }
    }
  } else {
    // For non-Spanish countries, provincia might contain the country name
    // Clean it up and use it as region/state
    if (provinciaFinal.toUpperCase().includes(country)) {
      provinciaFinal = provinciaFinal.replace(new RegExp(country, 'gi'), '').trim();
      provinciaFinal = provinciaFinal.replace(/^[,\-\s]+|[,\-\s]+$/g, '').trim();
    }
  }

  return {
    pais: country,
    localidad: localidad.trim(),
    provincia: provinciaFinal.trim()
  };
}

/**
 * Get statistics about countries in a dataset
 * @param {Array} records - Array of records with poblacion and provincia fields
 * @returns {Object} Statistics about countries found
 */
export function getCountryStats(records) {
  const stats = {};
  
  records.forEach(record => {
    const country = detectCountry(record.provincia, record.localidad);
    stats[country] = (stats[country] || 0) + 1;
  });
  
  return stats;
}
