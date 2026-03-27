import { createClient } from '@neondatabase/neon-js';

const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL;
const neonDataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

if (!neonAuthUrl || !neonDataApiUrl) {
  console.warn('Missing Neon Auth URL or Data API URL in .env file');
}

export const client = createClient({
  auth: { url: neonAuthUrl },
  dataApi: { url: neonDataApiUrl },
});
