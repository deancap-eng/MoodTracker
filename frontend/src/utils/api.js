// Determine the API base URL
// In development with Vite dev server, use relative URLs (proxy will handle it)
// In production Electron app, use the full localhost URL
const isDevelopment = import.meta.env.DEV;
const isElectron = window.electron?.isElectron || false;

export const API_BASE_URL = (isDevelopment && !isElectron) ? '' : 'http://localhost:3000';

// Helper function to make API calls with the correct base URL
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
}

export default apiFetch;
