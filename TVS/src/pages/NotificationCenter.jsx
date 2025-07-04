import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotificationCenter = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Notification Center</h2>
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-800">System Notifications</h3>
          <ul className="text-gray-600">
            <li className="p-2 border-b">OTP sent to officer@example.com - 2025-06-19 10:00</li>
            <li className="p-2 border-b">Failed login attempt - 2025-06-18 15:30</li>
            <li className="p-2">User account created - 2025-06-18 14:00</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationCenter;