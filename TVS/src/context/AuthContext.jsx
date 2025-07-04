import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { Navigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import LoadingIndicator from "../components/Utils/LoadingIndicatior";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      await auth().catch(() => setIsAuthorized(false));
      // setLoading(false);
    };
    checkAuth();
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
        // await fetchUserDetails(); // Fetch user details after refreshing token
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
      // await fetchUserDetails(); // Fetch user details after successful auth
    }
  };

  const fetchUserDetails = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.user_id; // Assuming 'userId' is part of the token payload

    try {
      const response = await api.get(`/api/user/${userId}/`);
      if (response.status === 200) {
        setUserDetails(response.data); // Store user details
      } else {
        setUserDetails(null);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUserDetails(null);
    }
  }, []);

  // if (loading) {
  //   return <LoadingIndicator />; // Show loading indicator while checking auth
  // }

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
