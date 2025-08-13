'use client';

import React, { useState } from 'react';
import { Shield, User, ArrowLeft } from 'lucide-react';

// Assuming these components are correctly imported from your project structure
import UserPanel from '@/components/account/userPanel';
import AdminPanel from '@/components/account/adminPanel';

// Define a type for the role for better code safety
type Role = 'admin' | 'user';

// --- Sub-component for the Admin Panel Wrapper ---
const AdminPanelWrapper = ({ onBack }: { onBack: () => void }) => (
  <div className="w-full animate-fade-in">
    <button
      onClick={onBack}
      className="flex items-center space-x-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to selection</span>
    </button>
    <AdminPanel />
  </div>
);

// --- Sub-component for the User Panel Wrapper ---
const UserPanelWrapper = ({ onBack }: { onBack: () => void }) => (
  <div className="w-full animate-fade-in">
    <button
      onClick={onBack}
      className="flex items-center space-x-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back to selection</span>
    </button>
    <UserPanel />
  </div>
);

// --- Sub-component for the initial Role Selection ---
const RoleSelection = ({ onSelect }: { onSelect: (role: Role) => void }) => (
  <div className="text-center animate-fade-in">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
      Choose Your View
    </h1>
    <p className="text-gray-400 mb-8">Select how you would like to enter the dashboard.</p>
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      {/* Admin Button */}
      <button
        onClick={() => onSelect('admin')}
        className="group flex flex-col items-center justify-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-700/50 hover:border-purple-500 hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1"
      >
        <Shield className="w-16 h-16 mb-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
        <span className="text-2xl font-semibold text-gray-200">Enter as Admin</span>
        <p className="text-sm text-gray-500 mt-1">Access protocol settings</p>
      </button>

      {/* User Button */}
      <button
        onClick={() => onSelect('user')}
        className="group flex flex-col items-center justify-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-700/50 hover:border-yellow-500 hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1"
      >
        <User className="w-16 h-16 mb-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
        <span className="text-2xl font-semibold text-gray-200">Enter as User</span>
        <p className="text-sm text-gray-500 mt-1">View your balances</p>
      </button>
    </div>
  </div>
);

// --- Main Page Component ---
const BasicsPage = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const renderContent = () => {
    switch (selectedRole) {
      case 'admin':
        return <AdminPanelWrapper onBack={() => setSelectedRole(null)} />;
      case 'user':
        return <UserPanelWrapper onBack={() => setSelectedRole(null)} />;
      default:
        return <RoleSelection onSelect={setSelectedRole} />;
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
    </main>
  );
};

export default BasicsPage;