import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Federal Road Safety Corps</h3>
            <p className="text-sm">Creating a safe motoring environment in Nigeria</p>
          </div>
          <div className="text-sm">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="mb-1">Phone: +234 123 456 7890</p>
            <p className="mb-1">Email: info@frsc.gov.ng</p>
            <p className="mb-1">Address: FRSC Headquarters, Abuja, Nigeria</p>
            <div className="flex gap-4 mt-2">
              <span className="text-gray-300"></span>
              <span className="text-gray-300"></span>
              <span className="text-gray-300"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-900 py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 Federal Road Safety Corps, Nigeria. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;