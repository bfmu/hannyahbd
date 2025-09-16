'use client';

import { useEffect, useRef } from 'react';

interface SoundEffectProps {
  trigger: boolean;
  soundType: 'letter-open' | 'confetti' | 'sparkle';
  volume?: number;
}

const SoundEffect = ({ trigger, soundType, volume = 0.3 }: SoundEffectProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!trigger) return;

    // Crear sonidos con Web Audio API para efectos simples
    const createSound = (type: string) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      switch (type) {
        case 'letter-open':
          // Sonido suave de "página"
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
          break;
        case 'confetti':
          // Sonido alegre para confeti
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.2);
          break;
        case 'sparkle':
          // Sonido brillante para estrellas
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.1);
          break;
      }

      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Limpiar después del sonido
      setTimeout(() => {
        audioContext.close();
      }, 1000);
    };

    try {
      createSound(soundType);
    } catch (error) {
      // Silenciar errores de audio en navegadores que no lo soporten
    }
  }, [trigger, soundType, volume]);

  return null;
};

export default SoundEffect;
