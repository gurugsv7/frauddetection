export interface User {
  id: string;
  email: string;
  name: string;
  role: 'hospital' | 'insurance';
  organizationName: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  insuranceId: string;
  phoneNumber: string;
  address: string;
}

export interface Treatment {
  description: string;
  diagnosisCode: string;
  procedureCode: string;
  treatmentDate: string;
  providerId: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'bill' | 'prescription' | 'discharge' | 'other';
  url: string;
  uploadedAt: string;
}

export interface Claim {
  id: string;
  hospitalId: string;
  hospitalName: string;
  patient: Patient;
  treatment: Treatment;
  claimAmount: number;
  submissionDate: string;
  status: 'draft' | 'submitted' | 'hospital_review' | 'sent_to_insurance' | 'insurance_review' | 'approved' | 'denied' | 'flagged';
  documents: Document[];
  fraudScore?: number;
  fraudFlags?: string[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  hospitalReviewNotes?: string;
  hospitalReviewedBy?: string;
  hospitalReviewedAt?: string;
  sentToInsuranceAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  claimId?: string;
}

export interface FraudDetectionResult {
  score: number;
  flags: string[];
  explanations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}