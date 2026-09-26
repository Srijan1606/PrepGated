// ==============================================================================
// PrepGated - Audio Transcriber Modal
// Speech Recognition voice capture with live transcription and fallback
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Square, Check, AlertCircle } from 'lucide-react';

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string) => void;
  title?: string;
  contextHint?: string;
}

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
  title = 'Voice Question',
  contextHint = 'Speak your question or thoughts aloud. Voice transcription will convert it to text.',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setTranscript('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
      setErrorMsg('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = (e: any) => {
        console.warn('SpeechRecognition error:', e);
        setIsRecording(false);
        setErrorMsg('Microphone error or permission denied. Please allow mic access.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to initialize microphone');
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleApply = () => {
    if (transcript.trim()) {
      onInsertText(transcript.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md card-premium card-score-glow p-6 space-y-5 animate-slide-in relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#4f46e5] dark:text-[#a5b4fc]">
              <Mic className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context Hint */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{contextHint}</p>

        {/* Live Transcript Field */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 min-h-[90px] text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
          {transcript ? (
            <span>{transcript}</span>
          ) : (
            <span className="text-zinc-400 italic">
              {isRecording ? 'Listening... speak clearly into your microphone' : 'Click "Start Recording" to speak your question'}
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {!speechSupported ? (
            <span className="text-xs text-amber-500 font-mono">
              Speech recognition not supported in this browser.
            </span>
          ) : isRecording ? (
            <button
              onClick={stopListening}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording</span>
            </button>
          ) : (
            <button
              onClick={startListening}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Recording</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!transcript.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use Transcript</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
