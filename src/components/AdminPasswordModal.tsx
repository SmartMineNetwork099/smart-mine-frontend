'use client';
import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '@/config/constants';
import { ImCross } from 'react-icons/im';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onVerify: (isCorrect: boolean) => void;
}


const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ isOpen, onVerify }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const ADMIN__PASSWORD = ADMIN_PASSWORD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === ADMIN__PASSWORD) {
        onVerify(true);
        setPassword('');
      } else {
        setError('Invalid password. Access denied.');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay - not closable */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Modal */}
      <div className="relative rounded-lg shadow-lg w-full max-w-md p-6 z-50 bg-neutral-800">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Admin Access</h2>
          <p className="text-gray-300 text-sm mt-2">Enter the password to access admin panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
