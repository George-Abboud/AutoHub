import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Logo } from './Logo';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';
import { ChevronDown } from 'lucide-react';

export const ProfileSetupModal: React.FC = () => {
  const { accentColor } = useAppViewModel();
  const { updateProfile, isLoading, error } = useProfileViewModel();
  
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    
    await updateProfile({
      full_name: fullName.trim(),
      date_of_birth: dob || undefined,
      gender: gender || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: '20px'
      }}
    >
      <motion.form
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        onSubmit={handleSubmit}
        style={{
          background: '#171717', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '440px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Logo size={48} showText={false} />
        </div>
        
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 900, color: '#EBEBEB', textAlign: 'center' }}>
          Welcome to AutoHub
        </h2>
        <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#737373', textAlign: 'center', lineHeight: '1.5' }}>
          Before you start building workflows, please complete your profile.
        </p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ color: '#ef4444', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Full Name (Required)
          </label>
          <input 
            type="text" placeholder="e.g. John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '16px 20px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = `${accentColor}05`; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Date of Birth (Optional)
            </label>
            <input 
              type="date" value={dob} onChange={e => setDob(e.target.value)}
              style={{ 
                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
                colorScheme: 'dark'
              }}
              onFocus={e => e.target.style.borderColor = accentColor}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Gender (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <select 
                value={gender} onChange={e => setGender(e.target.value)}
                style={{ 
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px', color: gender ? 'white' : '#737373', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
                  appearance: 'none', cursor: 'pointer'
                }}
                onFocus={e => e.target.style.borderColor = accentColor}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <option value="" disabled>Select...</option>
                <option value="Male" style={{ background: '#1c1c1c', color: 'white' }}>Male</option>
                <option value="Female" style={{ background: '#1c1c1c', color: 'white' }}>Female</option>
              </select>
              <ChevronDown size={16} color="#737373" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
        
        <Button type="submit" variant="primary" size="lg" disabled={isLoading || !fullName.trim()} style={{ width: '100%', borderRadius: '16px' }}>
          {isLoading ? 'Saving...' : 'Complete Profile'}
        </Button>
      </motion.form>
    </motion.div>
  );
};
