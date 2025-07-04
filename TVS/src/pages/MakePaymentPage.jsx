import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import AlertComponent from "../components/Utils/AlertComponent";
import api from "../api";
import logo from "../assets/frsc-logo.png";

const MakePaymentPage = () => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(20000)
  
  
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fee = {
    "SPEEDING": 30000,
    "RED LIGHT":25000,
    "U-TURN": 20000,
    "PARKING": 15000
  };
  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const config = {
    public_key: "FLWPUBK_TEST-98fd17629703c19af51fce076d5b53e1-X",
    tx_ref: Date.now(),
    amount: value,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "user@gmail.com",
      phone_number: "070********",
      name: "john doe",
    },
    customizations: {
      title: "Road Violation payment",
      description: "Deposit to FRSC Account",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: "Pay with Flutterwave!",
    callback: (response) => {
      console.log(response);
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {},
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.get(`/api/violations/${id}/`);
      if (res.status === 200) {
        console.log("success");
        console.log(res.data);
        setValue(res.data["violation_type"]);
        setAlert({
          open: true,
          message: `Redirecting to payment page`,
          severity: "success",
        });
        handleFlutterPayment({
          callback: async (response) => {
            console.log(response);
            await api.patch(`/api/violations/${id}/`, {
              fee_status: "PAID",
            });

            if (response.status === "successful") {
              console.log("Completed");
              setAlert({
                open: true,
                message: `Payment successful`,
                severity: "success",
              });
            } else {
              console.log("failed");
            }
            closePaymentModal(); // Close the modal programmatically
          },
          onClose: () => {
            setAlert({
              open: true,
              message: "Payment Cancelled",
              severity: "error",
            });
          },
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.log(error.response)
          setAlert({
            open: true,
            message: "Invalid violation id",
            severity: "error",
          });
        } else {
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
  };

  return (
    <div className="min-h-screen bg-frsc-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center flex-grow">
        <div className="mb-6 text-center">
          <img src={logo} alt="FRSC Logo" className="w-24 h-24 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-frsc-blue">
            Federal Road Safety Corps
          </h1>
        </div>
        <div className="bg-frsc-white p-8 rounded-md shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-center text-frsc-blue flex items-center justify-center">
            <CreditCardIcon className="h-6 w-6 mr-2" />
            Make Payment
          </h2>
          <AlertComponent
            open={alert.open}
            handleClose={handleClose}
            message={alert.message}
            severity={alert.severity}
          />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Violation ID
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-frsc-yellow"
                placeholder="e.g., VIO123456"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <button className="w-full bg-frsc-yellow text-frsc-blue py-2 rounded-md hover:bg-yellow-400 flex items-center justify-center">
              <CreditCardIcon className="h-5 w-5 mr-2" />
              {loading ? "Uploading..." : "Proceed to Payment"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            You will be redirected to a secure payment gateway.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MakePaymentPage;
