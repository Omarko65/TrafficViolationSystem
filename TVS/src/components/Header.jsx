import React, { useState } from 'react';
import frscLogo from '../assets/frsc-logo.png';
import coatOfArms from '../assets/coat-of-arms.png';
import { useEffect } from 'react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check for token in localStorage to determine login status
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role")
    setIsLoggedIn(!!token);
    setUserRole(role)
  }, []);
  return (
    <header className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={frscLogo} alt="FRSC Logo" className="w-16 h-16 mr-4" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Federal Road Safety Corps</h1>
          <p className="text-sm">Federal Republic of Nigeria</p>
          <p className="text-xs italic">
            Creating a safe motoring environment in Nigeria
          </p>
        </div>
        <div className="flex items-center">
          <img
            src={coatOfArms}
            alt="Nigerian Coat of Arms"
            className="w-16 h-16 ml-4"
          />
        </div>
      </div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2">
          <ul className="flex flex-wrap justify-center gap-4">
            {!isLoggedIn && (
              <>
                <li>
                  <a
                    href="/home"
                    className="text-blue-800 hover:text-blue-600 font-medium"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="text-blue-800 hover:text-blue-600 font-medium"
                  >
                    Login
                  </a>
                </li>
              </>
            )}
            {isLoggedIn && userRole === "ADMIN" && (
              <li>
                <a
                  href="/admin-dashboard"
                  className="text-blue-800 hover:text-blue-600 font-medium"
                >
                  Admin Dashboard
                </a>
              </li>
            )}
            {isLoggedIn && userRole === "OFFICER"  && (
              <li>
                <a
                  href="/officer-dashboard"
                  className="text-blue-800 hover:text-blue-600 font-medium"
                >
                  Officer Dashboard
                </a>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <a
                    href="/new-violation"
                    className="text-blue-800 hover:text-blue-600 font-medium"
                  >
                    New Violation
                  </a>
                </li>
                <li>
                  <a
                    href="/report-generation"
                    className="text-blue-800 hover:text-blue-600 font-medium"
                  >
                    Report Generation
                  </a>
                </li>
                <li>
                  <a
                    href="/profile-settings"
                    className="text-blue-800 hover:text-blue-600 font-medium"
                  >
                    Profile Settings
                  </a>
                </li>
              </>
            )}
            {isLoggedIn && userRole === "ADMIN" && (
              <li>
                <a
                  href="/register"
                  className="text-blue-800 hover:text-blue-600 font-medium"
                >
                  Register New Officer
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;