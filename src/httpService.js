import axios from 'axios'
const BASE_URL = 'http://localhost:8091/MDConfMS/'
// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        //config.headers.Authorization = `Bearer ${your_token}`;
        // OR config.headers.common['Authorization'] = `Bearer ${your_token}`;
        config.baseURL = BASE_URL;

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    patch: axios.patch
};