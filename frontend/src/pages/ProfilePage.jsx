import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { Camera, Loader2, User } from 'lucide-react'

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!authUser) {
    navigate('/login');
    return null;
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setSelectedImage(reader.result);
      await updateProfile({ profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold mb-4">Profile</h2>

          {/* Avatar */}
          <div className="relative">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-24">
                {selectedImage || authUser.profilePicture ? (
                  <img src={selectedImage || authUser.profilePicture} alt="Profile" className="rounded-full" />
                ) : (
                  <User size={40} />
                )}
              </div>
            </div>
            <label className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0 cursor-pointer">
              {isUpdatingProfile ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Camera size={14} />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <p className="text-sm text-base-content/50 mt-2">
            {isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
          </p>

          {/* User Info */}
          <div className="w-full mt-6 space-y-4">
            <div className="bg-base-300 rounded-lg p-3">
              <p className="text-xs text-base-content/50 uppercase mb-1">Full Name</p>
              <p className="font-medium">{authUser.fullName}</p>
            </div>
            <div className="bg-base-300 rounded-lg p-3">
              <p className="text-xs text-base-content/50 uppercase mb-1">Email</p>
              <p className="font-medium">{authUser.email}</p>
            </div>
            <div className="bg-base-300 rounded-lg p-3">
              <p className="text-xs text-base-content/50 uppercase mb-1">Member Since</p>
              <p className="font-medium">{new Date(authUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
