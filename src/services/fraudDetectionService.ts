import { Claim, FraudDetectionResult } from '../types';

class FraudDetectionService {
  async analyzeClaim(claim: Claim): Promise<FraudDetectionResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const flags: string[] = [];
    const explanations: string[] = [];
    let score = 0;
    
    // Mock fraud detection logic
    if (claim.claimAmount > 20000) {
      score += 30;
      flags.push('High claim amount');
      explanations.push('Claim amount exceeds typical range for this procedure type');
    }
    
    if (claim.treatment.diagnosisCode.startsWith('K35')) {
      score += 25;
      flags.push('High-risk procedure category');
      explanations.push('Appendectomy procedures have higher fraud rates in recent data');
    }
    
    if (claim.patient.firstName === 'John' && claim.patient.lastName === 'Smith') {
      score += 40;
      flags.push('Common identity pattern');
      explanations.push('Patient name matches frequently flagged identity patterns');
    }
    
    // Random additional risk factors for demonstration
    const randomFactors = [
      { flag: 'Unusual billing pattern', explanation: 'Billing sequence differs from hospital norm', weight: 15 },
      { flag: 'Recent similar claim', explanation: 'Similar claim submitted within 30 days', weight: 20 },
      { flag: 'Provider risk indicator', explanation: 'Provider has elevated risk score', weight: 10 }
    ];
    
    const selectedFactors = randomFactors.filter(() => Math.random() > 0.7);
    selectedFactors.forEach(factor => {
      score += factor.weight;
      flags.push(factor.flag);
      explanations.push(factor.explanation);
    });
    
    // Ensure score doesn't exceed 100
    score = Math.min(score, 100);
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (score > 70) riskLevel = 'high';
    else if (score > 40) riskLevel = 'medium';
    
    return {
      score,
      flags,
      explanations,
      riskLevel
    };
  }
  
  async batchAnalyzeClaims(claims: Claim[]): Promise<Map<string, FraudDetectionResult>> {
    const results = new Map<string, FraudDetectionResult>();
    
    for (const claim of claims) {
      if (!claim.fraudScore) {
        const result = await this.analyzeClaim(claim);
        results.set(claim.id, result);
      }
    }
    
    return results;
  }
}

export const fraudDetectionService = new FraudDetectionService();