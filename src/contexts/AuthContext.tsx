import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'hospital@cityhospital.com',
    name: 'Dr. Sarah Johnson',
    role: 'hospital',
    organizationName: 'City General Hospital'
  },
  {
    id: '3',
    email: 'admin@stmary.com',
    name: 'Dr. Emily Rodriguez',
    role: 'hospital',
    organizationName: 'St. Mary Medical Center'
  },
  {
    id: '2',
    email: 'reviewer@healthinsure.com',
    name: 'Michael Chen',
    role: 'insurance',
    organizationName: 'HealthInsure Corp'
  },
  {
    id: '4',
    email: 'analyst@premiumcare.com',
    name: 'Sarah Williams',
    role: 'insurance',
    organizationName: 'Premium Care Insurance'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('healthcare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('healthcare_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthcare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}