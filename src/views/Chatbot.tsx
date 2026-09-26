// ==============================================================================
// Placement Prep Platform - AI Placement Mentor Chatbot View (Section 16.5)
// Chat-bubble layout: Gemini question/answer in zinc-800, student answer in indigo-600/20,
// animated thinking indicator, and domain-grounded interview coaching.
// ==============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { invokeAiAction } from '../lib/edgeApi';
import { Bot, User, Send, Sparkles, Mic } from 'lucide-react';
import { AudioTranscriberModal } from '../components/AudioTranscriberModal';

interface LocalMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export const Chatbot: React.FC = () => {
  const { profile } = useAuth();
  const { activeTarget } = useJobTargets();
  const [micModalOpen, setMicModalOpen] = useState(false);

  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `Hello ${
        profile?.name?.split(' ')[0] || 'there'
      }! I am your dedicated Placement Mentor & AI Interviewer. I can simulate technical architecture deep-dives, conduct STAR behavioral mocks, explain data structure trade-offs, or review your project answers for ${
        activeTarget?.job_track?.name || 'Software Engineering'
      }. What round would you like to prepare for today?`,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: LocalMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await invokeAiAction<{ reply: string }>('chat_with_mentor', {
        message: userMsg.content,
        history: messages.slice(-6),
      });

      if (res?.reply) {
        const modelMsg: LocalMessage = {
          id: `msg-model-${Date.now()}`,
          role: 'model',
          content: res.reply,
        };
        setMessages((prev) => [...prev, modelMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto animate-slide-in">
      {/* 1. Header (Two-line header as per Section 16.5 spec) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            AI Placement Mentor & Mock Interviewer
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            24/7 technical mentorship calibrated for{' '}
            <span className="font-semibold text-indigo-400">
              {activeTarget?.job_track?.name || 'SDE / Backend'}
            </span>
            . Rehearse behavioral STAR stories and architectural trade-offs.
          </p>
        </div>
      </div>

      {/* 2. Chat Box */}
      <div className="card-premium card-score-glow flex flex-col h-[600px] overflow-hidden">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isModel = m.role === 'model';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 max-w-2xl ${isModel ? '' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                    isModel
                      ? 'bg-zinc-800 text-indigo-400 border border-zinc-700'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    isModel
                      ? 'bg-zinc-800 rounded-tl-sm text-zinc-200 border border-zinc-700/60'
                      : 'bg-indigo-600/20 border border-indigo-500/40 rounded-tr-sm text-zinc-100'
                  }`}
                >
                  <p className="font-semibold text-[11px] mb-1 font-mono text-zinc-400">
                    {isModel ? 'Placement Mentor' : 'You'}
                  </p>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="h-8 w-8 rounded-full bg-zinc-800 text-indigo-400 border border-zinc-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-zinc-400 border border-zinc-700/60 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>Mentor is reviewing your response…</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about system design, mock interview questions, or algorithm edge-cases..."
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setMicModalOpen(true)}
            className="p-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:border-indigo-500 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Speak your question using microphone (gemini-3.5-transcribe)"
          >
            <Mic className="w-4 h-4 text-indigo-400" />
          </button>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <AudioTranscriberModal
        isOpen={micModalOpen}
        onClose={() => setMicModalOpen(false)}
        onInsertText={(text: string) => setInput((prev) => (prev ? `${prev} ${text}` : text))}
        title="Voice Question for Mentor"
        contextHint="Speak your question or interview topic aloud. Gemini 3.5 will transcribe it directly into your chat message."
      />
    </div>
  );
};
