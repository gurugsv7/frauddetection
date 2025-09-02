import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../shared/Layout';
import { HospitalDashboard } from './HospitalDashboard';

export function HospitalApp() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'hospital')) {
      navigate('/hospital/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Hospital Portal...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'hospital') {
    return <Navigate to="/hospital/login" replace />;
  }

  return (
    <Layout portalType="hospital">
      <Routes>
        <Route path="/dashboard" element={<HospitalDashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}