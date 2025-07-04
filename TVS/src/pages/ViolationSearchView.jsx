import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ViolationSearchView = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Violation Search/View</h2>
        <div className="bg-white p-6 rounded-md shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4 text-blue-800">Search Violations</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              className="px-3 py-2 border border-gray-300 rounded-md"
              placeholder="License Plate"
            />
            <input
              className="px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Offender Name"
            />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Violation Type</option>
              <option value="Speeding">Speeding</option>
              <option value="Red Light">Red Light</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Payment Status</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Search
          </button>
        </div>
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-800">Violation Records</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">License Plate</th>
                <th className="border p-2">Offender</th>
                <th className="border p-2">Violation</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">ABJ123FG</td>
                <td className="border p-2">John Doe</td>
                <td className="border p-2">Speeding</td>
                <td className="border p-2">2025-06-18</td>
                <td className="border p-2">Unpaid</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4">
            <h4 className="text-lg font-bold text-blue-800">Details</h4>
            <p className="text-gray-600">Location: Ikeja Roundabout</p>
            <p className="text-gray-600">Evidence: [Image Placeholder]</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViolationSearchView;