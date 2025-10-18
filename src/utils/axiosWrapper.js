import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_IP = import.meta.env.VITE_API_IP;

const api = axios.create({
    baseURL: API_BASE_IP,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    response => {
        // Mostrar toast si el servidor devuelve un mensaje
        if (response?.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    }
    // Remove the error handler completely from interceptor
);

export const axiosData = async (url, config = {}) => {
  try {
    const res = await api.request({ url, ...config });

    // If it's a blob, just return the full response so caller can handle it
    if (config.responseType === "blob") {
      return res;
    }

    // Otherwise return just the data
    return res.data;
  } catch (err) {
    if (config.responseType === "blob") {
      // For blobs, throw the error so caller can handle it properly
      throw err;
    } else {
      // For JSON requests, show toast and return null
      toast.error(err?.response?.data?.message || "Algo salió mal");
      return null;
    }
  }
};