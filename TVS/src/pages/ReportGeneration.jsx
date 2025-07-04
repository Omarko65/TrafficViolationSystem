import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AlertComponent from '../components/Utils/AlertComponent';
import api from '../api';

const ReportGeneration =  () => {
  const [loading, setLoading] = useState(false);
  const [violationType, setViolationType] = useState(null);
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info",
      });


    const handleClose = () => {
      setAlert({ ...alert, open: false });
    };
  

  const fetchReport = async(e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.get(`/api/violations/report/${startDate}/${endDate}/`);
      setReportData(res.data);
      console.log(res.data)
      console.log('success')
    } catch (error) {
      console.error("Error fetching report:", error);
      if (error.response) {
        if (error.response.status === 404) {
          setAlert({
            open: true,
            message: error.response.data.detail,
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
    }
  }

  

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="justify-self-center text-2xl font-bold mb-6 text-blue-800">
          Report Generation
        </h2>
        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-800">
            Generate Report
          </h3>
          <form onSubmit={fetchReport}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Date Range
                </label>
                <div className="w-full px-3 py-2 flex gap-3 border-1 border-gray-300 rounded-md">
                  <input
                    className=""
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              {/* <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Violation Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setViolationType(e.target.value)}
                >
                  <option>All</option>
                  <option value="SPEEDING">Speeding</option>
                  <option value="RED LIGHT">Red Light</option>
                  <option value="U-TURN">U-turn</option>
                  <option value="PARKING">Parking</option>
                </select>
              </div> */}
              {/* <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Location
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Ikeja"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div> */}
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Generate Report
            </button>
          </form>

          <div className="mt-6 flex gap-4">
            <button className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
              Print
            </button>
          </div>

          <table className="mt-6 w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Officer ID</th>
                <th className="border p-2">License Plate</th>
                <th className="border p-2">Violation ID</th>
                <th className="border p-2">Violation Type</th>
                <th className="border p-2">FEE STATUS</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            {reportData.length >= 1 ? (
              <tbody>
                {reportData.map((v) => (
                  <tr key={v.id}>
                    <td className="border p-2">FRSC{v.license_id}</td>
                    <td className="border p-2">{v.license_plate}</td>
                    <td className="border p-2">{v.id}</td>
                    <td className="border p-2">{v.violation_type}</td>
                    <td className="border p-2">{v.fee_status}</td>
                    <td className="border p-2">{v.violation_date}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              ""
            )}
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportGeneration;