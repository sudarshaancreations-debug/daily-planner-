'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceOverlayProps {
  onTranscript: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Browser SpeechRecognition typing fallback
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
}

export function VoiceOverlay({ onTranscript, isOpen, onClose }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results || []) as any[];
      const current = results
        .map(r => r[0]?.transcript || '')
        .join('');
      setTranscript(current);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      setError(e.error === 'not-allowed' ? 'Microphone access denied' : `Error: ${e.error || 'speech failed'}`);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    setError('');
    setTranscript('');
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setIsListening(false);
  }, []);

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center text-gray-900"
      >
        <h2 className="text-lg font-bold mb-2">🎤 Voice Input</h2>
        <p className="text-sm text-gray-500 mb-6">Hold or click the button to speak</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="button"
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          onClick={() => {
            if (isListening) stopListening();
            else startListening();
          }}
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl transition-all ${
            isListening
              ? 'bg-red-500 text-white scale-110 animate-pulse shadow-lg shadow-red-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
          }`}
        >
          🎙️
        </button>

        {transcript && (
          <div className="mt-6">
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 italic">"{transcript}"</p>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium"
            >
              Add as Task
            </button>
          </div>
        )}

        <button type="button" onClick={onClose} className="mt-4 text-xs text-gray-400 hover:text-gray-600 block mx-auto">
          Press Esc to close
        </button>
      </div>
    </div>
  );
}
