import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NODE_ENV == "development"
      ? `http://${process.env.NGINX_HOST}`
      : `http://${process.env.NGINX_HOST}`,
  withCredentials: true,
});
