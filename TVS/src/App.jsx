import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OfficerDashboard from "./pages/OfficerDashboard";
import NewViolationEntry from "./pages/NewViolationEntry";
import ViolationSearchView from "./pages/ViolationSearchView";
import UserManagement from "./pages/UserManagement";
import ReportGeneration from "./pages/ReportGeneration";
import NotificationCenter from "./pages/NotificationCenter";
import MFAVerification from "./pages/MFAVerification";
import ProfileSettings from "./pages/ProfileSettings";
import MFAAuthOptions from "./pages/MFAAuthOptions";
import AdminDashboard from "./pages/AdminDashboard";
import MakePaymentPage from "./pages/MakePaymentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ViolationTicket from "./pages/ViolationTicket";
import OtpPage from "./pages/OtpPage";
import { RoleProvider } from "./context/RoleContext";
import RoleRoute from "./components/RoleRoute";
import MFAOtpPage from "./pages/MFAOtpPage";


function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout() {
  localStorage.clear()
  return <UserManagement/>
}
const App = () => {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mfa-authentication" element={<OtpPage />} />
          <Route path="/mfa-verification" element={<MFAVerification />} />
          <Route path="/mfa-otp" element={<MFAOtpPage />} />
          <Route
            path="/mfa-options"
            element={
              <MFAAuthOptions />
              // <ProtectedRoute>
              //   <MFAAuthOptions />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/officer-dashboard"
            element={
              <ProtectedRoute>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-violation"
            element={
              <ProtectedRoute>
                <NewViolationEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/violation-ticket"
            element={
              <ProtectedRoute>
                <ViolationTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/violation-search"
            element={
              <ProtectedRoute>
                <ViolationSearchView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={<RegisterAndLogout />}
            // element={
            //   <RoleRoute allow={["ADMIN"]}>
            //     <ProtectedRoute>
            //       <RegisterAndLogout />
            //     </ProtectedRoute>
            //   </RoleRoute>
            // }
          />
          <Route path="/logout" element={<Logout />} />

          <Route
            path="/report-generation"
            element={
              <RoleRoute allow={["ADMIN"]}>
                <ProtectedRoute>
                  <ReportGeneration />
                </ProtectedRoute>
              </RoleRoute>
            }
          />
          <Route
            path="/notification-center"
            element={
              <ProtectedRoute>
                <NotificationCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <RoleRoute allow={["ADMIN"]}>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              </RoleRoute>
            }
          />
          <Route path="/make-payment" element={<MakePaymentPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </RoleProvider>
    </BrowserRouter>
  );
};

export default App;
