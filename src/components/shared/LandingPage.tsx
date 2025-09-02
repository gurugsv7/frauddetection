import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Guitar as Hospital, Building2, ArrowRight, CheckCircle, Users, FileText, TrendingUp } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: 'Digital Claim Submission',
      description: 'Streamlined claim submission process with automated validation and document management'
    },
    {
      icon: Shield,
      title: 'AI Fraud Detection',
      description: 'Advanced machine learning algorithms detect suspicious patterns and flag potential fraud'
    },
    {
      icon: Users,
      title: 'Multi-Stage Review',
      description: 'Hospital pre-review followed by insurance company final review for accuracy'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with fraud scores, trends, and actionable insights'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ClaimsGuard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/hospital/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Hospital Portal
              </Link>
              <Link
                to="/insurance/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Insurance Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare Claims
            <span className="text-blue-600 block">Fraud Detection</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Secure, AI-powered platform connecting hospitals and insurance companies 
            for streamlined claim processing with advanced fraud detection capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hospital/login"
              className="group flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-xl"
            >
              <Hospital className="w-5 h-5" />
              <span className="font-semibold">Hospital Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/insurance/login"
              className="group flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Insurance Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Fraud Detection Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets healthcare expertise to protect against fraudulent claims
              while ensuring legitimate claims are processed efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Streamlined Review Process
            </h2>
            <p className="text-lg text-gray-600">
              Multi-stage review ensures accuracy and prevents fraud
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hospital Submission</h3>
              <p className="text-gray-600 text-sm">
                Hospitals submit claims with patient details, treatment information, and supporting documents
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Advanced algorithms analyze claims for fraud indicators and assign risk scores
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance Review</h3>
              <p className="text-gray-600 text-sm">
                Insurance reviewers make final decisions based on AI insights and manual review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ClaimsGuard</span>
          </div>
          <p className="text-gray-400">
            Protecting healthcare systems through intelligent fraud detection
          </p>
        </div>
      </footer>
    </div>
  );
}