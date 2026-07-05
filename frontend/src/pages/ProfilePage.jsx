import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlineLockClosed, HiOutlineTrash, HiOutlineLogout } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name || '', email: user?.email || '' } });
  const passwordForm = useForm();

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      const res = await userService.updateProfile(data);
      updateUser(res.data.data);
      setEditMode(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setIsLoading(true);
    try {
      await userService.changePassword(data);
      setChangingPassword(false);
      passwordForm.reset();
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Change failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      toast.success('Account deleted');
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      {/* Avatar + Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
            <p className="text-sm text-dark-400">{user?.email}</p>
            <p className="text-xs text-dark-500 flex items-center gap-1 mt-1">
              <HiOutlineCalendar className="w-3 h-3" />
              Joined {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        {editMode ? (
          <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1">Name</label>
              <input className="input-field" {...profileForm.register('name', { required: true, minLength: 2 })} />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1">Email</label>
              <input type="email" className="input-field" {...profileForm.register('email', { required: true })} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isLoading} className="btn-primary text-sm py-2 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="btn-secondary text-sm py-2">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/30">
              <HiOutlineUser className="w-5 h-5 text-dark-400" />
              <div><p className="text-xs text-dark-500">Name</p><p className="text-sm text-white">{user?.name}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/30">
              <HiOutlineMail className="w-5 h-5 text-dark-400" />
              <div><p className="text-xs text-dark-500">Email</p><p className="text-sm text-white">{user?.email}</p></div>
            </div>
            <button onClick={() => setEditMode(true)} className="btn-secondary text-sm py-2">Edit Profile</button>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <HiOutlineLockClosed className="w-5 h-5" /> Security
        </h3>
        {changingPassword ? (
          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1">Current Password</label>
              <input type="password" className="input-field" {...passwordForm.register('currentPassword', { required: true })} />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1">New Password</label>
              <input type="password" className="input-field" {...passwordForm.register('newPassword', { required: true, minLength: 6 })} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isLoading} className="btn-primary text-sm py-2 disabled:opacity-50">
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button type="button" onClick={() => setChangingPassword(false)} className="btn-secondary text-sm py-2">Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setChangingPassword(true)} className="btn-secondary text-sm py-2">Change Password</button>
        )}
      </div>

      {/* Danger zone */}
      <div className="glass-card p-6 border-danger-500/20">
        <h3 className="text-lg font-semibold text-danger-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-dark-400 mb-4">Once you delete your account, there is no going back.</p>
        {showDeleteConfirm ? (
          <div className="flex items-center gap-3">
            <button onClick={handleDeleteAccount} className="btn-danger text-sm py-2 flex items-center gap-2">
              <HiOutlineTrash className="w-4 h-4" /> Yes, Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-sm py-2">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger text-sm py-2 flex items-center gap-2">
            <HiOutlineTrash className="w-4 h-4" /> Delete Account
          </button>
        )}
      </div>

      {/* Logout */}
      <button onClick={logout} className="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-danger-400 border-danger-500/20 hover:bg-danger-500/10">
        <HiOutlineLogout className="w-5 h-5" /> Logout
      </button>
    </motion.div>
  );
}
