// auth.js  (or wherever you keep login helpers)
import api from "./api";        // your configured Axios instance

export const fetchAndStoreUser = async () => {
  const { data } = await api.get("/api/user/");   // -> { id, name, email, role, ... }
  localStorage.setItem("role", data.role);        // "OFFICER" | "ADMIN"
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};