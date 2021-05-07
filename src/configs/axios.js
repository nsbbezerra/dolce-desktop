import axios from "axios";

const rt = localStorage.getItem("route");
const pt = localStorage.getItem("port");
const tp = localStorage.getItem("typert");

let route;

if (pt === "" || pt === null || !pt) {
  route = `${tp}://${rt}`;
} else {
  route = `${tp}://${rt}:${pt}`;
}

localStorage.setItem("baseUrl", route);

const api = axios.create({
  baseURL: route,
});

export default api;
