import React, { useState } from 'react'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import logo from '../assets/frsc-logo.png';
import AlertComponent from '../components/Utils/AlertComponent';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Utils/Spinner';


const OtpPage = () => {
  const [loading, setLoading] = useState(false);
  const [phonenumber, setPhoneNumber] = useState("");
  const navigate = useNavigate()
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async(e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const res = await api.post("/api/otplogin/", {
        phone_number: phonenumber,
      });
      
      if (res.status === 200) {
        setAlert({
          open: true,
          message: res.data.detail,
          severity: "error",
        });
        console.log(res.data)
        navigate('/mfa-verification', {state: res.data.uid});
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setAlert({
            open: true,
            message: "Phone Number not found",
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
          <h2 className="text-xl font-bold mb-6 text-center text-frsc-blue flex items-center justify-center">
            <LockClosedIcon className="h-6 w-6 mr-2" />
            Login With otp
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                placeholder="e.g., 0801234567"
                name="phonenumber"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                  <LockClosedIcon className="h-5 w-5 mr-2" />{" "}
                  <span>Get code</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OtpPage
