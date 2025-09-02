import React, { useState, useEffect } from 'react';
import { Claim } from '../../types';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface ClaimFiltersProps {
  claims: Claim[];
  onFilter: (filteredClaims: Claim[]) => void;
}

export function ClaimFilters({ claims, onFilter }: ClaimFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    riskLevel: 'all',
    hospital: 'all',
    dateRange: '30',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, claims]);

  const applyFilters = () => {
    let filtered = [...claims];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(claim => claim.status === filters.status);
    }

    // Risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(claim => {
        if (!claim.fraudScore) return filters.riskLevel === 'low';
        
        switch (filters.riskLevel) {
          case 'high': return claim.fraudScore > 70;
          case 'medium': return claim.fraudScore > 40 && claim.fraudScore <= 70;
          case 'low': return claim.fraudScore <= 40;
          default: return true;
        }
      });
    }

    // Hospital filter
    if (filters.hospital !== 'all') {
      filtered = filtered.filter(claim => claim.hospitalId === filters.hospital);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      filtered = filtered.filter(claim => 
        new Date(claim.submissionDate) >= cutoffDate
      );
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(claim => claim.claimAmount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(claim => claim.claimAmount <= parseFloat(filters.maxAmount));
    }

    onFilter(filtered);
  };

  const uniqueHospitals = Array.from(
    new Set(claims.map(claim => claim.hospitalName))
  ).map(name => {
    const claim = claims.find(c => c.hospitalName === name);
    return { id: claim!.hospitalId, name };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          <span className="text-sm text-gray-500">
            ({Object.values(filters).filter(v => v !== 'all' && v !== '').length} active)
          </span>
        </button>
      </div>

      {showFilters && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="sent_to_insurance">New Claims</option>
                <option value="insurance_review">Under Review</option>
                <option value="flagged">Flagged</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk (70+)</option>
                <option value="medium">Medium Risk (40-70)</option>
                <option value="low">Low Risk (0-40)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
              <select
                value={filters.hospital}
                onChange={(e) => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Hospitals</option>
                {uniqueHospitals.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100000"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setFilters({
                status: 'all',
                riskLevel: 'all',
                hospital: 'all',
                dateRange: '30',
                minAmount: '',
                maxAmount: ''
              })}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}