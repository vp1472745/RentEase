import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",  // Apne backend ka base URL daalo
  headers: {
    "Content-Type": "application/json",
  },
});

// Token Add Karne Ka Function (Agar Required Ho)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
