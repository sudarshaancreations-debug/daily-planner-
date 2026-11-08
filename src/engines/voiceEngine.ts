/**
 * Voice Engine (Independent Subsystem)
 * 
 * Architectural Rule:
 * 1. TTS is independent of the AI engine. It functions 100% offline.
 * 2. STT is an optional input bridge that translates voice to text.
 * 3. AI engine calls VoiceEngine to speak responses, but VoiceEngine never requires AI.
 */

export interface VoiceEngineSettings {
  ttsVoice?: string;
  ttsRate: number;    // 0.5 to 2.0 (default 1.0)
  ttsPitch: number;   // 0.5 to 1.5 (default 1.0)
  ttsVolume: number;  // 0.0 to 1.0 (default 1.0)
  autoAnnounce: boolean;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

class VoiceEngineImpl {
  private settings: VoiceEngineSettings = {
    ttsRate: 1.0,
    ttsPitch: 1.0,
    ttsVolume: 1.0,
    autoAnnounce: true,
  };

  private recognition: any = null;
  private isRecognitionActive = false;

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('nimora_voice_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {}
  }

  public saveSettings(newSettings: Partial<VoiceEngineSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nimora_voice_settings', JSON.stringify(this.settings));
      } catch {}
    }
  }

  public getSettings(): VoiceEngineSettings {
    return { ...this.settings };
  }

  // ==========================================
  // TEXT-TO-SPEECH (TTS) - 100% Local Browser Engine
  // ==========================================

  public isTTSSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isTTSSupported()) return [];
    try {
      return window.speechSynthesis.getVoices();
    } catch {
      return [];
    }
  }

  /**
   * Reads text aloud using the device's native TTS synthesizer.
   * Works completely offline with zero external network calls.
   */
  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): boolean {
    if (!this.isTTSSupported() || !text || !text.trim()) {
      options?.onError?.(new Error('TTS not supported or text is empty'));
      return false;
    }

    try {
      // Cancel previous speech to prevent queue build-up
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = this.settings.ttsRate;
      utterance.pitch = this.settings.ttsPitch;
      utterance.volume = this.settings.ttsVolume;

      if (this.settings.ttsVoice) {
        const voices = this.getAvailableVoices();
        const found = voices.find((v) => v.name === this.settings.ttsVoice);
        if (found) utterance.voice = found;
      }

      utterance.onstart = () => options?.onStart?.();
      utterance.onend = () => options?.onEnd?.();
      utterance.onerror = (e) => options?.onError?.(e);

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('VoiceEngine TTS speak error:', err);
      options?.onError?.(err);
      return false;
    }
  }

  public stopSpeaking(): void {
    if (this.isTTSSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  public isSpeaking(): boolean {
    if (!this.isTTSSupported()) return false;
    return window.speechSynthesis.speaking;
  }

  // ==========================================
  // SPEECH-TO-TEXT (STT) - Dedicated Listener
  // ==========================================

  public isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public startListening(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: string) => void;
    onEnd: () => void;
  }): boolean {
    if (!this.isSTTSupported()) {
      callbacks.onError('Speech recognition is not supported in this browser.');
      return false;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {}
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecognitionActive = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        callbacks.onResult(text, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        this.isRecognitionActive = false;
        callbacks.onError(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        this.isRecognitionActive = false;
        callbacks.onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isRecognitionActive = false;
      callbacks.onError(err?.message || 'Failed to start recognition');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isRecognitionActive) {
      try {
        this.recognition.stop();
      } catch {}
      this.isRecognitionActive = false;
    }
  }
}

export const voiceEngine = new VoiceEngineImpl();
