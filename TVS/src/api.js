import axios from "axios"
import { ACCESS_TOKEN, TEMP_ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const temp = localStorage.getItem(TEMP_ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (!token && temp) {
            config.headers.Authorization = `Bearer ${temp}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api