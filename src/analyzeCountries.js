import dotenv from 'dotenv';
import { fetchDifferentCountries } from './services/supplierService.js';
import { detectCountry } from './utils/countryParser.js';

// Load environment variables
dotenv.config();

async function analyzeCountries() {
  try {
    console.log('🔍 Fetching all distinct poblaciones...\n');
    const poblaciones = await fetchDifferentCountries();
    
    console.log(`Found ${poblaciones.length} distinct poblaciones\n`);
    
    // Group by detected country
    const countryGroups = {};
    const unknownCountries = [];
    
    poblaciones.forEach(poblacion => {
      if (!poblacion) return;
      
      const country = detectCountry('', poblacion);
      
      if (!countryGroups[country]) {
        countryGroups[country] = [];
      }
      countryGroups[country].push(poblacion);
      
      // Check if it looks like a foreign country that defaulted to ES
      const poblacionUpper = poblacion.toUpperCase();
      const foreignKeywords = [
        'CHINA', 'INDIA', 'USA', 'UNITED STATES', 'CANADA', 'MEXICO',
        'BRASIL', 'BRAZIL', 'ARGENTINA', 'CHILE', 'COLOMBIA', 'PERU',
        'JAPAN', 'JAPON', 'KOREA', 'COREA', 'TAIWAN', 'HONG KONG',
        'AUSTRALIA', 'NEW ZEALAND', 'SOUTH AFRICA', 'SUDAFRICA',
        'RUSSIA', 'RUSIA', 'POLAND', 'POLONIA', 'CZECH', 'CHECA',
        'NETHERLANDS', 'HOLANDA', 'BELGIUM', 'BELGICA', 'SWITZERLAND', 'SUIZA',
        'AUSTRIA', 'SWEDEN', 'SUECIA', 'NORWAY', 'NORUEGA', 'DENMARK', 'DINAMARCA',
        'FINLAND', 'FINLANDIA', 'IRELAND', 'IRLANDA', 'GREECE', 'GRECIA',
        'TURKEY', 'TURQUIA', 'EGYPT', 'EGIPTO', 'ISRAEL', 'DUBAI', 'UAE'
      ];
      
      const hasForeignKeyword = foreignKeywords.some(keyword => 
        poblacionUpper.includes(keyword)
      );
      
      if (hasForeignKeyword && country === 'ES') {
        unknownCountries.push(poblacion);
      }
    });
    
    console.log('📊 Countries detected:');
    Object.keys(countryGroups).sort().forEach(country => {
      console.log(`\n${country}: ${countryGroups[country].length} locations`);
      if (countryGroups[country].length <= 20) {
        countryGroups[country].forEach(loc => {
          console.log(`  - ${loc}`);
        });
      } else {
        console.log(`  (showing first 10)`);
        countryGroups[country].slice(0, 10).forEach(loc => {
          console.log(`  - ${loc}`);
        });
      }
    });
    
    if (unknownCountries.length > 0) {
      console.log('\n⚠️  Potential undetected foreign countries (defaulted to ES):');
      unknownCountries.forEach(loc => {
        console.log(`  - ${loc}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

analyzeCountries();
