import axios from "axios";

const api = axios.create({
    baseURL: "https://confeitaria-api-u5iw.onrender.com",
});

// flag para evitar loop infinito de refresh
let isRefreshing = false;
// fila de requisições que falharam enquanto refresh estava em andamento
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // se for 401 e ainda não tentou refresh
        if (status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem("refreshToken");

            // sem refresh token → desloga
            if (!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            // se já está fazendo refresh, enfileira a requisição
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    "https://confeitaria-api-u5iw.onrender.com/auth/refresh",
                    { refreshToken }
                );

                const { token, refreshToken: novoRefreshToken } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", novoRefreshToken);

                api.defaults.headers.common.Authorization = `Bearer ${token}`;
                originalRequest.headers.Authorization = `Bearer ${token}`;

                processQueue(null, token);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 403 e outros erros sobem para o componente tratar
        return Promise.reject(error);
    }
);

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
}

export default api;