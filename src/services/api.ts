// Centralized API base URL. Uses the Vite env variable defined in the project's `.env`.
// Vite exposes variables starting with VITE_ on `import.meta.env` at build time.
export const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL
export const API_THREAD_URL = import.meta.env.VITE_API_THREAD_URL
export const API_COMMUNITY_URL = import.meta.env.VITE_API_COMMUNITY_URL
export const API_NOTIFICATION_URL = import.meta.env.VITE_API_NOTIFICATION_URL
export const API_LOCAL_BASE_URL = import.meta.env.VITE_API_LOCAL_BASE_URL