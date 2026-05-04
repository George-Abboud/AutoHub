import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Logo } from './Logo';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

export const AuthModal: React.FC = () => {
  const { accentColor } = useAppViewModel();
  const { signIn, signUp, resetPassword, isLoading, error, successMsg, clearError } = useAuthViewModel();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Rate Limiting Logic (5 attempts)
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (lockoutTimer > 0) {
      timer = setTimeout(() => setLockoutTimer(prev => prev - 1), 1000);
    } else if (lockoutTimer === 0 && attempts >= 5) {
      setAttempts(0); // Reset after lockout
    }
    return () => clearTimeout(timer);
  }, [lockoutTimer, attempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    if (!email) return;
    
    if (mode === 'forgot_password') {
      await resetPassword(email);
      return;
    }

    if (!password) return;

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTimer(60); // Lock for 60 seconds
      }
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot_password') => {
    clearError();
    setMode(newMode);
  };

  const isLocked = lockoutTimer > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px'
      }}
    >
      <motion.form
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onSubmit={handleSubmit}
        style={{
          background: '#171717',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '32px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <Logo size={48} showText={false} />
        </div>
        
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 900, color: '#EBEBEB', textAlign: 'center' }}>
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'forgot_password' && 'Reset Password'}
        </h2>
        <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#737373', textAlign: 'center' }}>
          {mode === 'login' && 'Login to access your cloud workflows'}
          {mode === 'signup' && 'Join AutoHub to orchestrate automations'}
          {mode === 'forgot_password' && 'We will send you a reset link'}
        </p>

        <AnimatePresence mode="wait">
          {error && !isLocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#ef4444', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#4ade80', fontSize: '13px', background: 'rgba(74, 222, 128, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}
            >
              {successMsg}
            </motion.div>
          )}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#ef4444', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}
            >
              Too many attempts. Try again in {lockoutTimer}s.
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginBottom: mode === 'forgot_password' ? '32px' : '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Email Address
          </label>
          <input 
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLocked}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px 20px',
              color: 'white',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
              opacity: isLocked ? 0.5 : 1
            }}
            onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = `${accentColor}05`; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
          />
        </div>

        {mode !== 'forgot_password' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              {mode === 'login' && (
                <span 
                  onClick={() => switchMode('forgot_password')}
                  style={{ fontSize: '12px', color: accentColor, cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot?
                </span>
              )}
            </div>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLocked}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px 20px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                opacity: isLocked ? 0.5 : 1
              }}
              onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = `${accentColor}05`; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            />
          </div>
        )}
        
        <Button 
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLocked || isLoading}
          style={{ width: '100%', borderRadius: '16px', marginBottom: '20px', opacity: (isLocked || isLoading) ? 0.5 : 1 }}
        >
          {isLoading ? 'Processing...' : (
            mode === 'login' ? 'Login' : 
            mode === 'signup' ? 'Create Account' : 
            'Send Reset Link'
          )}
        </Button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#737373' }}>
          {mode === 'login' && (
            <>Don't have an account? <span onClick={() => switchMode('signup')} style={{ color: accentColor, cursor: 'pointer', fontWeight: 600 }}>Sign Up</span></>
          )}
          {mode === 'signup' && (
            <>Already have an account? <span onClick={() => switchMode('login')} style={{ color: accentColor, cursor: 'pointer', fontWeight: 600 }}>Login</span></>
          )}
          {mode === 'forgot_password' && (
            <>Remember your password? <span onClick={() => switchMode('login')} style={{ color: accentColor, cursor: 'pointer', fontWeight: 600 }}>Back to Login</span></>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
};
