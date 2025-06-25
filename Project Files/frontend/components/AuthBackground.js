import React from 'react';
import '../pages/Login.css';

const AuthBackground = ({ children }) => (
  <div className="login-bg-animated">
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 2,
    }}>
      {children}
    </div>
  </div>
);

export default AuthBackground; 