import axios from "axios";

const api = axios.create({
    baseURL: "https://confeitaria-api-u5iw.onrender.com",
});

export default api;