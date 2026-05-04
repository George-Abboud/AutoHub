import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Lock, Mail, Camera, ChevronDown, Loader } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { useAppViewModel } from './viewmodels/useAppViewModel';
import { useAuthViewModel } from './viewmodels/useAuthViewModel';
import { useProfileViewModel } from './viewmodels/useProfileViewModel';
import { Button } from './components/ui/Button';
import { supabase } from './lib/supabaseClient';

export const ProfilePage = () => {
  const { accentColor } = useAppViewModel();
  const { user, signOut, updatePassword, error: authErr, successMsg: authSuccess } = useAuthViewModel();
  const { profile, updateProfile, isLoading, error: profileErr } = useProfileViewModel();

  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  // Profile Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [dob, setDob] = useState(profile?.date_of_birth || '');
  const [gender, setGender] = useState(profile?.gender || '');
  
  // Password Form State
  const [newPassword, setNewPassword] = useState('');

  // Avatar Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    await updateProfile({
      full_name: fullName.trim(),
      date_of_birth: dob || undefined,
      gender: gender.trim() || undefined,
    });
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    await updatePassword(newPassword);
    setNewPassword('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = fileName;

    try {
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await updateProfile({ avatar_url: data.publicUrl });
    } catch (err: any) {
      console.error('Error uploading avatar:', err.message);
      alert('Error uploading avatar. Make sure you created the "avatars" bucket.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.avatar_url) return;
    setUploadingAvatar(true);
    try {
      await updateProfile({ avatar_url: null as any });
    } catch (err: any) {
      console.error('Error removing avatar:', err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div style={{ height: '100vh', background: '#171717', color: '#EBEBEB', fontFamily: '"Inter", sans-serif', overflowY: 'auto' }}>
      <AnimatedBackground />
      <Sidebar />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '80px 40px 40px 120px' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 8px 0' }}>Profile & Account</h1>
          <p style={{ color: '#737373', fontSize: '16px', margin: 0 }}>Manage your personal information and security.</p>
        </motion.div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          {/* Left Column: Avatar & Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ width: '300px', background: 'rgba(23, 23, 23, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid #262626', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div 
              onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
              style={{ 
                width: '120px', height: '120px', borderRadius: '60px', background: `${accentColor}1a`, border: `2px solid ${accentColor}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden',
                position: 'relative', cursor: 'pointer'
              }}
            >
              {uploadingAvatar ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader size={32} color={accentColor} />
                </motion.div>
              ) : profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={48} color={accentColor} />
              )}
              
              {/* Overlay for hover effect */}
              {!uploadingAvatar && (
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <Camera size={24} color="white" />
                </div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} style={{ display: 'none' }} />
            </div>

            {profile?.avatar_url && !uploadingAvatar && (
              <button 
                onClick={handleAvatarRemove}
                style={{ marginTop: '-10px', marginBottom: '20px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontWeight: 600, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Remove Avatar
              </button>
            )}

            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800 }}>{profile?.full_name || 'Anonymous User'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#737373', fontSize: '14px', marginBottom: '32px' }}>
              <Mail size={14} /> {user?.email}
            </div>

            <Button variant="outline" size="lg" icon={<LogOut size={16} />} onClick={signOut} style={{ width: '100%', borderRadius: '14px', border: '1px solid #ef4444', color: '#ef4444' }}>
              Logout
            </Button>
          </motion.div>

          {/* Right Column: Forms */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ flex: 1, background: 'rgba(23, 23, 23, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid #262626', borderRadius: '24px', padding: '32px' }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #262626', paddingBottom: '20px', marginBottom: '32px' }}>
              <button 
                onClick={() => setActiveTab('info')}
                style={{ flex: 1, justifyContent: 'center', background: activeTab === 'info' ? `${accentColor}1a` : 'transparent', color: activeTab === 'info' ? accentColor : '#737373', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <User size={16} /> Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                style={{ flex: 1, justifyContent: 'center', background: activeTab === 'security' ? `${accentColor}1a` : 'transparent', color: activeTab === 'security' ? accentColor : '#737373', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Lock size={16} /> Security
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <motion.form key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleProfileSave}>
                  {profileErr && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>{profileErr}</div>}
                  
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name *</label>
                    <input required value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#262626'} />
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Birth</label>
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ width: '100%', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', colorScheme: 'dark' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#262626'} />
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</label>
                      <div style={{ position: 'relative' }}>
                        <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '12px', padding: '14px 16px', color: gender ? 'white' : '#737373', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#262626'}>
                          <option value="" disabled>Select...</option>
                          <option value="Male" style={{ background: '#1c1c1c', color: 'white' }}>Male</option>
                          <option value="Female" style={{ background: '#1c1c1c', color: 'white' }}>Female</option>
                        </select>
                        <ChevronDown size={16} color="#737373" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" disabled={isLoading} style={{ borderRadius: '14px', width: '100%' }}>
                    {isLoading ? 'Saving...' : 'Save Profile Changes'}
                  </Button>
                </motion.form>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.form key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handlePasswordSave}>
                  {authErr && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>{authErr}</div>}
                  {authSuccess && <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>{authSuccess}</div>}

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address (Read-only)</label>
                    <input disabled value={user?.email || ''} style={{ width: '100%', background: 'transparent', border: '1px solid #262626', borderRadius: '12px', padding: '14px 16px', color: '#737373', fontSize: '15px', outline: 'none', opacity: 0.7 }} />
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
                    <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = accentColor} onBlur={e => e.target.style.borderColor = '#262626'} />
                  </div>

                  <Button type="submit" variant="primary" size="lg" disabled={isLoading} style={{ borderRadius: '14px', width: '100%' }}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </div>
  );
};
