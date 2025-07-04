import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-frsc-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center flex-grow">
        <div className="bg-frsc-white p-6 rounded-md shadow-lg text-center border border-gray-200 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-frsc-blue">Welcome to FRSC Traffic System</h2>
          <p className="text-gray-600 mb-6">
            This system supports the Federal Road Safety Corps in managing traffic violations, ensuring a safe motoring environment in Nigeria.
          </p>
          <a
            href="/make-payment"
            className="bg-frsc-yellow text-frsc-blue py-2 px-4 rounded-md hover:bg-yellow-400 flex items-center justify-center mx-auto"
          >
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Make Payment
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;