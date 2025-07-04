import React, {useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import logo from '../assets/frsc-logo.png';
import { ACCESS_TOKEN, REFRESH_TOKEN, TEMP_ACCESS_TOKEN, TEMP_REFRESH_TOKEN, USER_ROLE } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AlertComponent from '../components/Utils/AlertComponent';
import Spinner from '../components/Utils/Spinner';

const LoginPage = () => {
  // const { setIsAuthorized } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });


  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };


  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const res = await api.post("/api/token/", { id, password });
      localStorage.clear();
      localStorage.setItem(TEMP_ACCESS_TOKEN, res.data.access);
      localStorage.setItem(TEMP_REFRESH_TOKEN, res.data.refresh);
      navigate("/mfa-authentication");
      // localStorage.setItem(ACCESS_TOKEN, res.data.access);
      // localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      // const userrole = await api.get("/api/user/");
      // localStorage.setItem(USER_ROLE, userrole.data.role);
      // if (userrole.data.role === 'ADMIN') {
      //   navigate("/admin-dashboard")
      // } else {
      //   navigate("/officer-dashboard");

      // }
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.log(error.response.data);
          setAlert({
            open: true,
            message: "Invalid user id or password",
            severity: "error",
          });
        } else {
          console.log(error.response.data)
          setAlert({
            open: true,
            message: "An error occurred: " + error.response.data.message,
            severity: "error",
          });
        }
      } else {

        setAlert({
          open: true,
          message: "An error occurred: " + error,
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-frsc-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center flex-grow">
        <div className="mb-6 text-center">
          <img src={logo} alt="FRSC Logo" className="w-24 h-24 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-frsc-blue">
            Federal Road Safety Corps
          </h1>
        </div>
        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />
        <div className="bg-frsc-white p-8 rounded-md shadow-lg w-full max-w-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-6 text-center text-frsc-blue flex items-center justify-center">
              <LockClosedIcon className="h-6 w-6 mr-2" />
              Login
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                User ID
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                placeholder="e.g., FRSC001"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-frsc-yellow text-frsc-blue py-2 rounded-md hover:bg-yellow-400 flex items-center justify-center"
            >
              {loading ? (
                <Spinner />
              ) : (
                <div className="flex">
                  <LockClosedIcon className="h-5 w-5 mr-2" /> <span>Login</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-frsc-blue hover:text-blue-600"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;