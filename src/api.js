// Central API base URL
// In production (Render), frontend is served by the same server so we use relative path.
// In development, we hit localhost:5001 directly.
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default API;
