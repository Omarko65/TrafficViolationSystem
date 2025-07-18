import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/frsc-logo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';
import AlertComponent from '../components/Utils/AlertComponent';
import { TEMP_ACCESS_TOKEN, TEMP_REFRESH_TOKEN, USER_ROLE, ACCESS_TOKEN,  REFRESH_TOKEN} from '../constants';
import api from "../api";

const MFAAuthOptions = () => {
  const [qrcode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const access = localStorage.getItem(TEMP_ACCESS_TOKEN);
      const res = await api.post(`/api/mfaverify/`, {
        otp_code: otp,
        officer_id: id,
      });
      if (res.status === 200) {
        setAlert({
          open: true,
          message: "OTP Verification Successfull",
          severity: "success",
        });
        if (access) {
          const refresh = localStorage.getItem(TEMP_REFRESH_TOKEN);
          localStorage.clear()
          localStorage.setItem(ACCESS_TOKEN, access);
          localStorage.setItem(REFRESH_TOKEN, refresh);
          const userrole = await api.get("/api/user/");
          localStorage.setItem(USER_ROLE, userrole.data.role);
          if (userrole.data.role === "ADMIN") {
            navigate("/admin-dashboard");
          } else {
            navigate("/officer-dashboard");
          }
        }
        navigate("/profile-settings");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.log(error.response.data);
          setAlert({
            open: true,
            message: "Invalid OTP",
            severity: "error",
          });
        } else {
          console.log(error.response.data);
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

  useEffect(() => {
      getQrcode();
    }, [])

  const getQrcode = () => {
    api
      .get("/api/mfalogin/")
      .then((res) => res.data)
      .then((data) => {
        setQrCode(data.qrcode);
        console.log(data);
      })
      .catch((err) => alert(err));
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
        <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-6 text-center text-blue-800">
            ENABLE MFA Method
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                Google Authenticator App
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Scan code and input code
              </p>
              <img src={qrcode} alt="" />
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor=""
                  className="hidden w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  OTP CODE
                </label>
                <input
                  type="text"
                  className="w-full my-6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  {loading ? "Checking OTP..." : "Verify Code"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MFAAuthOptions;