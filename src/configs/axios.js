import axios from "axios";

const rt = localStorage.getItem("route");
const pt = localStorage.getItem("port");
const tp = localStorage.getItem("typert");

const route = `${tp}://${rt}:${pt}`;

const api = axios.create({
  baseURL: route,
});

export default api;
