import React from 'react'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation } from "react-router-dom";

const ViolationTicket = () => {

    const { state: violation } = useLocation();
    const fee = {
      'SPEEDING': "₦30,000",
      "RED LIGHT": "₦25,000",
      "U-TURN": "₦20,000",
      'PARKING': "₦15,000",
    };
    const {
      id,
      license_plate,
      offender_name,
      license_id,
      violation_type,
      location,
      violation_date,
      evidence,
    } = violation || {};
  return (
    <div className="min-h-screen  bg-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl justify-self-center font-bold mb-6 text-blue-800">
          Violation Ticket
        </h2>
        <div className=" bg-white p-6 rounded-md shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className=" font-medium">
                License Plate:{" "}
                <span className="font-normal">{license_plate}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                Offender Name:{" "}
                <span className="font-normal">{offender_name}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                License ID: <span className="font-normal">{license_id}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                Violation Type:{" "}
                <span className="font-normal">{violation_type}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                Violation ID:{" "}
                <span className="font-normal">{id}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                Location: <span className="font-normal">{location}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                Fee: <span className="font-normal">{fee[violation_type]}</span>
              </p>
            </div>
            <div>
              <p className=" font-medium">
                Date: <span className="font-normal">{violation_date}</span>
              </p>
            </div>

            <div>
              <p className=" font-medium">
                Evidence: <img src={evidence} />
              </p>
            </div>
          </div>
          <div className="flex gap-4 justify-self-center w-[100px]">
            <button className="bg-blue-800 w-full  text-white py-2 px-4 mx-auto rounded-md hover:bg-gray-600">
              Print
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViolationTicket
