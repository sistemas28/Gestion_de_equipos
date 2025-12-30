import axios from 'axios';



const api = axios.create({
    // Se usa una ruta relativa para aprovechar el proxy de Vite configurado en vite.config.js
    baseURL: '/api'
});

export default api;