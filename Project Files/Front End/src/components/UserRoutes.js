import React from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import UserDashboard from "../pages/UserDashboard";

const userRoutes = (
  <Route element={<PrivateRoute role="user" />}>
    <Route path="/user" element={<UserDashboard />} />
  </Route>
);

export default userRoutes; 