import React, { useState } from "react";
import { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import imageToBase64 from "image-to-base64/browser";
import { TEMP_ACCESS_TOKEN, TEMP_REFRESH_TOKEN, USER_ROLE, ACCESS_TOKEN,  REFRESH_TOKEN} from '../constants'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import logo from '../assets/frsc-logo.png';
import AlertComponent from '../components/Utils/AlertComponent';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Utils/Spinner';

const FaceRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
      open: false,
      message: "",
      severity: "info",
    });
  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  
  const capture = useCallback(() => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    imageToBase64(imageSrc) 
      .then( async (response) => {
        const fd = new FormData
        fd.append('photo', response)
        try {
            const res = await api.post("/api/faceid/", fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200) {
                const access = localStorage.getItem(TEMP_ACCESS_TOKEN);
                const refresh = localStorage.getItem(TEMP_REFRESH_TOKEN);
                localStorage.clear();
                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);
                const userrole = await api.get("/api/user/");
                localStorage.setItem(USER_ROLE, userrole.data.role);
                if (userrole.data.role === "ADMIN") {
                  navigate("/admin-dashboard");
                } else {
                  navigate("/officer-dashboard");
                }
            }
        }  catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                setAlert({
                    open: true,
                    message: "Verification Failed.",
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
        // console.log(response); 
      })
      .catch((error) => {
        console.log(error); 
      });

  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };


  

  return (
    <div className="min-h-screen bg-frsc-white flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center flex-grow">
        <AlertComponent
          open={alert.open}
          handleClose={handleClose}
          message={alert.message}
          severity={alert.severity}
        />
        <div className="bg-frsc-white p-8 rounded-md shadow-lg w-full max-w-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-center text-frsc-blue flex items-center justify-center">
            <LockClosedIcon className="h-6 w-6 mr-2" />
            Verify ID
          </h2>
          <div className="mb-6">
            {imgSrc ? (
              <img src={imgSrc} alt="webcam" />
            ) : (
              <Webcam height={600} width={600} ref={webcamRef} />
            )}
          </div>

          {imgSrc ? (
            <>
              {loading && (
                <button className="w-full bg-frsc-yellow text-frsc-blue my-4 py-2 rounded-md hover:bg-yellow-400 flex items-center justify-center">
                  <Spinner />
                </button>
              )}

              <button
                className="w-full bg-frsc-yellow text-frsc-blue my-4 py-2 rounded-md hover:bg-yellow-400 flex items-center justify-center"
                onClick={retake}
              >
                Retake
              </button>
            </>
          ) : (
            <button
              className="w-full bg-frsc-yellow text-frsc-blue py-2 rounded-md hover:bg-yellow-400 flex items-center justify-center"
              onClick={capture}
            >
              Verify
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FaceRecognition
