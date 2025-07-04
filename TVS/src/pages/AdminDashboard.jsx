import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/adminstats/");
        console.log(res.data);
        setStats(res.data);
        
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between">
          <h2 className="justify-self-center text-2xl font-bold mb-6 text-blue-800">
            Admin Dashboard
          </h2>
          <a href="/logout">
            <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
              Logout
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Total Violations
            </h3>
            <p className="text-gray-600">{stats.violations} Violations</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Common Offenses
            </h3>
            <p className="text-gray-600">{stats.violation_stats}</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Payment Stats
            </h3>
            <p className="text-gray-600">{stats.fee_stats} Payments Recieved</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4 text-blue-800">
            Recent Activity
          </h3>
          <ul className="text-gray-600">
            <li>Officer added violation - 2025-06-19 10:00</li>
            <li>User account created - 2025-06-18 15:30</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <a
            href="/profile-settings"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex justify-center"
          >
            <button>Manage Profile</button>
          </a>
          <a
            href="/report-generation"
            className="p-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex justify-center"
          >
            <button>Generate Reports</button>
          </a>
        </div>
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-800">System Logs</h3>
          <p className="text-gray-600">No recent logs.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;