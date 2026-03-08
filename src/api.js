// Central API base URL
// In production (Render), frontend is served by the same server so we use relative path.
// In development, we hit localhost:5001 directly.
const API = process.env.REACT_APP_API_URL || "https://saanjh-l7tf.onrender.com";

export default API;
