'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  vx: number; // velocidad X
  vy: number; // velocidad Y
  shape: string;
}

interface CustomConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
  targetRef?: React.RefObject<HTMLElement>;
}

const CustomConfetti = ({ trigger, onComplete, targetRef }: CustomConfettiProps) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const colors = ['#ff69b4', '#ff1493', '#ffd700', '#e91e63', '#ff6b6b'];
  const shapes = ['▲', '●', '■', '♦', '✦']; // Formas geométricas simples

  useEffect(() => {
    if (!trigger) {
      setConfettiPieces([]);
      return;
    }

    // Generar partículas de confeti
    const generateConfetti = () => {
      const pieces: ConfettiPiece[] = [];
      
      // Determinar la posición de la carta o usar posición por defecto
      let baseX = 50; // Centro por defecto (%)
      let baseY = 60; // Posición por defecto (%)

      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const containerRect = targetRef.current.offsetParent?.getBoundingClientRect();
        
        if (containerRect) {
          baseX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
          // Usar posición relativa al documento, no al viewport
          baseY = ((rect.top + window.scrollY + rect.height / 2) / (document.documentElement.scrollHeight)) * 100;
        }
      }

      // Crear solo 10 partículas (como el confeti clásico)
      for (let i = 0; i < 10; i++) {
        // 3 puntos de origen: izquierda, centro, derecha de la carta
        let originX = baseX;
        let originY = baseY - 5; // Un poco arriba de la carta
        
        if (i < 3) {
          originX = baseX - 8; // Izquierda
        } else if (i < 6) {
          originX = baseX; // Centro
        } else {
          originX = baseX + 8; // Derecha
        }
        
        pieces.push({
          id: i,
          x: originX + (Math.random() - 0.5) * 5, // Variación pequeña en X
          y: originY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 12 + Math.random() * 6, // Tamaño entre 12-18px (más pequeño)
          rotation: Math.random() * 360,
          vx: (Math.random() - 0.5) * 40, // Menos velocidad X (-20 a 20)
          vy: -Math.random() * 30 - 15, // Velocidad Y hacia arriba (-15 a -45)
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }

      setConfettiPieces(pieces);
    };

    generateConfetti();

    // Limpiar después de 2.5 segundos (como antes)
    const timer = setTimeout(() => {
      setConfettiPieces([]);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [trigger, onComplete, targetRef]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: `${piece.x}vw`,
              y: `${piece.y}vh`,
              rotate: piece.rotation,
              scale: 0.8,
              opacity: 1
            }}
            animate={{
              x: `${piece.x + piece.vx * 0.1}vw`, // Movimiento horizontal
              y: `${piece.y + piece.vy * 0.15}vh`, // Movimiento hacia arriba y luego caída
              rotate: piece.rotation + 720, // Dos vueltas completas
              scale: [0.8, 1.2, 0.6], // Escala que cambia
              opacity: [1, 1, 0] // Se desvanece al final
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 2.5, // Coincide con el timeout
              ease: "easeOut",
              times: [0, 0.3, 1] // Timing para escala y opacidad
            }}
            className="absolute"
            style={{
              fontSize: `${piece.size}px`,
              color: piece.color,
              textShadow: '0 0 4px rgba(0,0,0,0.3)',
              willChange: 'transform, opacity'
            }}
          >
            {piece.shape}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CustomConfetti;
