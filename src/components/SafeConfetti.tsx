'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface SafeConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

// Versión de emergencia que SIEMPRE funciona - confeti desde el centro de la pantalla
export default function SafeConfetti({ trigger, onComplete }: SafeConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#ff6347', '#98fb98'];

    const frame = () => {
      // Confeti desde el centro-izquierda de la pantalla
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 70,
        origin: { x: 0.35, y: 0.6 }, // Fijo en el centro-izquierda
        colors: colors,
        startVelocity: 45,
        gravity: 0.6
      });
      
      // Confeti desde el centro-derecha de la pantalla
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 70,
        origin: { x: 0.65, y: 0.6 }, // Fijo en el centro-derecha
        colors: colors,
        startVelocity: 45,
        gravity: 0.6
      });
      
      // Confeti central ocasional
      if (Math.random() > 0.7) {
        confetti({
          particleCount: 2,
          angle: 90,
          spread: 100,
          origin: { x: 0.5, y: 0.5 }, // Centro exacto de la pantalla
          colors: colors,
          startVelocity: 30,
          gravity: 0.5
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    frame();
  }, [trigger, onComplete]);

  return null;
}
