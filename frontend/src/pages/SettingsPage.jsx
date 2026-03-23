import React from 'react'
import { Settings } from 'lucide-react'

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <Settings size={48} className="text-primary mb-4" />
          <h2 className="card-title text-2xl font-bold mb-2">Settings</h2>
          <p className="text-base-content/60">Settings features coming soon.</p>
          <p className="text-sm text-base-content/40 mt-2">Theme customization, notifications, and more.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
