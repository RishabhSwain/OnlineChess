import axios from "axios";

const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: BackendURL,
  withCredentials: true
});

export default api;