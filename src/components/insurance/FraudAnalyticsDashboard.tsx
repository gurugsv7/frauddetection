import React from 'react';
import { Claim } from '../../types';

// Placeholder components for each dashboard element
function StatusBadge({ status, riskLevel }: { status: string; riskLevel: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
      riskLevel === 'High' ? 'bg-red-100 text-red-800' :
      riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'
    }`}>
      {status} ({riskLevel} Risk)
    </span>
  );
}

function ProgressRing({ probability }: { probability: number }) {
  // Bigger SVG ring with gradient and shadow
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (probability / 100) * circumference;
  const color = probability > 70 ? "#dc2626" : probability > 40 ? "#f59e42" : "#22c55e";
  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="drop-shadow-lg">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#scoreGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="2.5rem"
          fontWeight="bold"
          fill={color}
        >
          {probability}%
        </text>
      </svg>
      <span className="mt-2 text-lg font-semibold text-gray-700">Fraud Risk Score</span>
    </div>
  );
}

function ExplanatoryReasons({ reasons }: { reasons: string[] }) {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 rounded-xl p-5 mb-2 shadow-sm">
      <h4 className="font-bold text-orange-800 text-lg mb-2 flex items-center">
        <span className="mr-2">⚠️</span> Why was this claim flagged?
      </h4>
      <ul className="list-disc pl-6 space-y-2 text-base text-orange-900">
        {reasons.map((reason, i) => (
          <li key={i}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}

function TopFeatureContributions({ features }: { features: { name: string, value: number }[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-2">Top Feature Contributions</h4>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center">
            <span className="w-32 text-xs">{f.name}</span>
            <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
              <div
                className={`h-3 rounded ${f.value > 0 ? 'bg-blue-500' : 'bg-gray-400'}`}
                style={{ width: `${Math.abs(f.value)}%` }}
              ></div>
            </div>
            <span className="text-xs">{f.value > 0 ? '+' : ''}{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProviderPeerComparison({ value, avg }: { value: number, avg: number }) {
  // Calculate bar widths (max 100%)
  const max = Math.max(value, avg, 1);
  const providerWidth = Math.round((value / max) * 100);
  const peerWidth = Math.round((avg / max) * 100);

  return (
    <div className="bg-purple-50 border-l-4 border-purple-400 rounded-xl p-5 shadow-sm mt-4">
      <h4 className="font-bold text-purple-800 text-lg mb-4 flex items-center">
        <span className="mr-2">🏥</span> Provider Peer Comparison
      </h4>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <span className="w-20 text-xs text-purple-900 font-semibold">Provider</span>
          <div className="flex-1 bg-purple-200 rounded h-5 relative">
            <div
              className="bg-purple-600 h-5 rounded"
              style={{ width: `${providerWidth}%`, minWidth: 8 }}
            ></div>
            <span className="absolute right-2 top-0 text-xs font-bold text-purple-900 h-5 flex items-center">{value}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="w-20 text-xs text-gray-700 font-semibold">Peer Avg</span>
          <div className="flex-1 bg-gray-200 rounded h-5 relative">
            <div
              className="bg-gray-500 h-5 rounded"
              style={{ width: `${peerWidth}%`, minWidth: 8 }}
            ></div>
            <span className="absolute right-2 top-0 text-xs font-bold text-gray-700 h-5 flex items-center">{avg}</span>
          </div>
        </div>
      </div>
      <div className="text-xs mt-3 text-purple-900 font-medium">
        Provider: <span className="font-bold">{value}</span> &nbsp;|&nbsp; Peer Avg: <span className="font-bold">{avg}</span>
      </div>
    </div>
  );
}


export function FraudAnalyticsDashboard({ claim }: { claim: Claim }) {
  // Prefer Gemini output if present
  const gemini = (claim as any).geminiAnalysis || {};
  const fraudScore = gemini.fraudScore ?? claim.fraudScore ?? 0;
  type RiskLevel = 'High' | 'Medium' | 'Low';
  const riskLevel: RiskLevel =
    gemini.riskLevel
      ? (gemini.riskLevel.charAt(0).toUpperCase() + gemini.riskLevel.slice(1)) as RiskLevel
      : fraudScore > 70
      ? 'High'
      : fraudScore > 40
      ? 'Medium'
      : 'Low';

  // Color coding for risk levels
  const riskColors: Record<RiskLevel, string> = {
    High: 'from-red-500 to-red-300 text-red-900 border-red-400',
    Medium: 'from-yellow-400 to-yellow-200 text-yellow-900 border-yellow-400',
    Low: 'from-green-400 to-green-200 text-green-900 border-green-400'
  };

  return (
    <div className="w-full min-h-screen px-8 py-8 flex flex-col" style={{ margin: 0, position: 'relative', left: 0 }}>
      {/* Top Two-Column Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8 items-stretch">
        {/* Left: Claim Details + Top Features */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 min-h-[260px]">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span className="inline-block text-blue-600">📝</span> Claim Details
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg">
              <div><span className="font-semibold">Status:</span> <StatusBadge status={claim.status} riskLevel={riskLevel} /></div>
              <div><span className="font-semibold">Amount:</span> ${claim.claimAmount?.toLocaleString()}</div>
              <div><span className="font-semibold">Diagnosis:</span> {claim.treatment?.diagnosisCode}</div>
              <div><span className="font-semibold">Procedure:</span> {claim.treatment?.procedureCode}</div>
              <div><span className="font-semibold">Provider:</span> {claim.hospitalName}</div>
              <div><span className="font-semibold">Patient:</span> {claim.patient?.firstName} {claim.patient?.lastName}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 min-h-[260px]">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span className="inline-block text-blue-600">📊</span> Top Feature Contributions
            </h2>
            <TopFeatureContributions features={gemini.topFeatureContributions || [
              { name: 'Claim Amount', value: 80 },
              { name: 'Diagnosis Code', value: 60 },
              { name: 'Provider History', value: 40 },
              { name: 'Submission Timing', value: 20 }
            ]} />
          </div>
        </div>
        {/* Right: Fraud Score + Reasons */}
        <div className="flex flex-col gap-8">
          <div className={`bg-gradient-to-br ${riskColors[riskLevel]} rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center min-h-[260px]`}>
            <ProgressRing probability={fraudScore} />
            <div className="mt-4 text-3xl font-bold">{riskLevel} Risk</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 min-h-[260px]">
            <ExplanatoryReasons reasons={gemini.explanatoryReasons || claim.fraudFlags || ['No specific reasons provided']} />
          </div>
        </div>
      </div>
      {/* Peer Comparison: Full Width Card */}
      <div className="w-full mb-8">
        <ProviderPeerComparison
          value={gemini.peerComparison?.providerValue ?? 120}
          avg={gemini.peerComparison?.peerAvg ?? 80}
        />
      </div>
      {/* Sectional Divider */}
      <div className="border-t-2 border-gray-200 my-8"></div>
    </div>
  );
}
