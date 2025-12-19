import axios from 'axios';



const api = axios.create({
    // Usa la IP/hostname actual para conectar con el backend en el puerto 4000
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

export default api;