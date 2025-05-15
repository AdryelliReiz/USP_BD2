import axios from "axios";

const api = axios.create({
  baseURL: "http://0.tcp.sa.ngrok.io:17870/api",
});

export default api;