import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Settings, 
  Sparkles, 
  Key,
  ChevronLeft,
  Bot,
  User as UserIcon,
  Loader2,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Zap,
  PlayCircle
} from 'lucide-react';
import { useStore } from '../../store';
import type { ChatMessage } from '../../types';

const PRESET_RESPONSES: Record<string, string> = {
  "default": "Welcome to AutoHub AI! I'm here to help you automate your workflows. Provide a Gemini or Groq API Key in settings for advanced assistance.",
  "help": "AutoHub is a visual automation platform. You can create workflows by connecting nodes. Try adding a 'Start Node' and then a 'Log Node' to see how it works!",
  "guide": "To get started:\n1. Create a workspace.\n2. Add nodes from the sidebar.\n3. Connect them using your mouse.\n4. Press 'Run' to see the execution trace.",
  "nodes": "We currently support:\n- Start Node: The beginning of every workflow.\n- Color Node: Changes the data color flowing through edges.\n- Log Node: Outputs text to the execution console.",
};

const SIDEBAR_WIDTH = 350;

export const AIChatbot = () => {
  const isAIChatbotOpen = useStore(s => s.isAIChatbotOpen);
  const toggleAIChatbot = useStore(s => s.toggleAIChatbot);
  const settings = useStore(s => s.settings);
  const setApiKey = useStore(s => s.setApiKey);
  const accentColor = useStore(s => s.accentColor);
  const workspaces = useStore(s => s.workspaces);
  const activeWorkspaceId = useStore(s => s.activeWorkspaceId);
  const loadChatMessages = useStore(s => s.loadChatMessages);
  const saveChatMessage = useStore(s => s.saveChatMessage);
  const user = useStore(s => s.user);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount or when user changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const history = await loadChatMessages();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Fallback to welcome message if no history
        setMessages([{
          id: '1',
          role: 'assistant',
          content: PRESET_RESPONSES.default,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };
    fetchHistory();
  }, [user, loadChatMessages]);

  const getWorkspacesContext = () => {
    if (!workspaces || workspaces.length === 0) return "User has no workspaces yet.";
    
    const activeWs = workspaces.find(w => w.id === activeWorkspaceId);
    let ctx = `Active Workspace: ${activeWs ? `"${activeWs.name}"` : "None"}\n\n`;
    ctx += "Information about User's Workspaces:\n";
    workspaces.forEach((ws, i) => {
      ctx += `${i+1}. Workspace Name: "${ws.name}" ${ws.id === activeWorkspaceId ? "(ACTIVE)" : ""}\n`;
      ctx += `   - Created At: ${ws.createdAt}\n`;
      ctx += `   - Nodes Count: ${ws.nodes?.length || 0}\n`;
      ctx += `   - Edges Count: ${ws.edges?.length || 0}\n`;
      if (ws.nodes && ws.nodes.length > 0) {
        ctx += `   - Node Types: ${Array.from(new Set(ws.nodes.map(n => n.type))).join(', ')}\n`;
      }
      ctx += '\n';
    });
    return ctx;
  };

  useEffect(() => {
    if (settings?.api_keys?.gemini) setGeminiKeyInput(settings.api_keys.gemini);
    if (settings?.api_keys?.groq) setGroqKeyInput(settings.api_keys.groq);
  }, [settings?.api_keys]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() && !selectedAction) return;

    const geminiKey = settings?.api_keys?.gemini;
    const groqKey = settings?.api_keys?.groq;

    // 1. Prepare User Message (Even for Actions)
    let userContent = input.trim();
    if (selectedAction === 'run') {
      const activeWs = workspaces.find(w => w.id === activeWorkspaceId);
      userContent = input.trim() ? `Action: Run "${input.trim()}"` : `Action: Run "${activeWs?.name || 'Active Workspace'}"`;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date().toLocaleTimeString()
    };

    // 2. Save User Message
    setMessages(prev => [...prev, userMessage]);
    await saveChatMessage(userMessage);

    // Special logic for Run Action
    if (selectedAction === 'run') {
      const activeWs = workspaces.find(w => w.id === activeWorkspaceId);
      if (activeWs && !input.trim()) {
        handleActionRunWorkspace(activeWs.name);
        setSelectedAction(null);
        return;
      } else if (!input.trim()) {
        addDebugMessage("Error: Please provide a workspace name to run, or enter a workspace first.");
        setSelectedAction(null);
        return;
      } else {
        handleActionRunWorkspace(input.trim());
        setSelectedAction(null);
        setInput('');
        return;
      }
    }

    setInput('');
    setIsTyping(true);

    const workspacesContext = getWorkspacesContext();
    const fullPrompt = `CONTEXT:\n${workspacesContext}\n\nUSER QUESTION: ${input}\n\nIMPORTANT: If the user wants to run a workspace, you MUST include the exact string "ACTION_RUN_WORKSPACE: [Workspace Name]" in your response. DO NOT simulate the run in text. The system will handle the actual execution.`;
    
    setTimeout(async () => {
      let responseContent = '';
      try {
        if (input.toLowerCase().trim() === 'listmodels') {
          const key = groqKey || geminiKey;
          if (!key) {
            responseContent = "Please add an API key first.";
          } else {
            const v1Response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
            const v1Data = await v1Response.json();
            const models = v1Data.models?.map((m: any) => m.name.replace('models/', '')) || [];
            responseContent = models.length > 0 
              ? "Available models:\n" + models.map((m: string) => `- ${m}`).join('\n')
              : "No models found or invalid key.";
          }
        } else if (groqKey) {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
            body: JSON.stringify({ 
              model: 'llama-3.1-8b-instant', 
              messages: [
                { role: 'system', content: 'You are AutoHub AI Assistant. To trigger a workspace run, you MUST output "ACTION_RUN_WORKSPACE: Name". Do not simulate execution results in text.' },
                { role: 'user', content: fullPrompt }
              ] 
            })
          });
          const data = await response.json();
          responseContent = response.ok ? data.choices[0].message.content : `Groq Error: ${data.error?.message}`;
        } else if (geminiKey) {
          const endpoints = [{ v: 'v1', m: 'gemini-1.5-flash' }, { v: 'v1beta', m: 'gemini-1.5-flash' }, { v: 'v1', m: 'gemini-pro' }];
          let success = false;
          for (const e of endpoints) {
            if (success) break;
            try {
              const res = await fetch(`https://generativelanguage.googleapis.com/${e.v}/models/${e.m}:generateContent?key=${geminiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
              });
              const d = await res.json();
              if (res.ok && d.candidates?.[0]?.content?.parts?.[0]?.text) {
                responseContent = d.candidates[0].content.parts[0].text;
                success = true;
              }
            } catch { continue; }
          }
          if (!success) responseContent = "Gemini failed. Try Groq or check your key.";
        } else {
          const low = input.toLowerCase();
          if (low.includes('help')) responseContent = PRESET_RESPONSES.help;
          else if (low.includes('guide')) responseContent = PRESET_RESPONSES.guide;
          else responseContent = "I'm in Guide Mode. Add a Groq or Gemini key in settings for AI.";
        }
      } catch (err) {
        responseContent = "Error: Something went wrong. Please try again.";
      } finally {
        const msg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent || "No response received.",
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, msg]);
        saveChatMessage(msg); // Persist
        setIsTyping(false);

        // Enhanced Action Command Detection
        const actionTrigger = "ACTION_RUN_WORKSPACE:";
        if (responseContent.toUpperCase().includes(actionTrigger)) {
          const parts = responseContent.split(new RegExp(actionTrigger, 'i'));
          const wsName = parts[1].trim().split('\n')[0].replace(/["'*:.]/g, '').trim();
          handleActionRunWorkspace(wsName);
        }
      }
    }, 500);
  };

  const handleActionRunWorkspace = async (name: string) => {
    const ws = workspaces.find(w => w.name.toLowerCase() === name.toLowerCase());
    
    if (!ws) {
      addDebugMessage(`Error: Workspace "${name}" not found.`);
      return;
    }

    const isActive = ws.id === activeWorkspaceId;

    if (!isActive) {
      addDebugMessage(`System: Preparing to switch to workspace "${ws.name}"...`);
      useStore.getState().selectWorkspace(ws.id);
      addDebugMessage(`System: Navigated. Waiting 2 seconds for visual stability...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      addDebugMessage(`System: Already in workspace "${ws.name}". Validating directly...`);
    }

    // 1. Check StartNode existence
    const startNode = ws.nodes?.find(n => n.type === 'startNode');
    if (!startNode) {
      addDebugMessage(`Error: No "Start Node" found in "${ws.name}". Every workflow must have a Start Node to begin execution.`);
      return;
    }

    // 2. Check StartNode connection (Business Logic Check)
    const isConnected = ws.edges?.some(e => e.source === startNode.id);
    if (!isConnected) {
      addDebugMessage(`Error: The "Start Node" is placed but not connected to anything. I cannot run an empty workflow. Please connect it to another node first.`);
      return;
    }

    // 3. Trigger actual execution
    addDebugMessage(`System: Validation successful. Launching execution engine...`);
    useStore.getState().runWorkflow();
    addDebugMessage(`System: Workspace "${ws.name}" is now executing successfully.`);
  };

  const addDebugMessage = (content: string) => {
    const debugMsg: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      role: 'assistant',
      content: content,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, debugMsg]);
    saveChatMessage(debugMsg); // Persist debug too
  };

  const handleQuickRun = () => {
    const activeWs = workspaces.find(w => w.id === activeWorkspaceId);
    if (activeWs) {
      handleActionRunWorkspace(activeWs.name);
    } else {
      setInput("ACTION_RUN_WORKSPACE: ");
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', height: '100%' }}>
      {/* Edge Toggle Tab - Hides when open */}
      <motion.button
        onClick={() => toggleAIChatbot()}
        whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)', x: -2 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          right: isAIChatbotOpen ? `${SIDEBAR_WIDTH}px` : '0', 
          y: '-50%',
          opacity: isAIChatbotOpen ? 0 : 1,
          scale: isAIChatbotOpen ? 0 : 1,
          pointerEvents: isAIChatbotOpen ? 'none' : 'auto'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
        style={{
          position: 'fixed', top: '50%', width: '32px', height: '100px', background: '#171717',
          border: '1px solid rgba(255, 255, 255, 0.05)', borderRight: 'none', borderRadius: '16px 0 0 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 3000, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          color: isAIChatbotOpen ? accentColor : '#737373', gap: '12px'
        }}
      >
        <Bot size={20} strokeWidth={isAIChatbotOpen ? 2.5 : 2} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isAIChatbotOpen ? accentColor : 'rgba(255,255,255,0.1)' }} />
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: isAIChatbotOpen ? SIDEBAR_WIDTH : 0, opacity: isAIChatbotOpen ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
        style={{
          height: '100%', 
          background: '#171717', 
          borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          flexShrink: 0,
          boxShadow: '-20px 0 50px rgba(0,0,0,0.6)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #262626', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: `${SIDEBAR_WIDTH}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${accentColor}10`, border: `1px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} style={{ color: accentColor }} />
            </div>
            <div>
              <h3 style={{ color: '#EBEBEB', margin: 0, fontSize: '15px', fontWeight: 700 }}>AutoHub Assistant</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: settings?.api_keys?.groq ? '#10b981' : '#F2572B', boxShadow: `0 0 8px ${settings?.api_keys?.groq ? '#10b981' : '#F2572B'}` }} />
                <span style={{ fontSize: '11px', color: '#737373', fontWeight: 600, textTransform: 'uppercase' }}>
                  {settings?.api_keys?.groq ? 'Groq Engine Active' : 'Gemini Engine Active'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '10px', color: '#737373' }}>
              <Settings size={18} />
            </button>
            <button onClick={() => toggleAIChatbot(false)} style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '10px', color: '#737373' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minWidth: `${SIDEBAR_WIDTH}px`, background: 'linear-gradient(180deg, #171717 0%, #121212 100%)' }}>
          <AnimatePresence mode="wait">
            {showSettings ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', color: '#737373', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <ChevronLeft size={16} /> Back to conversation
                </button>
                
                {/* Groq Settings */}
                <div style={{ padding: '16px', background: '#1c1c1c', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Zap size={16} style={{ color: '#10b981' }} />
                    <h4 style={{ color: '#EBEBEB', margin: 0, fontSize: '14px', fontWeight: 700 }}>Groq (Recommended)</h4>
                  </div>
                  <p style={{ fontSize: '11px', color: '#737373', marginBottom: '12px' }}>Fastest open-source AI (Llama 3). Highly recommended.</p>
                  <input
                    type="password" value={groqKeyInput} onChange={(e) => setGroqKeyInput(e.target.value)}
                    placeholder="Enter Groq API key..."
                    style={{ width: '100%', background: '#111111', border: '1px solid #262626', borderRadius: '10px', padding: '10px', color: 'white', fontSize: '12px', outline: 'none' }}
                  />
                  <button onClick={() => { setApiKey('groq', groqKeyInput); setShowSettings(false); }} style={{ width: '100%', marginTop: '12px', background: '#10b981', border: 'none', borderRadius: '10px', padding: '10px', color: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                    Save Groq Key
                  </button>
                </div>

                {/* Gemini Settings */}
                <div style={{ padding: '16px', background: '#1c1c1c', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Sparkles size={16} style={{ color: accentColor }} />
                    <h4 style={{ color: '#EBEBEB', margin: 0, fontSize: '14px', fontWeight: 700 }}>Google Gemini</h4>
                  </div>
                  <input
                    type="password" value={geminiKeyInput} onChange={(e) => setGeminiKeyInput(e.target.value)}
                    placeholder="Enter Gemini API key..."
                    style={{ width: '100%', background: '#111111', border: '1px solid #262626', borderRadius: '10px', padding: '10px', color: 'white', fontSize: '12px', outline: 'none' }}
                  />
                  <button onClick={() => { setApiKey('gemini', geminiKeyInput); setShowSettings(false); }} style={{ width: '100%', marginTop: '12px', background: accentColor, border: 'none', borderRadius: '10px', padding: '10px', color: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                    Save Gemini Key
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', gap: '12px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'user' ? 'rgba(255, 255, 255, 0.05)' : `${accentColor}15`, border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${accentColor}30` }}>
                        {msg.role === 'user' ? <UserIcon size={14} color="#737373" /> : <Bot size={14} style={{ color: accentColor }} />}
                      </div>
                      <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px' }}>
                        <div style={{ 
                          padding: '12px 18px', 
                          borderRadius: '18px', 
                          background: msg.role === 'user' ? accentColor : 'rgba(255, 255, 255, 0.02)', 
                          color: msg.role === 'user' ? 'white' : '#EBEBEB', 
                          fontSize: '13.5px', 
                          border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.03)', 
                          borderTopLeftRadius: msg.role === 'assistant' ? 0 : '18px', 
                          borderTopRightRadius: msg.role === 'user' ? 0 : '18px', 
                          lineHeight: '1.6',
                          fontWeight: 400,
                          boxShadow: msg.role === 'user' ? `0 4px 15px ${accentColor}30` : 'none',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere'
                        }}>
                          {msg.content.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                        <span style={{ fontSize: '10px', color: '#404040', fontWeight: 600, textTransform: 'uppercase', padding: '0 4px' }}>{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={14} style={{ color: accentColor }} />
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '18px', borderTopLeftRadius: 0, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <Loader2 size={14} style={{ color: '#404040' }} className="animate-spin" />
                        <span style={{ fontSize: '11px', color: '#404040', fontWeight: 700, textTransform: 'uppercase' }}>Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Redesigned Input Area */}
                <div style={{ padding: '24px', paddingTop: 0 }}>
                  <div style={{ 
                    background: '#1c1c1c', border: '1px solid #262626', borderRadius: '24px', padding: '12px',
                    display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }}>
                    <textarea
                      value={input} onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="Ask anything or run workflow..."
                      style={{ 
                        width: '100%', background: 'transparent', border: 'none', color: '#EBEBEB', 
                        fontSize: '13px', outline: 'none', resize: 'none', minHeight: '40px', maxHeight: '120px',
                        padding: '4px'
                      }}
                    />
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                        {/* Plus Button & Actions Menu */}
                        <div style={{ position: 'relative' }}>
                          <button 
                            onClick={() => setShowActionMenu(!showActionMenu)}
                            style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', fontSize: '24px', fontWeight: 300 }}
                          >
                            <motion.div animate={{ rotate: showActionMenu ? 45 : 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              +
                            </motion.div>
                          </button>
                          
                          <AnimatePresence>
                            {showActionMenu && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                style={{ position: 'absolute', bottom: '40px', left: 0, background: '#262626', borderRadius: '12px', padding: '8px', border: '1px solid #404040', width: '140px', zIndex: 4000 }}
                              >
                                <button 
                                  onClick={() => { setSelectedAction('run'); setShowActionMenu(false); }}
                                  style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#EBEBEB', fontSize: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px' }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <Zap size={14} style={{ color: accentColor }} /> Run Workflow
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Action Tag */}
                        {selectedAction && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: `${accentColor}20`, borderRadius: '12px', border: `1px solid ${accentColor}40` }}
                          >
                            <Zap size={12} style={{ color: accentColor }} />
                            <span style={{ fontSize: '11px', color: accentColor, fontWeight: 700 }}>Run</span>
                            <X size={10} style={{ color: accentColor, cursor: 'pointer' }} onClick={() => setSelectedAction(null)} />
                          </motion.div>
                        )}
                      </div>

                      <button
                        onClick={handleSend} disabled={(!input.trim() && !selectedAction) || isTyping}
                        style={{ 
                          width: '36px', height: '36px', 
                          background: (input.trim() || selectedAction) ? accentColor : '#262626', 
                          border: 'none', borderRadius: '50%', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          color: (input.trim() || selectedAction) ? 'white' : '#404040',
                          transition: 'all 0.2s',
                          boxShadow: (input.trim() || selectedAction) ? `0 0 15px ${accentColor}40` : 'none'
                        }}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
