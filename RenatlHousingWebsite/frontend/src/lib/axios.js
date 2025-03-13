import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",  // Apne backend ka base URL daalo
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
