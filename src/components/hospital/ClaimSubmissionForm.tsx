import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { claimsService } from '../../services/claimsService';
import { fraudDetectionService } from '../../services/fraudDetectionService';
import { analyzeClaimWithGemini } from '../../services/geminiService';
import { Claim } from '../../types';
import { Upload, CheckCircle, User, Calendar, DollarSign, FileText } from 'lucide-react';

export function ClaimSubmissionForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);
  
  const [formData, setFormData] = useState({
    // Patient Information
    patientFirstName: '',
    patientLastName: '',
    patientDOB: '',
    patientGender: '',
    insuranceId: '',
    isSelfClaim: true,
    relationshipToInsured: '',
    // Provider Information
    providerId: '',
    providerName: '',
    providerLocation: '',
    // Claim/Treatment Information
    admissionDate: '',
    dischargeDate: '',
    diagnosisCode: '',
    procedureCode: '',
    claimAmount: '',
    preAuthNumber: '',
    claimType: 'initial',
    // Supporting Evidence
    documents: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientFirstName.trim()) newErrors.patientFirstName = 'Patient first name is required';
    if (!formData.patientLastName.trim()) newErrors.patientLastName = 'Patient last name is required';
    if (!formData.patientDOB) newErrors.patientDOB = 'Date of birth is required';
    if (!formData.patientGender) newErrors.patientGender = 'Gender is required';
    if (!formData.insuranceId.trim()) newErrors.insuranceId = 'Insurance ID is required';
    if (!formData.isSelfClaim && !formData.relationshipToInsured.trim()) newErrors.relationshipToInsured = 'Relationship to insured is required';
    if (!formData.providerId.trim()) newErrors.providerId = 'Provider ID is required';
    if (!formData.providerName.trim()) newErrors.providerName = 'Hospital/Clinic Name is required';
    if (!formData.providerLocation.trim()) newErrors.providerLocation = 'Provider location is required';
    if (!formData.admissionDate) newErrors.admissionDate = 'Admission date is required';
    if (!formData.diagnosisCode.trim()) newErrors.diagnosisCode = 'Diagnosis code is required';
    if (!formData.procedureCode.trim()) newErrors.procedureCode = 'Procedure code is required';
    if (!formData.claimAmount || parseFloat(formData.claimAmount) <= 0) {
      newErrors.claimAmount = 'Valid claim amount is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Analyze all inputs and first document (if any) with Gemini
      let geminiOutput: any = {};
      const firstDoc = formData.documents.length > 0 ? formData.documents[0] : null;
      try {
        geminiOutput = await analyzeClaimWithGemini(firstDoc, formData);
        // Log Gemini response for debugging
        // eslint-disable-next-line no-console
        console.log('Gemini API response:', geminiOutput);
        // If Gemini returns a summary string with JSON, parse it
        if (typeof geminiOutput.summary === 'string' && geminiOutput.summary.trim().startsWith('```json')) {
          try {
            const jsonStr = geminiOutput.summary.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            geminiOutput = { ...geminiOutput, ...parsed };
          } catch (e) {
            // ignore parse error, fallback to summary
          }
        }
      } catch (err) {
        geminiOutput = { summary: 'Gemini analysis failed.' };
      }

      const claimData = {
        hospitalId: user!.id,
        hospitalName: user!.organizationName,
        patient: {
          id: `PAT-${Date.now()}`,
          firstName: formData.patientFirstName,
          lastName: formData.patientLastName,
          dateOfBirth: formData.patientDOB,
          gender: formData.patientGender,
          insuranceId: formData.insuranceId,
          isSelfClaim: formData.isSelfClaim,
          relationshipToInsured: formData.isSelfClaim ? '' : formData.relationshipToInsured
        },
        provider: {
          providerId: formData.providerId,
          providerName: formData.providerName,
          providerLocation: formData.providerLocation
        },
        treatment: {
          admissionDate: formData.admissionDate,
          dischargeDate: formData.dischargeDate,
          diagnosisCode: formData.diagnosisCode,
          procedureCode: formData.procedureCode,
          preAuthNumber: formData.preAuthNumber,
          claimType: formData.claimType
        },
        claimAmount: parseFloat(formData.claimAmount),
        documents: formData.documents.map((file, index) => ({
          id: `DOC-${Date.now()}-${index}`,
          name: file.name,
          type: 'bill' as const,
          url: `/documents/${file.name}`,
          uploadedAt: new Date().toISOString()
        })),
        ...geminiOutput,
        geminiAnalysis: geminiOutput
      };
      
      const newClaim = await claimsService.submitClaim(claimData);

      // Immediately update status to sent_to_insurance so it appears in insurance dashboard
      await claimsService.updateClaimStatus(newClaim.id, 'sent_to_insurance');

      // Trigger fraud analysis in background
      fraudDetectionService.analyzeClaim({ ...newClaim, status: 'sent_to_insurance' }).then((result) => {
        claimsService.updateClaimStatus(
          newClaim.id,
          result.riskLevel === 'high' ? 'flagged' : 'insurance_review'
        );
      });

      setSubmittedClaim({ ...newClaim, status: 'sent_to_insurance' });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files!)]
      }));
    }
  };

  if (submitted && submittedClaim) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully</h2>
        <p className="text-gray-600 mb-6">Your claim has been received and is being processed</p>
        
        <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Claim Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Claim ID:</span>
              <span className="font-medium">{submittedClaim.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">
                {submittedClaim.patient.firstName} {submittedClaim.patient.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${submittedClaim.claimAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Pending Review
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            setSubmitted(false);
            setSubmittedClaim(null);
            setFormData({
            patientFirstName: '',
            patientLastName: '',
            patientDOB: '',
            patientGender: '',
            insuranceId: '',
            isSelfClaim: true,
            relationshipToInsured: '',
            providerId: '',
            providerName: '',
            providerLocation: '',
            admissionDate: '',
            dischargeDate: '',
            diagnosisCode: '',
            procedureCode: '',
            claimAmount: '',
            preAuthNumber: '',
            claimType: 'initial',
            documents: []
          });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Claim
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.patientFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientFirstName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.patientFirstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {errors.patientFirstName && (
                <p className="text-red-600 text-xs mt-1">{errors.patientFirstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.patientLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientLastName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.patientLastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Smith"
              />
              {errors.patientLastName && (
                <p className="text-red-600 text-xs mt-1">{errors.patientLastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.patientDOB}
                onChange={(e) => setFormData(prev => ({ ...prev, patientDOB: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.patientDOB ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.patientDOB && (
                <p className="text-red-600 text-xs mt-1">{errors.patientDOB}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.patientGender}
                onChange={(e) => setFormData(prev => ({ ...prev, patientGender: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.patientGender ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.patientGender && (
                <p className="text-red-600 text-xs mt-1">{errors.patientGender}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ID / Policy Number</label>
            <input
              type="text"
              value={formData.insuranceId}
              onChange={(e) => setFormData(prev => ({ ...prev, insuranceId: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.insuranceId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="INS-123456789"
            />
            {errors.insuranceId && (
              <p className="text-red-600 text-xs mt-1">{errors.insuranceId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Self-Claim?</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.isSelfClaim}
                  onChange={() => setFormData(prev => ({ ...prev, isSelfClaim: true }))}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.isSelfClaim}
                  onChange={() => setFormData(prev => ({ ...prev, isSelfClaim: false }))}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {!formData.isSelfClaim && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Insured</label>
              <select
                value={formData.relationshipToInsured}
                onChange={(e) => setFormData(prev => ({ ...prev, relationshipToInsured: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.relationshipToInsured ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="other">Other</option>
              </select>
              {errors.relationshipToInsured && (
                <p className="text-red-600 text-xs mt-1">{errors.relationshipToInsured}</p>
              )}
            </div>
          )}
        </div>

        {/* Provider Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Provider Information</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider ID (e.g., NPI / hospital code)</label>
            <input
              type="text"
              value={formData.providerId}
              onChange={(e) => setFormData(prev => ({ ...prev, providerId: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.providerId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="PROV-001"
            />
            {errors.providerId && (
              <p className="text-red-600 text-xs mt-1">{errors.providerId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital / Clinic Name</label>
            <input
              type="text"
              value={formData.providerName}
              onChange={(e) => setFormData(prev => ({ ...prev, providerName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.providerName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="City Hospital"
            />
            {errors.providerName && (
              <p className="text-red-600 text-xs mt-1">{errors.providerName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider Location (City, State, ZIP)</label>
            <input
              type="text"
              value={formData.providerLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, providerLocation: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.providerLocation ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Miami, FL, 33101"
            />
            {errors.providerLocation && (
              <p className="text-red-600 text-xs mt-1">{errors.providerLocation}</p>
            )}
          </div>
        </div>

        {/* Claim / Treatment Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Claim / Treatment Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date</label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.admissionDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.admissionDate && (
                <p className="text-red-600 text-xs mt-1">{errors.admissionDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discharge Date (if applicable)</label>
              <input
                type="date"
                value={formData.dischargeDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dischargeDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis Code (ICD-10)</label>
              <input
                type="text"
                value={formData.diagnosisCode}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosisCode: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.diagnosisCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="K35.9"
              />
              {errors.diagnosisCode && (
                <p className="text-red-600 text-xs mt-1">{errors.diagnosisCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Code (CPT/HCPCS)</label>
              <input
                type="text"
                value={formData.procedureCode}
                onChange={(e) => setFormData(prev => ({ ...prev, procedureCode: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.procedureCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="44970"
              />
              {errors.procedureCode && (
                <p className="text-red-600 text-xs mt-1">{errors.procedureCode}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Amount</label>
            <div className="relative">
              <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="number"
                step="0.01"
                value={formData.claimAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, claimAmount: e.target.value }))}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.claimAmount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.claimAmount && (
              <p className="text-red-600 text-xs mt-1">{errors.claimAmount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Authorization Number (if required)</label>
            <input
              type="text"
              value={formData.preAuthNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, preAuthNumber: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="PREAUTH-12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
            <select
              value={formData.claimType}
              onChange={(e) => setFormData(prev => ({ ...prev, claimType: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="initial">Initial</option>
              <option value="resubmission">Resubmission</option>
              <option value="corrected">Corrected</option>
            </select>
          </div>
        </div>

        {/* Supporting Evidence */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Supporting Evidence</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Medical Documents (bills, prescriptions, discharge summary, lab reports, etc.)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </label>
            </div>
            {formData.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        documents: prev.documents.filter((_, i) => i !== index)
                      }))}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
        </button>
      </div>
    </form>
  );
}
