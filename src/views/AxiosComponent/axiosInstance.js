import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://10.11.12.149:8090", // Set your API base URL
//   headers: {
//     "Content-Type": "application/json",
//     // Set any other global headers here
//   },
// });

axios.interceptors.request.use(
  (config) => {
    // Get the authentication token from your authentication system
    const authToken = localStorage.getItem("jwtToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
