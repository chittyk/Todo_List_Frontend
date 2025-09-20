import axios from "axios"
// import { config } from "dotenv"


const API_URL = import.meta.env.VITE_API_URL ||'http://localhost:8080'
const api = axios.create({baseURL:API_URL})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token) config.headers.Authorization=`xtoken ${token}`
    return config
})

export default api