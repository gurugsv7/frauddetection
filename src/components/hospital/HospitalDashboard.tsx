import React, { useState } from 'react';
import { ClaimSubmissionForm } from './ClaimSubmissionForm';
import { ClaimHistory } from './ClaimHistory';
import { FileText, History, Plus, CheckSquare } from 'lucide-react';

type ActiveTab = 'submit' | 'review' | 'history';

export function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('submit');

  const tabs = [
    { id: 'submit', label: 'Submit Claim', icon: Plus },
    { id: 'history', label: 'Claim History', icon: History }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Claims Portal</h1>
        <p className="text-gray-600">Submit and track insurance claims efficiently</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'submit' && <ClaimSubmissionForm />}
          {activeTab === 'history' && <ClaimHistory />}
        </div>
      </div>
    </div>
  );
}
