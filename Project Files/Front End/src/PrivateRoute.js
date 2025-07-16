import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * PrivateRoute protects routes based on authentication and (optionally) user role.
 * Usage:
 * <Route element={<PrivateRoute role="admin" />}>...</Route>
 */
const PrivateRoute = ({ role }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;
    const isApproved = decoded.isApproved;

    // Check if user has the required role
    if (role && userRole !== role) {
      // If the user is at the wrong dashboard, redirect them to their correct one
      return <Navigate to={`/${userRole}`} replace />;
    }

    // Special check for unapproved doctors trying to access doctor routes
    if (userRole === 'doctor' && !isApproved) {
      // Optionally, you can redirect them to a specific "pending approval" page
      // For now, we just block access and send them back to login.
      // A message can be shown on the login page.
      return <Navigate to="/login?status=pending_approval" replace />;
    }

    // If all checks pass, render the child route
    return <Outlet />;
  } catch (e) {
    // If token is invalid or expired, clear it and redirect to login
    console.error('Invalid token:', e);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute; 