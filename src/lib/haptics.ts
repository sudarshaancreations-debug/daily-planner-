// Tactile Haptic Feedback Utility for Mobile & Modern Devices

export const haptics = {
  // Light subtle tick (e.g. checkbox tap, button click)
  tick: () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  },

  // Subtle tick when thumb slides across tabs
  tabChange: () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  },

  // Snap feedback when thumb slider locks into destination
  sliderSnap: () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([10, 20]);
      } catch {}
    }
  },

  // Double micro-pulse when card is slid open to reveal actions
  slideReveal: () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 30, 20]);
      } catch {}
    }
  },

  // Success confirmation vibration (task completed, voice task added)
  success: () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25, 40, 25]);
      } catch {}
    }
  },

  // Warning or deletion haptic
  warning: () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35, 30, 35]);
      } catch {}
    }
  },
};
