import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserPlusIcon, PencilIcon, TrashIcon, KeyIcon, ArrowDownCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Spinner from '../components/Utils/Spinner';
import AlertComponent from '../components/Utils/AlertComponent';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [phone_number, setPhoneNumber] = useState(0);
  const [role, setRole] = useState("")
  const [photo, setFaceID] = useState(null);
  const [password, setPassword] = useState("");
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
    formData.append("name", name)
    formData.append("email", email)
    formData.append("phone_number", phone_number)
    formData.append("role", role)
    formData.append("password", password);
    if (photo) {
      formData.append("photo", photo)
    }
    try {
      const res = await api.post("/api/user/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.clear();
      if (res.status === 201) {
        console.log(res.data);
        setAlert({
          open: true,
          message: `Successfully Registered officer!. Officer ID => FRSC${res.data['id']}. Message disappearing soon`,
          severity: "success",
        });
        setTimeout(() => {
          navigate("/logout");
        }, 9000);
      }
    } catch (error) {
      let errorMessage = "An error occurred.";
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          const errors = error.response.data;
          const errorMessages = [];

          for (const [field, messages] of Object.entries(errors)) {
            if (field === "email") {
              errorMessages.push(
                "Email: A user with this email already exists."
              );
            } else {
              const formattedMessages = messages.map(
                (msg) =>
                  `${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`
              );
              errorMessages.push(...formattedMessages);
            }
          }
          errorMessage = errorMessages.join(" ");
        } else {
          errorMessage = "An error occurred: " + error.response.data.message;
        }
      } else {
        // console.log(error)
        errorMessage = error;
      }
      setAlert({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-frsc-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-frsc-blue">
          User Management
        </h2>
        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />

        {/* Add New User Form */}
        <div className="bg-frsc-white p-6 rounded-md shadow-lg mb-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-frsc-blue flex items-center">
            <UserPlusIcon className="h-6 w-6 mr-2" />
            Add New User
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  User ID
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  placeholder="e.g., FRSC001"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Full Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., user@frsc.gov.ng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Phone Number
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  type="number"
                  name="phone_number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., +2341234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="OFFICER">Officer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Passport Photo
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFaceID(e.target.files[0])}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Input Password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-frsc-yellow text-frsc-blue py-2 px-4 rounded-md hover:bg-yellow-400 flex items-center cursor-pointer"
            >
              {loading ? (
                <Spinner />
              ) : (
                <div className="flex">
                  <UserPlusIcon className="h-5 w-5 mr-2" />{" "}
                  <span>Add User</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* User Table */}
        <div className="bg-frsc-white p-6 rounded-md shadow-lg border border-gray-200 overflow-x-auto">
          <h3 className="text-xl font-bold mb-4 text-frsc-blue">
            Existing Users
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left text-frsc-blue">User ID</th>
                <th className="border p-3 text-left text-frsc-blue">
                  Full Name
                </th>
                <th className="border p-3 text-left text-frsc-blue">Email</th>
                <th className="border p-3 text-left text-frsc-blue">Phone</th>
                <th className="border p-3 text-left text-frsc-blue">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">FRSC001</td>
                <td className="border p-3">John Doe</td>
                <td className="border p-3">john@frsc.gov.ng</td>
                <td className="border p-3">+2341234567890</td>
                <td className="border p-3 flex gap-2">
                  <button className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="bg-red-600 text-white p-1 rounded-md hover:bg-red-700">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <button className="bg-gray-500 text-white p-1 rounded-md hover:bg-gray-600">
                    <KeyIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;