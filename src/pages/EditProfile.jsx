import React, { useState } from 'react';

export default function EditProfile() {
  // Mock initial state using data from your dashboard
  const [profile, setProfile] = useState({
    username: 'gkbaruig',
    email: 'swayumphou@gmail.com',
    libraryId: 'LIB-1781628989347',
    avatar: 'g', // Initial letter avatar
    bio: 'Data Science Library Member',
    emailNotifications: true,
    autoRenewal: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your save logic here (e.g., API patch request)
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 text-slate-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your public library identity and account settings.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Avatar Section */}
          <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 bg-black text-white text-3xl font-bold rounded-2xl flex items-center justify-center shadow-md">
              {profile.avatar.charAt(0).toUpperCase()}
            </div>
            <div>
              <button 
                type="button" 
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
              >
                Change Avatar
              </button>
              <p className="text-xs text-slate-400 mt-2">JPG, PNG or GIF. Max size of 800K</p>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Library ID</label>
              <input
                type="text"
                value={profile.libraryId}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed font-mono"
                title="Library ID cannot be changed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / Description</label>
              <textarea
                name="bio"
                rows="3"
                value={profile.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Account Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                  <p className="text-xs text-slate-500">Due date alerts and library announcements</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={profile.emailNotifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Auto-Renewal</p>
                  <p className="text-xs text-slate-500">Automatically renew eligible library books</p>
                </div>
                <input
                  type="checkbox"
                  name="autoRenewal"
                  checked={profile.autoRenewal}
                  onChange={handleChange}
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 shadow-sm transition"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}