'use client';
import React, { useState } from 'react';
import Tab from '@/components/Tab';
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="p-4 bg-gray-200">
          <Tab activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
