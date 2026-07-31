import axios from "axios";
import { logoutUser } from "../../../utils/logoutUser";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logoutUser(); 
    }
    return Promise.reject(error);
  }
);

export default api;
