import axios from "axios";

const api = axios.create({
    baseURL: "https://confeitaria-api-u5iw.onrender.com",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url ?? "";

        // Ignora erros de autenticação na própria rota de login
        const isAuthRoute = url.includes("/auth/");

        if (status === 401 && !isAuthRoute) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");

            // Salva a rota atual para redirecionar de volta após login
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
                sessionStorage.setItem("redirectAfterLogin", currentPath);
            }

            window.location.href = "/login";
        }

        // 403 NÃO redireciona — é erro de permissão, não de autenticação
        // Deixa o componente tratar com setError()

        return Promise.reject(error);
    }
);

export default api;