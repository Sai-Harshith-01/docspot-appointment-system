import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorProfile from "../pages/DoctorProfile";

const doctorRoutes = (
  <Route element={<PrivateRoute role="doctor" />}>
    <Route path="/doctor" element={<DoctorDashboard />} />
    <Route path="/doctor/profile" element={<DoctorProfile />} />
  </Route>
);

export default doctorRoutes; 