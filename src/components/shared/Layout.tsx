import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  portalType: 'hospital' | 'insurance';
}

export function Layout({ children, portalType }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation portalType={portalType} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}