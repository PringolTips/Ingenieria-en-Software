import axios from 'axios';

const API_BASE_URL = 'http://18.220.93.246:3000/api'; // Tu IP de la EC2

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // RNF-01: Las respuestas deben ser rápidas [cite: 445]
});

export default api;