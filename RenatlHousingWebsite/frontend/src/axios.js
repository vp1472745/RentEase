import axios from 'axios';

// Create an instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

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



// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session timeout or unauthorized access
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;