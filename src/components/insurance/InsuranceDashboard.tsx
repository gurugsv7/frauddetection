import React, { useState, useEffect } from 'react';
import { claimsService } from '../../services/claimsService';
import { Claim } from '../../types';
import { ClaimFilters } from './ClaimFilters';
import { ClaimDetailView } from './ClaimDetailView';
import { 
  AlertTriangle, 
  Eye, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

export function InsuranceDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
    const interval = setInterval(() => {
      loadClaims();
    }, 2000); // Poll every 2 seconds for new claims
    return () => clearInterval(interval);
  }, []);

  const loadClaims = async () => {
    try {
      const allClaims = await claimsService.getInsuranceClaims();
      // console.log('[InsuranceDashboard] Loaded claims:', allClaims);
      setClaims(allClaims);
      setFilteredClaims(allClaims);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimUpdate = async (claimId: string, status: Claim['status'], notes?: string) => {
    try {
      await claimsService.updateClaimStatus(claimId, status, notes, 'Current Reviewer');
      await loadClaims();
      setSelectedClaim(null);
    } catch (error) {
      console.error('Error updating claim:', error);
    }
  };

  const stats = {
    total: claims.length,
    flagged: claims.filter(c => c.status === 'flagged' || c.status === 'insurance_review' || (c.fraudScore && c.fraudScore > 70)).length,
    approved: claims.filter(c => c.status === 'approved').length,
    reviewing: claims.filter(c => c.status === 'sent_to_insurance' || c.status === 'insurance_review').length,
    avgFraudScore: claims.length > 0 ? claims.reduce((acc, c) => acc + (c.fraudScore || 0), 0) / claims.length : 0
  };

  // Filtering handlers for stats cards
  const handleShowAll = () => setFilteredClaims(claims);
  const handleShowFlagged = () =>
    setFilteredClaims(claims.filter(c => c.status === 'flagged' || c.status === 'insurance_review' || (c.fraudScore && c.fraudScore > 70)));
  const handleShowReviewing = () =>
    setFilteredClaims(claims.filter(c => c.status === 'sent_to_insurance' || c.status === 'insurance_review'));
  const handleShowApproved = () =>
    setFilteredClaims(claims.filter(c => c.status === 'approved'));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedClaim) {
    return (
      <ClaimDetailView 
        claim={selectedClaim} 
        onBack={() => setSelectedClaim(null)}
        onUpdate={handleClaimUpdate}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Claims Review</h1>
        <p className="text-gray-600">Monitor and review submitted claims for fraud detection</p>
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-2 mt-4">
          <strong>Note:</strong> Only claims submitted and approved during this session will appear here. Data is not persisted after a reload.
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
          onClick={handleShowAll}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:bg-red-50 transition"
          onClick={handleShowFlagged}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged Claims</p>
              <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:bg-yellow-50 transition"
          onClick={handleShowReviewing}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.reviewing}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:bg-purple-50 transition"
          onClick={handleShowApproved}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Fraud Score</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgFraudScore.toFixed(1)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <ClaimFilters 
        claims={claims}
        onFilter={setFilteredClaims}
      />

      {/* Claims List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Insurance Claims Review</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredClaims.map((claim) => (
            <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{claim.id}</h3>
                    <p className="text-gray-600">
                      {claim.patient.firstName} {claim.patient.lastName} • {claim.hospitalName}
                    </p>
                  </div>
                  {claim.fraudScore && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      claim.fraudScore > 70 
                        ? 'bg-red-100 text-red-800' 
                        : claim.fraudScore > 40 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      Risk: {claim.fraudScore}%
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                    claim.status === 'denied' ? 'bg-red-100 text-red-800' :
                    claim.status === 'flagged' ? 'bg-orange-100 text-orange-800' :
                    claim.status === 'insurance_review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                  
                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Review</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-2 font-medium">${claim.claimAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Treatment Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(claim.treatment.treatmentDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Submitted:</span>
                  <span className="ml-2 font-medium">
                    {new Date(claim.submissionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {claim.fraudFlags && claim.fraudFlags.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Fraud Indicators</span>
                  </div>
                  <ul className="text-xs text-red-700 space-y-1">
                    {claim.fraudFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
