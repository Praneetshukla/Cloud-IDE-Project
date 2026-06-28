import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCamera, HiOutlineTrash, HiOutlineMail, HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineFolder, HiOutlineCode, HiOutlineTerminal } from 'react-icons/hi';
import { VscSourceControl } from 'react-icons/vsc';
import toast from 'react-hot-toast';
import {
  fetchProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  fetchStats,
  clearUserError,
  clearUserMessage,
} from '../../redux/slices/userSlice';
import useForm from '../../hooks/useForm';
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validators';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Stat card — displays a single metric with an icon.
 */
const colorMap = {
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cyan:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  green:  'bg-green-500/10 text-green-400 border-green-500/20',
  amber:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const StatCard = ({ icon: Icon, label, value, color = 'indigo' }) => (
  <div className={`rounded-xl border p-4 flex items-center gap-4 ${colorMap[color]}`}>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value ?? 0}</p>
      <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

/**
 * Full profile page — avatar upload, profile edit, and password change.
 */
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, stats, isLoading, error, message } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');

  const currentUser = profile || user;

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchStats());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearUserMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [message, error, dispatch]);

  // Profile form
  const profileForm = useForm(
    { name: currentUser?.name || '', email: currentUser?.email || '' },
    (vals) => {
      const errs = {};
      const nameErr = validateName(vals.name);
      if (nameErr) errs.name = nameErr;
      const emailErr = validateEmail(vals.email);
      if (emailErr) errs.email = emailErr;
      return errs;
    }
  );

  // Password form
  const passwordForm = useForm(
    { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    (vals) => {
      const errs = {};
      if (!vals.currentPassword) errs.currentPassword = 'Current password is required';
      const pwErr = validatePassword(vals.newPassword);
      if (pwErr) errs.newPassword = pwErr;
      const confirmErr = validateConfirmPassword(vals.newPassword, vals.confirmNewPassword);
      if (confirmErr) errs.confirmNewPassword = confirmErr;
      return errs;
    }
  );

  // Sync profile form when data loads
  useEffect(() => {
    if (currentUser) {
      profileForm.setValues({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.name, currentUser?.email]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.validate()) return;
    dispatch(updateProfile(profileForm.values));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.validate()) return;
    dispatch(changePassword(passwordForm.values)).then((result) => {
      if (!result.error) {
        passwordForm.reset();
      }
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Invalid file type. Use JPEG, PNG, WebP, or GIF.');
      return;
    }

    dispatch(uploadAvatar(file));
    e.target.value = '';
  };

  const handleDeleteAvatar = () => {
    dispatch(deleteAvatar());
  };

  if (!currentUser && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiOutlineUser },
    { id: 'security', label: 'Security', icon: HiOutlineShieldCheck },
    { id: 'activity', label: 'Activity', icon: HiOutlineChartBar },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Account Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Manage your profile, avatar, and security settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-bg-tertiary)] rounded-xl mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Profile Tab ──────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar
                  src={currentUser?.avatar}
                  name={currentUser?.name}
                  size="2xl"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                    flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                >
                  <HiOutlineCamera className="h-7 w-7 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={HiOutlineCamera}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isLoading}
                  >
                    Upload
                  </Button>
                  {currentUser?.avatar && (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={HiOutlineTrash}
                      onClick={handleDeleteAvatar}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  JPG, PNG, WebP or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Personal Information
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg" noValidate>
              <Input
                label="Full Name"
                name="name"
                value={profileForm.values.name}
                onChange={profileForm.handleChange}
                onBlur={profileForm.handleBlur}
                error={profileForm.errors.name}
                touched={profileForm.touched.name}
                icon={HiOutlineUser}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={profileForm.values.email}
                onChange={profileForm.handleChange}
                onBlur={profileForm.handleBlur}
                error={profileForm.errors.email}
                touched={profileForm.touched.email}
                icon={HiOutlineMail}
                required
              />

              {currentUser?.authProvider && currentUser.authProvider !== 'local' && (
                <Alert
                  type="info"
                  message={`Connected via ${currentUser.authProvider.charAt(0).toUpperCase() + currentUser.authProvider.slice(1)}`}
                />
              )}

              <div className="pt-2">
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Security Tab ─────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
            Change Password
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Update your password to keep your account secure.
          </p>

          {currentUser?.authProvider && currentUser.authProvider !== 'local' && !currentUser.password ? (
            <Alert
              type="info"
              message="Your account uses social login. Password change is not available."
            />
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg" noValidate>
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.values.currentPassword}
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
                error={passwordForm.errors.currentPassword}
                touched={passwordForm.touched.currentPassword}
                icon={HiOutlineLockClosed}
                autoComplete="current-password"
                required
              />

              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.values.newPassword}
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
                error={passwordForm.errors.newPassword}
                touched={passwordForm.touched.newPassword}
                icon={HiOutlineLockClosed}
                autoComplete="new-password"
                required
              />

              <Input
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={passwordForm.values.confirmNewPassword}
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
                error={passwordForm.errors.confirmNewPassword}
                touched={passwordForm.touched.confirmNewPassword}
                icon={HiOutlineLockClosed}
                autoComplete="new-password"
                required
              />

              <div className="pt-2">
                <Button type="submit" isLoading={isLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ─── Activity Tab ──────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              Activity Overview
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Your usage statistics across all workspaces and projects.
            </p>

            {stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={HiOutlineFolder} label="Workspaces" value={stats.workspaces} color="indigo" />
                <StatCard icon={HiOutlineCode} label="Projects" value={stats.projects} color="purple" />
                <StatCard icon={HiOutlineUser} label="Files Created" value={stats.files} color="cyan" />
                <StatCard icon={VscSourceControl} label="Commits" value={stats.commits} color="green" />
                <StatCard icon={HiOutlineTerminal} label="Executions" value={stats.terminalSessions} color="amber" />
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-tertiary)]">Loading stats...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
