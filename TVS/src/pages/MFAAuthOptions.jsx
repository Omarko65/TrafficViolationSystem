import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/frsc-logo.png';

const MFAAuthOptions = () => {
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
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIy6HNc3zXzJ9-y-rNEfnaSdhcgeXytmnQg&s"
                alt=""
              />
              <form action="">
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
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                  Verify Code
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