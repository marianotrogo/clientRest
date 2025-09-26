import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL 
? `${import.meta.env.VITE_API_URL}/api`
: 'http://localhost:5000/api'

export const api = axios.create({baseURL})

api.interceptors.request.use(cfg =>{
    const token = localStorage.getItem('authToken')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})

