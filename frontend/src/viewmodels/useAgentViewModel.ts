import { useState, useCallback } from 'react';
import { useStore } from '../store';
import { supabase } from '../lib/supabaseClient';
import type { ChatMessage, AgentAction } from '../types';

/**
 * ViewModel for the AI Agent Chatbot.
 * Manages chat messages, sending user input to the backend,
 * and executing returned agent actions on the canvas.
 */
export const useAgentViewModel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Hi! I\'m your AutoHub assistant. I can help you build workflows — try asking me to add nodes, connect them, or run your workflow.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAction = useCallback((action: AgentAction) => {
    const state = useStore.getState();
    const { activeWorkspaceId, workspaces, accentColor } = state;
    if (!activeWorkspaceId) return;

    const ws = workspaces.find(w => w.id === activeWorkspaceId);
    if (!ws) return;

    switch (action.type) {
      case 'addNode': {
        const nodeType = (action.payload?.nodeType as string) || 'colorNode';
        const id = `${nodeType}-${Date.now()}`;
        const lastNode = ws.nodes[ws.nodes.length - 1];
        const position = {
          x: (lastNode?.position?.x ?? 100) + 200,
          y: lastNode?.position?.y ?? 150,
        };
        const data = nodeType === 'colorNode'
          ? { color: (action.payload?.color as string) || accentColor }
          : { text: (action.payload?.text as string) || 'New log message' };

        useStore.setState({
          workspaces: workspaces.map(w =>
            w.id === activeWorkspaceId
              ? { ...w, nodes: [...w.nodes, { id, type: nodeType, position, data }] }
              : w
          ),
        });
        break;
      }

      case 'deleteNode': {
        const nodeId = action.payload?.nodeId as string;
        if (!nodeId || nodeId === 'start-1') break;
        useStore.setState({
          workspaces: workspaces.map(w =>
            w.id === activeWorkspaceId
              ? {
                  ...w,
                  nodes: w.nodes.filter(n => n.id !== nodeId),
                  edges: w.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
                }
              : w
          ),
        });
        break;
      }

      case 'runWorkflow': {
        state.runWorkflow();
        break;
      }

      case 'changeColor': {
        const newColor = action.payload?.color as string;
        if (newColor) {
          useStore.setState({ accentColor: newColor });
        }
        break;
      }

      default:
        break;
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const state = useStore.getState();
      const ws = state.workspaces.find(w => w.id === state.activeWorkspaceId);

      const context = ws ? {
        nodes: ws.nodes.map(n => ({ id: n.id, type: n.type as string, data: n.data as Record<string, unknown> })),
        edges: ws.edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      } : undefined;

      const { data, error: fnError } = await supabase.functions.invoke('chat-agent', {
        body: { message: text.trim(), workspaceContext: context },
      });

      if (fnError) throw fnError;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data?.reply || 'I processed your request.',
        timestamp: new Date().toLocaleTimeString(),
        action: data?.action,
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (data?.action) {
        executeAction(data.action);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Connection error';
      // Fallback: handle common commands locally when Edge Function is unavailable
      const reply = handleLocalFallback(text.trim());
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply.content,
        timestamp: new Date().toLocaleTimeString(),
        action: reply.action,
      };
      setMessages(prev => [...prev, fallbackMsg]);

      if (reply.action) {
        executeAction(reply.action);
      }

      if (!reply.handled) {
        setError(errMsg);
      }
    } finally {
      setIsThinking(false);
    }
  }, [executeAction]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'system',
      content: 'Chat cleared. How can I help you?',
      timestamp: new Date().toLocaleTimeString(),
    }]);
  }, []);

  return { messages, isThinking, error, sendMessage, clearMessages };
};

/** Local fallback for common commands when backend is unavailable */
function handleLocalFallback(text: string): { content: string; action?: AgentAction; handled: boolean } {
  const lower = text.toLowerCase();

  if (lower.includes('add') && lower.includes('color')) {
    const colorMatch = text.match(/#[0-9a-fA-F]{6}/);
    return {
      content: `Done! I added a Color node${colorMatch ? ` with color ${colorMatch[0]}` : ''}.`,
      action: { type: 'addNode', payload: { nodeType: 'colorNode', ...(colorMatch ? { color: colorMatch[0] } : {}) } },
      handled: true,
    };
  }

  if (lower.includes('add') && lower.includes('log')) {
    const textMatch = text.match(/['"](.+?)['"]/);
    return {
      content: `Done! I added a Log node${textMatch ? ` with message "${textMatch[1]}"` : ''}.`,
      action: { type: 'addNode', payload: { nodeType: 'logNode', ...(textMatch ? { text: textMatch[1] } : {}) } },
      handled: true,
    };
  }

  if (lower.includes('run') || lower.includes('execute') || lower.includes('start')) {
    return {
      content: '🚀 Running your workflow now!',
      action: { type: 'runWorkflow' },
      handled: true,
    };
  }

  if (lower.includes('change') && lower.includes('color') || lower.includes('theme')) {
    const colorMatch = text.match(/#[0-9a-fA-F]{6}/);
    if (colorMatch) {
      return {
        content: `Theme color changed to ${colorMatch[0]}!`,
        action: { type: 'changeColor', payload: { color: colorMatch[0] } },
        handled: true,
      };
    }
  }

  if (lower.includes('help')) {
    return {
      content: `Here's what I can do:\n• **Add a Color node** — "add a color node"\n• **Add a Log node** — "add a log node with message 'Hello'"\n• **Run the workflow** — "run the workflow"\n• **Change theme** — "change color to #3b82f6"`,
      handled: true,
    };
  }

  return {
    content: `I understood your request but the AI backend isn't connected yet. Try these commands:\n• "add a color node"\n• "add a log node"\n• "run the workflow"\n• "help"`,
    handled: true,
  };
}
