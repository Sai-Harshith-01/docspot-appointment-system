import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import AdminDashboard from "../pages/AdminDashboard";

const adminRoutes = (
  <Route element={<PrivateRoute role="admin" />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
);

export default adminRoutes; 