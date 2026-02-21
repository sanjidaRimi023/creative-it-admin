import axios from "axios";
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = ()=>{
    axios.interceptors.request.use(config=>{
        return config
    }, error=>{
        return Promise.reject(error)
    })
    return axiosSecure
}
export default useAxiosSecure;
