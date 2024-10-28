
import axios from 'axios';

export const KHALTI_CONFIG = {
  baseUrl: 'https://a.khalti.com/api/v2',
  secretKey: import.meta.env.VITE_KHALTI_LIVE_SECRET_KEY ?? '',  // Ensure the secret key is always a string
} as const;





export const khaltiClient = axios.create({
  baseURL: KHALTI_CONFIG.baseUrl,
  headers: {
    'Authorization': `Key ${KHALTI_CONFIG.secretKey}`, // Set secret key for authorization
    'Content-Type': 'application/json',
  },
});