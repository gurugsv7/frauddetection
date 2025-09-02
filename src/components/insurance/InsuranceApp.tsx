import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../shared/Layout';
import { InsuranceDashboard } from './InsuranceDashboard';

export function InsuranceApp() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'insurance')) {
      navigate('/insurance/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Insurance Portal...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'insurance') {
    return <Navigate to="/insurance/login" replace />;
  }

  return (
    <Layout portalType="insurance">
      <Routes>
        <Route path="/dashboard" element={<InsuranceDashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}