import dotenv from 'dotenv';
import { fetchDifferentCountries } from './services/supplierService.js';

dotenv.config();

async function listPoblaciones() {
  const poblaciones = await fetchDifferentCountries();
  console.log(JSON.stringify(poblaciones, null, 2));
  process.exit(0);
}

listPoblaciones();
