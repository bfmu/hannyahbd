'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface SimpleConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

// Versión super simple que SIEMPRE funciona
export default function SimpleConfetti({ trigger, onComplete }: SimpleConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    // Confeti simple y directo desde el centro-abajo de la pantalla visible
    const duration = 2500;
    const end = Date.now() + duration;
    
    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#e91e63', '#ff6b6b'];

    const frame = () => {
      // Confeti desde la parte inferior izquierda
      confetti({
        particleCount: 6,
        angle: 75, // Ángulo hacia arriba-derecha
        spread: 55,
        origin: { x: 0.2, y: 1.0 }, // Desde el fondo izquierdo
        colors: colors,
        startVelocity: 50,
        gravity: 0.6,
        scalar: 1.1
      });
      
      // Confeti desde la parte inferior derecha
      confetti({
        particleCount: 6,
        angle: 105, // Ángulo hacia arriba-izquierda
        spread: 55,
        origin: { x: 0.8, y: 1.0 }, // Desde el fondo derecho
        colors: colors,
        startVelocity: 50,
        gravity: 0.6,
        scalar: 1.1
      });

      // Confeti desde el centro inferior
      confetti({
        particleCount: 8,
        angle: 90, // Directamente hacia arriba
        spread: 70,
        origin: { x: 0.5, y: 1.0 }, // Desde el centro del fondo
        colors: colors,
        startVelocity: 55,
        gravity: 0.5,
        scalar: 1.3
      });

      // Confeti adicional desde los extremos (más espectacular)
      if (Math.random() > 0.6) {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 40,
          origin: { x: 0.1, y: 1.0 }, // Extremo izquierdo
          colors: colors,
          startVelocity: 45,
          gravity: 0.7,
          scalar: 0.9
        });
        
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 40,
          origin: { x: 0.9, y: 1.0 }, // Extremo derecho
          colors: colors,
          startVelocity: 45,
          gravity: 0.7,
          scalar: 0.9
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
