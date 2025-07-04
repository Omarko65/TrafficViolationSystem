import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/frsc-logo.png';
import { useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TEMP_ACCESS_TOKEN, TEMP_REFRESH_TOKEN, USER_ROLE, ACCESS_TOKEN,  REFRESH_TOKEN} from '../constants';
import api from '../api';
import AlertComponent from '../components/Utils/AlertComponent';
import Spinner from '../components/Utils/Spinner';

const MFAVerification = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState("")
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const location = useLocation();
  const uid = location.state;
  

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(uid)
    try {
      const res = await api.post(`/api/otpverify/`, {
        otp: otp,
        uid: uid,
      });

      if (res.status === 200) {
        const access = localStorage.getItem(TEMP_ACCESS_TOKEN);
        const refresh = localStorage.getItem(TEMP_REFRESH_TOKEN);
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
        const userrole = await api.get("/api/user/");
        localStorage.removeItem(USER_ROLE);
        localStorage.setItem(USER_ROLE, userrole.data.role);
        localStorage.removeItem(TEMP_ACCESS_TOKEN);
        localStorage.removeItem(TEMP_REFRESH_TOKEN);
        if (userrole.data.role === 'ADMIN') {
          navigate("/admin-dashboard")
        } else {
          navigate("/officer-dashboard");

        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setAlert({
            open: true,
            message: "OTP not valid",
            severity: "error",
          });
        } else {
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
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center flex-grow">
        <div className="mb-6 text-center">
          <img src={logo} alt="FRSC Logo" className="w-24 h-24 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-800">
            Federal Road Safety Corps
          </h1>
        </div>
        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />
        <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-bold mb-6 text-center text-blue-800">
            MFA Verification
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                OTP Code
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 text-sm text-gray-600">
              OTP expires in: <span className="font-bold">5mins</span>
            </div>
            <div className="flex flex-row justify-center gap-4">
              <button
                type="submit"
                className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 "
              >
                {loading ? "Checking OTP..." : "Submit"}
              </button>
              <a href="/mfaauth">
                <div className="p-3 w-auto bg-gray-500 text-white rounded-md hover:bg-gray-600">
                  Back
                </div>
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MFAVerification;