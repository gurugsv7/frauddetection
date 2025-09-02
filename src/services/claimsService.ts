import { Claim, AuditLog } from '../types';
import { mockClaims, mockAuditLogs } from '../data/mockData';

class ClaimsService {
  private claims: Claim[];
  private auditLogs: AuditLog[] = [...mockAuditLogs];

  constructor() {
    const stored = localStorage.getItem('claims');
    this.claims = stored ? JSON.parse(stored) : [...mockClaims];
  }

  private persistClaims() {
    localStorage.setItem('claims', JSON.stringify(this.claims));
  }

  private reloadClaimsFromStorage() {
    const stored = localStorage.getItem('claims');
    if (stored) this.claims = JSON.parse(stored);
  }

  async getAllClaims(): Promise<Claim[]> {
    this.reloadClaimsFromStorage();
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.claims];
  }

  async getClaimsByHospital(hospitalId: string): Promise<Claim[]> {
    this.reloadClaimsFromStorage();
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.claims.filter(claim => claim.hospitalId === hospitalId);
  }

  async getClaimById(id: string): Promise<Claim | null> {
    this.reloadClaimsFromStorage();
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.claims.find(claim => claim.id === id) || null;
  }

  async submitClaim(claimData: Omit<Claim, 'id' | 'submissionDate' | 'status'>): Promise<Claim> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newClaim: Claim = {
      ...claimData,
      id: `CLM-2024-${String(this.claims.length + 1).padStart(3, '0')}`,
      submissionDate: new Date().toISOString(),
      status: 'sent_to_insurance'
    };
    
    console.log('[submitClaim] New claim created:', newClaim);
    this.claims.unshift(newClaim);
    this.persistClaims();
    console.log('[submitClaim] All claims after insert:', this.claims);
    
    // Add audit log
    this.addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'CLAIM_SUBMITTED',
      details: `Submitted claim ${newClaim.id} for patient ${newClaim.patient.firstName} ${newClaim.patient.lastName}`,
      claimId: newClaim.id
    });
    
    return newClaim;
  }

  async updateClaimStatus(
    claimId: string, 
    status: Claim['status'],
    reviewNotes?: string,
    reviewedBy?: string,
    isHospitalReview?: boolean
  ): Promise<Claim | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const claimIndex = this.claims.findIndex(claim => claim.id === claimId);
    if (claimIndex === -1) return null;
    
    const updates: Partial<Claim> = { status };
    
    if (isHospitalReview) {
      updates.hospitalReviewNotes = reviewNotes;
      updates.hospitalReviewedBy = reviewedBy;
      updates.hospitalReviewedAt = new Date().toISOString();
      if (status === 'sent_to_insurance') {
        updates.sentToInsuranceAt = new Date().toISOString();
      }
    } else {
      updates.reviewNotes = reviewNotes;
      updates.reviewedBy = reviewedBy;
      updates.reviewedAt = new Date().toISOString();
    }
    
    this.claims[claimIndex] = {
      ...this.claims[claimIndex],
      ...updates
    };
    this.persistClaims();
    
    // Add audit log
    this.addAuditLog({
      userId: 'current-user',
      userName: reviewedBy || 'Current User',
      action: 'CLAIM_STATUS_UPDATED',
      details: `Updated claim ${claimId} status to ${status}`,
      claimId
    });
    
    return this.claims[claimIndex];
  }

  async getFlaggedClaims(): Promise<Claim[]> {
    this.reloadClaimsFromStorage();
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.claims.filter(claim => 
      claim.status === 'flagged' || 
      claim.status === 'insurance_review' ||
      (claim.fraudScore && claim.fraudScore > 70)
    );
  }

  async getInsuranceClaims(): Promise<Claim[]> {
    this.reloadClaimsFromStorage();
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.claims.filter(claim => 
      claim.status === 'sent_to_insurance' || 
      claim.status === 'insurance_review' ||
      claim.status === 'approved' ||
      claim.status === 'denied' ||
      claim.status === 'flagged'
    );
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.auditLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private addAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      ...logData,
      id: `AUDIT-${String(this.auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
  }
}

export const claimsService = new ClaimsService();
