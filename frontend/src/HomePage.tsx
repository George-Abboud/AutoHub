import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Layout, ChevronRight, Zap, Pencil, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/Button';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { Sidebar } from './components/layout/Sidebar';
import { Logo } from './components/ui/Logo';
import { useWorkspaceViewModel } from './viewmodels/useWorkspaceViewModel';
import { useAppViewModel } from './viewmodels/useAppViewModel';
import { useAuthViewModel } from './viewmodels/useAuthViewModel';
import { AuthModal } from './components/ui/AuthModal';
import { useStore } from './store';
import { ConfirmModal } from './components/ui/ConfirmModal';

export const HomePage = () => {
  const { workspaces, createWorkspace, deleteWorkspace, selectWorkspace, renameWorkspace } = useWorkspaceViewModel();
  const { accentColor } = useAppViewModel();
  const { user } = useAuthViewModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState('');

  // Rename state
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Delete confirmation
  const [wsToDelete, setWsToDelete] = useState<string | null>(null);

  // Enable scrolling on body only for HomePage
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWsName.trim()) {
      createWorkspace(newWsName.trim());
      setNewWsName('');
      setIsModalOpen(false);
    }
  };

  const openRename = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setRenameTarget({ id, name });
    setRenameValue(name);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameTarget && renameValue.trim()) {
      renameWorkspace(renameTarget.id, renameValue.trim());
      setRenameTarget(null);
    }
  };

  const confirmDelete = () => {
    if (wsToDelete) {
      deleteWorkspace(wsToDelete);
      setWsToDelete(null);
    }
  };

  const isSyncing = useStore(s => s.isSyncing);
  const isFetching = useStore(s => s.isFetching);

  if (!user) {
    return (
      <div style={{ height: '100vh', background: '#171717', position: 'relative' }}>
        <AnimatedBackground />
        <AuthModal />
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh',
      overflowY: 'auto',
      background: '#171717', 
      color: '#EBEBEB',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <AnimatedBackground />
      <Sidebar />

      <div style={{ 
        position: 'relative', zIndex: 1, 
        maxWidth: '1200px', margin: '0 auto', 
        padding: '80px 40px 40px 120px' 
      }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '64px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Logo size={40} showText />
              <AnimatePresence>
                {isSyncing && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>
                      <Cloud size={14} color={accentColor} />
                    </motion.div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Syncing</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p style={{ color: '#737373', margin: 0, fontSize: '16px', fontWeight: 500, maxWidth: '500px', lineHeight: '1.6' }}>
              Architect, deploy, and scale your intelligent automation workflows with surgical precision.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Button
              size="lg"
              icon={<Plus size={18} strokeWidth={3} />}
              onClick={() => setIsModalOpen(true)}
              style={{ padding: '16px 32px', borderRadius: '16px' }}
            >
              Create Workspace
            </Button>
          </div>
        </motion.div>

        {/* Workspaces Grid */}
        {workspaces.length === 0 && !isFetching ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '60px', background: 'rgba(23, 23, 23, 0.4)', backdropFilter: 'blur(12px)',
              borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)',
              marginTop: '40px'
            }}
          >
            <Layout size={32} color="#404040" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <p style={{ color: '#737373', fontSize: '15px', fontWeight: 500, margin: 0 }}>
              No active workspaces found
            </p>
          </motion.div>
        ) : workspaces.length === 0 && isFetching ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '240px', background: '#1c1c1c', borderRadius: '24px', border: '1px solid #262626', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <motion.div 
                  animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: '48px', height: '48px', background: '#262626', borderRadius: '14px', marginBottom: '24px' }} 
                />
                <motion.div 
                  animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  style={{ width: '60%', height: '20px', background: '#262626', borderRadius: '4px', marginBottom: '12px' }} 
                />
                <motion.div 
                  animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  style={{ width: '40%', height: '14px', background: '#262626', borderRadius: '4px' }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '32px',
            transition: 'grid-template-columns 0.4s ease'
          }}>
            <AnimatePresence>
              {workspaces.map((ws, i) => (
                <motion.div
                  key={ws.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, type: 'tween', ease: 'easeOut', duration: 0.2 }}
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: accentColor,
                    background: '#212121',
                    boxShadow: `0 0 20px ${accentColor}1a`
                  }}
                  onClick={() => selectWorkspace(ws.id)}
                  style={{
                    background: '#1c1c1c',
                    border: '1px solid #262626',
                    borderRadius: '24px',
                    padding: '28px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', 
                      background: `${accentColor}0d`, 
                      borderRadius: '14px',
                      border: `1px solid ${accentColor}1a`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Zap size={24} color={accentColor} />
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <motion.button
                        whileHover={{ scale: 1.2, color: accentColor }}
                        onClick={(e) => openRename(e, ws.id, ws.name)}
                        style={{ 
                          background: 'transparent', border: 'none', 
                          color: '#404040', cursor: 'pointer', padding: '6px',
                          transition: 'color 0.2s'
                        }}
                      >
                        <Pencil size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2, color: accentColor }}
                        onClick={(e) => { e.stopPropagation(); setWsToDelete(ws.id); }}
                        style={{ 
                          background: 'transparent', border: 'none', 
                          color: '#404040', cursor: 'pointer', padding: '6px',
                          transition: 'color 0.2s'
                        }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 800, color: '#EBEBEB' }}>{ws.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#737373', fontSize: '13px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} strokeWidth={2.5} />
                      {ws.createdAt}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layout size={14} strokeWidth={2.5} />
                      {ws.nodes.length} nodes
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '24px', 
                    paddingTop: '20px', 
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: accentColor,
                    fontSize: '14px',
                    fontWeight: 800
                  }}>
                    Open Automation
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
            onClick={() => setIsModalOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleCreate}
              style={{
                background: '#171717',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '32px',
                padding: '40px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
              }}
            >
              <h2 style={{ margin: '0 0 28px 0', fontSize: '24px', fontWeight: 900, color: '#EBEBEB' }}>New Automation</h2>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Workspace Name
                </label>
                <input 
                  autoFocus
                  placeholder="e.g. Sales Pipeline Sync"
                  value={newWsName}
                  onChange={e => setNewWsName(e.target.value)}
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
                  }}
                  onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = `${accentColor}05`; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button 
                  type="button"
                  variant="outline"
                  size="flex"
                  onClick={() => setIsModalOpen(false)}
                  style={{ borderRadius: '14px' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                  size="flex"
                  style={{ flex: 2, borderRadius: '14px' }}
                >
                  Create Workspace
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameTarget && (
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
            onClick={() => setRenameTarget(null)}
          >
            <motion.form
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleRename}
              style={{
                background: '#171717',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '32px',
                padding: '40px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
              }}
            >
              <h2 style={{ margin: '0 0 28px 0', fontSize: '24px', fontWeight: 900, color: '#EBEBEB' }}>Rename Workspace</h2>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#737373', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Workspace Name
                </label>
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
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
                  }}
                  onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = `${accentColor}05`; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  type="button"
                  variant="outline"
                  size="flex"
                  onClick={() => setRenameTarget(null)}
                  style={{ borderRadius: '14px' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="flex"
                  style={{ flex: 2, borderRadius: '14px' }}
                >
                  Save Name
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {wsToDelete && (
          <ConfirmModal 
            title="Delete Workspace?"
            message="This will permanently delete the entire workspace and all its data. This action cannot be undone."
            confirmText="Delete Permanently"
            onConfirm={confirmDelete}
            onCancel={() => setWsToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
