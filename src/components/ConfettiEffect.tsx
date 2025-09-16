'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;

    console.log('🎊 ¡Activando confeti!'); // Debug log
    
    const duration = 3000; // 3 segundos
    const end = Date.now() + duration;

    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#ff6347', '#98fb98'];

    const frame = () => {
      // Efecto más dramático con más partículas
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: colors,
        startVelocity: 45,
        gravity: 0.6
      });
      
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: colors,
        startVelocity: 45,
        gravity: 0.6
      });
      
      // Confeti desde el centro también
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors: colors,
        startVelocity: 30,
        gravity: 0.5
      });

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
