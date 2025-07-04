import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../components/Utils/AlertComponent';
import api from '../api';
import Spinner from '../components/Utils/Spinner';


const NewViolationEntry = () => {
    const [loading, setLoading] = useState(false);
    const [license_plate, setLicensePlate] = useState("");
    const [offender_name, setOffenderName] = useState("")
    const [license_id, setLicenseId] = useState(0);
    const [violation_type, setViolationType] = useState("")
    const [location, setLocation] = useState("");
    const [evidence, setEvidence] = useState(null);
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
      const formData = new FormData();
      formData.append("license_plate", license_plate);
      formData.append("offender_name", offender_name);
      formData.append("license_id", license_id);
      formData.append("violation_type", violation_type);
      formData.append("location", location);
      if (evidence) {
        formData.append("evidence", evidence);
      }

      try {
        const res = await api.post("/api/violations/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        if (res.status === 201) {
          console.log('success')
          console.log(res.data);
          const newviolation = res.data
          setAlert({
            open: true,
            message: `Violation successfully registered`,
            severity: "success",
          });
          navigate("/violation-ticket", { state: newviolation });
          
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setAlert({
              open: true,
              message: "An error occurred: " + error.response.data.message,
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
      } finally {
        setLoading(false);
      }
    }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl justify-self-center font-bold mb-6 text-blue-800">
          New Violation Entry
        </h2>
        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              Violation Details
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                License Plate
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="text"
                name="license_plate"
                value={license_plate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="e.g., ABJ123FG"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Offender Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="text"
                name="offender_name"
                value={offender_name}
                onChange={(e) => setOffenderName(e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                License ID
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="number"
                placeholder="123456"
                name="license_id"
                value={license_id}
                onChange={(e) => setLicenseId(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Violation Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={violation_type}
                onChange={(e) => setViolationType(e.target.value)}
              >
                <option value="">Select violation type</option>
                <option value="SPEEDING">Speeding</option>
                <option value="RED LIGHT">Red Light</option>
                <option value="U-TURN">U-turn</option>
                <option value="PARKING">Parking</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Location
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Ikeja Roundabout"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Date and Time
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value="2025-06-19 10:00"
                readOnly
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Evidence Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEvidence(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default NewViolationEntry;