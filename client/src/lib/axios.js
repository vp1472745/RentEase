import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4500",  // Use environment variable if available
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    // ✅ Cookies are automatically handled by withCredentials: true
    // No need to manually add Authorization header - backend will read from cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// axios.post("/api/auth/login", {
//   email: email,
//   password: password
// }, { withCredentials: true }) // Cookies भेजने के लिए
// .then(response => {
//   console.log(response.data); // Success response
// })
// .catch(error => {
//   console.error("There was an error!", error);
// });

export default API;
