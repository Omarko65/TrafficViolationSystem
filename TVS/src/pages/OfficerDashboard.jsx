import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import api from "../api";

const OfficerDashboard = () => {
  const [violations, setViolations] = useState([]);
  const [officer, setOfficer] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get(`/api/violations/search/${encodeURIComponent(search)}/`);
      setResults(res.data); // or update your table state
      console.log(res.data)
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const todaysViolations = useMemo(
    () => violations.filter(v => v.violation_date === today),
    [violations]
  );

  useEffect(() => {
    getViolations();
  }, [])



  const getViolations = () => {
    api
      .get("/api/violations/")
      .then((res) => res.data)
      .then((data) => {setViolations(data); console.log(data)})
      .catch((err) => alert(err));
  };



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between">
          <h2 className="justify-self-center text-2xl font-bold mb-6 text-blue-800">
            Officer Dashboard
          </h2>
          <a href="/logout" className="cursor-pointer">
            <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
              Logout
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Today's Violations
            </h3>
            <p className="text-gray-600">
              {todaysViolations.length} violation
              {todaysViolations.length !== 1 && "s"} recorded today
            </p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Actions</h3>
            <a href="/new-violation">
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Create New Violation
              </button>
            </a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4 text-blue-800">
            Past Violations
          </h3>
          <div className="my-4">
            <form onSubmit={handleSearch}>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search by license id or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">License ID</th>
                <th className="border p-2">License Plate</th>
                <th className="border p-2">Violation ID</th>
                <th className="border p-2">Violation Type</th>
                <th className="border p-2">FEE STATUS</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            {results.length >= 1 ? (
              <tbody>
                {results.map((v) => (
                  <tr key={v.id}>
                    <td className="border p-2">DRV{v.license_id}</td>
                    <td className="border p-2">{v.license_plate}</td>
                    <td className="border p-2">{v.id}</td>
                    <td className="border p-2">{v.violation_type}</td>
                    <td className="border p-2">{v.fee_status}</td>
                    <td className="border p-2">{v.violation_date}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {violations.map((violation) => (
                  <tr key={violation.id}>
                    <td className="border p-2">DRV{violation.license_id}</td>
                    <td className="border p-2">{violation.license_plate}</td>
                    <td className="border p-2">{violation.id}</td>
                    <td className="border p-2">{violation.violation_type}</td>
                    <td className="border p-2">{violation.fee_status}</td>
                    <td className="border p-2">{violation.violation_date}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OfficerDashboard;
