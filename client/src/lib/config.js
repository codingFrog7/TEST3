/**
 * API configuration for Agro Sathi frontend.
 * API_BASE points to the Express server which proxies to the Python backend.
 * In development: Express (port 3000) proxies /api/python/* → Python (port 8000)
 * In production:  Same proxy, no change needed.
 */

// Python FastAPI backend — accessed via Express proxy
export const PYTHON_API_BASE = "/api/python";

// Existing Node/Express crop doctor API
export const NODE_API_BASE = "/api";
