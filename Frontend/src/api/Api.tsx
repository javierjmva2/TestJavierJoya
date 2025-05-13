import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5295/',
});

//Acá se intenta inyectar el token jwt en todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;