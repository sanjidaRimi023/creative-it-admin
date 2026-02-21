
import type { AxiosInstance } from "axios";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const axiosSecure: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
});

const useAxiosSecure = (): AxiosInstance => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access-token");
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`; 
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    await logout();
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logout, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;