import { Claim, AuditLog } from '../types';

export const mockClaims: Claim[] = [
  {
    id: 'CLM-2024-001',
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    patient: {
      id: 'PAT-001',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-05-15',
      insuranceId: 'INS-123456789',
      phoneNumber: '(555) 123-4567',
      address: '123 Main St, Springfield, IL 62701'
    },
    treatment: {
      description: 'Emergency appendectomy with complications',
      diagnosisCode: 'K35.9',
      procedureCode: '44970',
      treatmentDate: '2024-01-15',
      providerId: 'DR-001'
    },
    claimAmount: 25000,
    submissionDate: '2024-01-16T10:30:00Z',
    status: 'sent_to_insurance',
    documents: [
      {
        id: 'DOC-001',
        name: 'surgical_report.pdf',
        type: 'bill',
        url: '/documents/surgical_report.pdf',
        uploadedAt: '2024-01-16T10:30:00Z'
      }
    ],
    fraudScore: 85,
    fraudFlags: [
      'Claim amount significantly higher than average for procedure',
      'Recent similar claim from same patient',
      'Unusual billing pattern detected'
    ]
  },
  {
    id: 'CLM-2024-002',
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    patient: {
      id: 'PAT-002',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: '1975-08-22',
      insuranceId: 'INS-987654321',
      phoneNumber: '(555) 987-6543',
      address: '456 Oak Ave, Springfield, IL 62702'
    },
    treatment: {
      description: 'Routine checkup and blood work',
      diagnosisCode: 'Z00.00',
      procedureCode: '99213',
      treatmentDate: '2024-01-18',
      providerId: 'DR-002'
    },
    claimAmount: 450,
    submissionDate: '2024-01-18T14:15:00Z',
    status: 'approved',
    documents: [
      {
        id: 'DOC-002',
        name: 'lab_results.pdf',
        type: 'bill',
        url: '/documents/lab_results.pdf',
        uploadedAt: '2024-01-18T14:15:00Z'
      }
    ],
    fraudScore: 15,
    fraudFlags: []
  },
  {
    id: 'CLM-2024-003',
    hospitalId: '3',
    hospitalName: 'St. Mary Medical Center',
    patient: {
      id: 'PAT-003',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1962-12-03',
      insuranceId: 'INS-456789123',
      phoneNumber: '(555) 456-7890',
      address: '789 Pine St, Springfield, IL 62703'
    },
    treatment: {
      description: 'Cardiac catheterization procedure',
      diagnosisCode: 'I25.10',
      procedureCode: '93458',
      treatmentDate: '2024-01-20',
      providerId: 'DR-003'
    },
    claimAmount: 18500,
    submissionDate: '2024-01-20T09:45:00Z',
    status: 'hospital_review',
    documents: [
      {
        id: 'DOC-003',
        name: 'cardiac_report.pdf',
        type: 'bill',
        url: '/documents/cardiac_report.pdf',
        uploadedAt: '2024-01-20T09:45:00Z'
      }
    ],
    fraudScore: 35,
    fraudFlags: [
      'Procedure timing close to insurance enrollment'
    ]
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUDIT-001',
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    action: 'CLAIM_SUBMITTED',
    details: 'Submitted claim CLM-2024-001 for patient John Smith',
    timestamp: '2024-01-16T10:30:00Z',
    claimId: 'CLM-2024-001'
  },
  {
    id: 'AUDIT-002',
    userId: '2',
    userName: 'Michael Chen',
    action: 'CLAIM_REVIEWED',
    details: 'Reviewed claim CLM-2024-002 and marked as approved',
    timestamp: '2024-01-18T16:20:00Z',
    claimId: 'CLM-2024-002'
  }
];
