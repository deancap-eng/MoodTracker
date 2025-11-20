// Determine the API base URL
// Priority: 1. Custom server URL from localStorage (for remote access)
//           2. Development mode with Vite proxy
//           3. Production Electron app with localhost
function getApiBaseUrl() {
  // Check for custom server URL (for remote users)
  const customUrl = localStorage.getItem('serverUrl');
  if (customUrl) {
    return customUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  const isDevelopment = import.meta.env.DEV;
  const isElectron = window.electron?.isElectron || false;

  // In development with Vite dev server, use relative URLs (proxy will handle it)
  // In production Electron app or standalone mode, use localhost
  return (isDevelopment && !isElectron) ? '' : 'http://localhost:3000';
}

export let API_BASE_URL = getApiBaseUrl();

// Update API_BASE_URL when localStorage changes (for settings changes)
window.addEventListener('storage', () => {
  API_BASE_URL = getApiBaseUrl();
});

// Helper function to make API calls with the correct base URL
export async function apiFetch(endpoint, options = {}) {
  const url = `${getApiBaseUrl()}${endpoint}`;
  return fetch(url, options);
}

export default apiFetch;
