import axios from 'axios';

// Create axios instance with base configuration
const instance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 30000, // Increase default timeout to 30 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        // Log request details
        console.log("\n📤 ===== Request Log =====");
        console.log("Method:", config.method?.toUpperCase());
        console.log("URL:", config.url);
        console.log("Headers:", config.headers);
        
        // Hide sensitive data in logs
        if (config.data) {
            const logData = { ...config.data };
            if (logData.password) logData.password = "********";
            if (logData.token) logData.token = "********";
            console.log("Data:", logData);
        }
        console.log("📤 ===== End Request Log =====\n");

        // Add token to request if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Increase timeout for file uploads
        if (config.data instanceof FormData) {
            config.timeout = 60000; // 60 seconds for file uploads
        }

        return config;
    },
    (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        // Log response details
        console.log("\n📥 ===== Response Log =====");
        console.log("Status:", response.status);
        console.log("Headers:", response.headers);
        
        // Hide sensitive data in logs
        const logData = { ...response.data };
        if (logData.token) logData.token = "********";
        console.log("Data:", logData);
        console.log("📥 ===== End Response Log =====\n");

        return response;
    },
    (error) => {
        console.error("\n❌ ===== Response Error =====");
        
        if (error.response) {
            // Server responded with error status
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else if (error.request) {
            // Request made but no response received
            console.error("No response received");
            console.error("Request config:", error.config);
        } else {
            // Error in request setup
            console.error("Error message:", error.message);
        }
        
        console.error("❌ ===== End Response Error =====\n");

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
        }

        return Promise.reject(error);
    }
);





export default instance;