import axios from "axios";

const api = axios.create({
    baseURL: "https://confeitaria-api-u5iw.onrender.com",
});

// envia o token em toda requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// redireciona para login se token expirado
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401 /*|| status === 403*/) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;