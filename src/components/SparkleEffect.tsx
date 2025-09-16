'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface SparkleEffectProps {
  trigger: boolean;
  duration?: number;
}

const SparkleEffect = ({ trigger, duration = 3000 }: SparkleEffectProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!trigger) {
      setSparkles([]);
      return;
    }

    // Generar estrellas brillantes alrededor de la carta
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      
      // Solo 8 estrellas para no sobrecargar
      for (let i = 0; i < 8; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100, // Posición X en %
          y: Math.random() * 60 + 20, // Posición Y entre 20% y 80%
          size: Math.random() * 20 + 15, // Tamaño entre 15-35px
          delay: Math.random() * 2 // Delay hasta 2s
        });
      }
      
      setSparkles(newSparkles);
    };

    generateSparkles();

    // Limpiar después de la duración especificada
    const timer = setTimeout(() => {
      setSparkles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              scale: 0, 
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              scale: [0, 1.2, 1, 0],
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ 
              scale: 0, 
              opacity: 0 
            }}
            transition={{
              duration: 2.5,
              delay: sparkle.delay,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut"
            }}
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              fontSize: `${sparkle.size}px`,
            }}
            className="absolute text-yellow-400"
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SparkleEffect;
