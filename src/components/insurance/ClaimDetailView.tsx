import React, { useState } from 'react';
import { Claim } from '../../types';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Download
} from 'lucide-react';
import { FraudAnalyticsDashboard } from './FraudAnalyticsDashboard';

interface ClaimDetailViewProps {
  claim: Claim;
  onBack: () => void;
  onUpdate: (claimId: string, status: Claim['status'], notes?: string) => void;
}

export function ClaimDetailView({ claim, onBack, onUpdate }: ClaimDetailViewProps) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: Claim['status']) => {
    setIsUpdating(true);
    try {
      await onUpdate(claim.id, status, reviewNotes);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRiskLevelColor = (score?: number) => {
    if (!score) return 'text-gray-600';
    if (score > 70) return 'text-red-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskLevelBg = (score?: number) => {
    if (!score) return 'bg-gray-50 border-gray-200';
    if (score > 70) return 'bg-red-50 border-red-200';
    if (score > 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="w-full p-0">
      <div className="mb-6 pl-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Claims</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{claim.id}</h1>
          <p className="text-gray-600">Detailed claim review and analysis</p>
        </div>
      </div>

      {/* Centered Fraud Analysis */}
      <div className="mb-8 w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 w-full">
          <FraudAnalyticsDashboard claim={claim} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 space-y-6 w-full">
          {/* Patient Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-medium text-gray-900">
                  {claim.patient.firstName} {claim.patient.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p className="font-medium text-gray-900">
                  {new Date(claim.patient.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Insurance ID</label>
                <p className="font-medium text-gray-900">{claim.patient.insuranceId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <p className="font-medium text-gray-900">{claim.patient.phoneNumber}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium text-gray-900">{claim.patient.address}</p>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Treatment Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="font-medium text-gray-900">{claim.treatment.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Diagnosis Code</label>
                  <p className="font-medium text-gray-900">{claim.treatment.diagnosisCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Procedure Code</label>
                  <p className="font-medium text-gray-900">{claim.treatment.procedureCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Treatment Date</label>
                  <p className="font-medium text-gray-900">
                    {new Date(claim.treatment.treatmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Provider ID</label>
                  <p className="font-medium text-gray-900">{claim.treatment.providerId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Claim Amount</label>
                  <p className="text-2xl font-bold text-green-600">
                    ${claim.claimAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Supporting Documents</h2>
            
            {claim.documents.length > 0 ? (
              <div className="space-y-3">
                {claim.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No documents attached</p>
            )}
          </div>
        </div>

        {/* Fraud Analysis & Actions */}
        <div className="space-y-6 w-full">
          {/* Review Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Actions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add your review notes..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isUpdating}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('denied')}
                  disabled={isUpdating}
                  className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Deny</span>
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('flagged')}
                  disabled={isUpdating}
                  className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Flag className="w-4 h-4" />
                  <span>Escalate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Claim Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Claim Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Claim Submitted</p>
                  <p className="text-sm text-gray-600">
                    {new Date(claim.submissionDate).toLocaleDateString()} at{' '}
                    {new Date(claim.submissionDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {claim.hospitalReviewedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Hospital Review Completed</p>
                    <p className="text-sm text-gray-600">
                      Reviewed by {claim.hospitalReviewedBy} on{' '}
                      {new Date(claim.hospitalReviewedAt).toLocaleDateString()}
                    </p>
                    {claim.hospitalReviewNotes && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        "{claim.hospitalReviewNotes}"
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {claim.sentToInsuranceAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Sent to Insurance</p>
                    <p className="text-sm text-gray-600">
                      {new Date(claim.sentToInsuranceAt).toLocaleDateString()} at{' '}
                      {new Date(claim.sentToInsuranceAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
              
              {claim.fraudScore && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Fraud Analysis Completed</p>
                    <p className="text-sm text-gray-600">
                      AI analysis assigned risk score of {claim.fraudScore}/100
                    </p>
                  </div>
                </div>
              )}
              
              {claim.reviewedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Insurance Review Completed</p>
                    <p className="text-sm text-gray-600">
                      Reviewed by {claim.reviewedBy} on{' '}
                      {new Date(claim.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
