import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yathraa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('yathraa_refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/token/refresh/', {
            refresh: refreshToken
          });
          
          localStorage.setItem('yathraa_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('yathraa_token');
          localStorage.removeItem('yathraa_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
