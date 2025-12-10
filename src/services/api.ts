// Centralized API base URL. Uses the Vite env variable defined in the project's `.env`.
// Vite exposes variables starting with VITE_ on `import.meta.env` at build time.
export const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:5000/api/v1/auth/'
export const API_THREAD_URL = import.meta.env.VITE_API_THREAD_URL || 'http://localhost:5000/api/v1/threads/'
export const API_COMMUNITY_URL = import.meta.env.VITE_API_COMMUNITY_URL || 'http://localhost:5000/api/v1/communities/'
export const API_NOTIFICATION_URL = import.meta.env.VITE_API_NOTIFICATION_URL || 'http://localhost:5000/api/v1/notifications/'
export const API_LOCAL_BASE_URL = import.meta.env.VITE_API_LOCAL_BASE_URL || 'http://localhost:5000/api/v1/'