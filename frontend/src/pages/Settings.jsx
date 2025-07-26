import React from "react";


const Settings = () => {
  // Theme context available if needed: const { theme } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-lg text-gray-600">User settings and preferences will appear here.</p>
      </div>
    </div>
  );
};

export default Settings;
