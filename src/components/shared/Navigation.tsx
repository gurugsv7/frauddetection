import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Shield, Guitar as Hospital, User, Building2 } from 'lucide-react';

interface NavigationProps {
  portalType: 'hospital' | 'insurance';
}

export function Navigation({ portalType }: NavigationProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleIcon = portalType === 'hospital' ? Hospital : Building2;
  const RoleIcon = roleIcon;
  const portalColor = portalType === 'hospital' ? 'green' : 'indigo';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-${portalColor}-600 rounded-lg flex items-center justify-center`}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ClaimsGuard</span>
            </div>
            <span className="text-sm text-gray-500">|</span>
            <div className="flex items-center space-x-2">
              <RoleIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {portalType === 'hospital' ? 'Hospital Portal' : 'Insurance Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.organizationName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}