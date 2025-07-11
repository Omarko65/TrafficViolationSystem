import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Utils/Spinner';
import AlertComponent from '../components/Utils/AlertComponent';
import api from '../api';

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("")
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("")
  const [phonenumber, setPhoneNumber] = useState("");
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
      try {
        const payload = {};
        if (id) payload.officer_id = id;
        if (email) payload.email = email;
        if (phonenumber) payload.phone_number = phonenumber;
        if (role) payload.role = role;
        if (
          (newpassword && !confirmpassword) ||
          (!newpassword && confirmpassword)
        ) {
          setAlert({
            open: true,
            message: "Password and Confirm Password needed",
            severity: "error",
          });
          return;
        }
        if (newpassword !== confirmpassword) {
          setAlert({
            open: true,
            message: "Password must be same with confirm password",
            severity: "error",
          });
          return;
        } 
        if (newpassword && confirmpassword) {
          payload.password = newpassword;
        }
        console.log(payload)
        const res = await api.put("/api/officer/update/", payload);
        if (res.status === 200) {
          console.log(res.data);
          setAlert({
            open: true,
            message: `Successfully Updated officer!.`,
            severity: "success",
          });
        }
        console.log(res.data)
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setAlert({
              open: true,
              message: "Invalid User ID",
              severity: "error",
            });
            return;
          } else {
            console.log(error.response.data);
            setAlert({
              open: true,
              message: "An error occurred: " + error.response.data.message,
              severity: "error",
            });
            return
          }
        } else {
          console.log(error)
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
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">
            Profile & Settings
          </h2>
          <a href="/mfa-options">
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Enable Mfa
            </button>
          </a>
        </div>

        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-blue-800">
            Account Settings
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Officer ID
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="text"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g., FRSC123456"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="newpassword"
                value={newpassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="confirmpassword"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="OFFICER">Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., user@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="text"
                name="phonenumber"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., +2341234567890"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSettings;