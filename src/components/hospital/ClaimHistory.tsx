import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { claimsService } from '../../services/claimsService';
import { Claim } from '../../types';
import { Calendar, DollarSign, FileText, Search } from 'lucide-react';

export function ClaimHistory() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadClaims();
  }, [user]);

  const loadClaims = async () => {
    if (!user) return;
    
    try {
      const hospitalClaims = await claimsService.getClaimsByHospital(user.id);
      setClaims(hospitalClaims);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${claim.patient.firstName} ${claim.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'sent_to_insurance': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      case 'hospital_review': return 'bg-yellow-100 text-yellow-800';
      case 'insurance_review': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by claim ID or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="hospital_review">Hospital Review</option>
          <option value="sent_to_insurance">Sent to Insurance</option>
          <option value="insurance_review">Insurance Review</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {filteredClaims.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'No claims match your current filters' 
              : 'Submit your first claim to see it here'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div key={claim.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{claim.id}</h4>
                  <p className="text-gray-600">
                    {claim.patient.firstName} {claim.patient.lastName}
                  </p>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Treatment Date</p>
                    <p className="text-sm font-medium">{new Date(claim.treatment.treatmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Claim Amount</p>
                    <p className="text-sm font-medium">${claim.claimAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Documents</p>
                    <p className="text-sm font-medium">{claim.documents.length} files</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Treatment:</span> {claim.treatment.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Diagnosis: {claim.treatment.diagnosisCode} | Procedure: {claim.treatment.procedureCode}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
