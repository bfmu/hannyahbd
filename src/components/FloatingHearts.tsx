'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Heart {
  id: number;
  size: number;
  color: string;
  left: number;
  duration: number;
  delay: number;
  emoji: string;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Colores románticos para los corazones
  const heartColors = [
    '#FF69B4', // Hot Pink
    '#FF1493', // Deep Pink
    '#FFB6C1', // Light Pink
    '#FFC0CB', // Pink
    '#FF6347', // Tomato
    '#FF4500', // Orange Red
    '#DC143C', // Crimson
    '#B22222', // Fire Brick
    '#DA70D6', // Orchid
    '#DDA0DD', // Plum
  ];

  // Diferentes tipos de corazones para más variedad
  const heartEmojis = ['💖', '💕', '💗', '💓', '💘', '♥️', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '❣️'];

  // Generar arrays de colores y emojis fuera del efecto para evitar recreaciones
  const heartColorsArray = heartColors;
  const heartEmojisArray = heartEmojis;

  // Generar corazones iniciales
  useEffect(() => {
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      
      // Generar 20 corazones con propiedades aleatorias (más corazones para mejor efecto)
      for (let i = 0; i < 20; i++) {
        newHearts.push({
          id: i, // IDs iniciales simples y únicos
          size: Math.random() * 25 + 15, // Tamaño entre 15px y 40px
          color: heartColorsArray[Math.floor(Math.random() * heartColorsArray.length)],
          emoji: heartEmojisArray[Math.floor(Math.random() * heartEmojisArray.length)],
          left: Math.random() * 100, // Posición horizontal aleatoria (0-100%)
          duration: Math.random() * 12 + 8, // Duración entre 8-20 segundos (más variedad)
          delay: Math.random() * 8, // Delay inicial aleatorio más grande
        });
      }
      
      setHearts(newHearts);
      setIdCounter(20); // Empezar contador después de los IDs iniciales
    };

    generateHearts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez

  // Regenerar corazones periódicamente para mantener el efecto
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prevHearts => {
        return prevHearts.map((heart, index) => ({
          ...heart,
          id: 1000 + idCounter + index, // ID único basado en contador
          left: Math.random() * 100,
          color: heartColorsArray[Math.floor(Math.random() * heartColorsArray.length)],
          emoji: heartEmojisArray[Math.floor(Math.random() * heartEmojisArray.length)],
        }));
      });
      // Incrementar contador para la próxima regeneración
      setIdCounter(prev => prev + 100);
    }, 12000); // Regenerar cada 12 segundos

    return () => clearInterval(interval);
  }, [idCounter, heartColorsArray, heartEmojisArray]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            fontSize: `${heart.size}px`,
            color: heart.color,
          }}
          initial={{ 
            y: 0, 
            opacity: 0,
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            y: -1200, // Usar valor fijo para evitar problemas de SSR
            x: [0, 30, -20, 40, 0], // Movimiento lateral sutil para más naturalidad
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
            scale: [0, 1, 1.1, 0.8]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.1, 0.8, 1], // Control de opacity más suave
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
