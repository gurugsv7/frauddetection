import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HospitalLogin } from './components/auth/HospitalLogin';
import { InsuranceLogin } from './components/auth/InsuranceLogin';
import { HospitalApp } from './components/hospital/HospitalApp';
import { InsuranceApp } from './components/insurance/InsuranceApp';
import { LandingPage } from './components/shared/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/*" element={<HospitalApp />} />
          <Route path="/insurance/login" element={<InsuranceLogin />} />
          <Route path="/insurance/*" element={<InsuranceApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;