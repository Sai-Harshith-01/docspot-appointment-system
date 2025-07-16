import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './components/Layout';
import FindDoctor from './pages/FindDoctor';
import userRoutes from './components/UserRoutes';
import doctorRoutes from './components/DoctorRoutes';
import adminRoutes from './components/AdminRoutes';
import CompleteProfile from './pages/CompleteProfile';
import DoctorPublicProfile from './pages/DoctorPublicProfile';

function App() {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-doctor" element={<FindDoctor />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/doctor/:id" element={<DoctorPublicProfile />} />
          {userRoutes}
          {doctorRoutes}
          {adminRoutes}
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}

export default App;
