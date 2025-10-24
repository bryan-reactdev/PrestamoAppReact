import axios from "axios";
import toast from "react-hot-toast";

export const API_BASE_IP = import.meta.env.VITE_API_IP;

const api = axios.create({
    baseURL: API_BASE_IP,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
  response => {
    if (response?.data?.message) {      
      if (response.data.message.includes("AUTH SUCCESS") ||
          response.data.message.includes("FETCH")) {
        return response;
      }      
      
      toast.success(response.data.message);
    }
    return response;
  },
  error => {
    // Let axiosData handle errors; reject so promises catch them
    return Promise.reject(error);
  }
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
      if (err?.response?.data?.message?.includes("AUTH FAIL")){
        return null;
      }

      toast.error(err?.response?.data?.message || "Algo salió mal");
      return null;
    }
  }
};