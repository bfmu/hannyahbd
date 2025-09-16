'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface Heart {
  id: number;
  size: number;
  color: string;
  left: number;
  duration: number;
  delay: number;
  emoji: string;
}

// Mover arrays fuera del componente para evitar recreaciones
const HEART_COLORS = [
  '#FF69B4', // Hot Pink
  '#FF1493', // Deep Pink
  '#FFB6C1', // Light Pink
  '#FFC0CB', // Pink
  '#FF6347', // Tomato
  '#DC143C', // Crimson
];

const HEART_EMOJIS = ['💖', '💕', '💗', '💓', '💘', '♥️'];

// Reducir número de corazones para mejor rendimiento
const HEARTS_COUNT = 8;
const REGENERATION_INTERVAL = 30000; // 30 segundos en lugar de 12

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función optimizada para generar corazones
  const generateHearts = useCallback((startId: number = 0): Heart[] => {
    const newHearts: Heart[] = [];
    
    for (let i = 0; i < HEARTS_COUNT; i++) {
      newHearts.push({
        id: startId + i,
        size: Math.random() * 15 + 12, // Tamaño reducido: 12-27px
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        left: Math.random() * 90 + 5, // 5-95% para evitar bordes
        duration: Math.random() * 4 + 6, // Duración reducida: 6-10 segundos
        delay: Math.random() * 10, // Delay hasta 10s para distribución
      });
    }
    
    return newHearts;
  }, []);

  // Generar corazones iniciales
  useEffect(() => {
    const initialHearts = generateHearts(0);
    setHearts(initialHearts);
    setIdCounter(HEARTS_COUNT);
  }, [generateHearts]);

  // Regenerar corazones con menor frecuencia
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prevHearts => {
        // Solo actualizar posiciones y propiedades, no recrear completamente
        return prevHearts.map((heart, index) => ({
          ...heart,
          id: 1000 + idCounter + index,
          left: Math.random() * 90 + 5,
          color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
          emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        }));
      });
      setIdCounter(prev => prev + HEARTS_COUNT);
    }, REGENERATION_INTERVAL);

    return () => clearInterval(interval);
  }, [idCounter, generateHearts]);

  // Memo para optimizar el estilo del contenedor
  const containerStyle = useMemo(() => ({
    willChange: 'transform',
    transform: 'translate3d(0, 0, 0)', // Forzar aceleración GPU
  }), []);

  // No renderizar en el servidor
  if (!isMounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      style={containerStyle}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: '-30px',
            fontSize: `${heart.size}px`,
            color: heart.color,
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)', // GPU acceleration
          }}
          initial={{ 
            y: 0, 
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: -window.innerHeight - 100, // Animación más simple
            opacity: [0, 0.8, 0.8, 0], // Opacity más eficiente
            scale: [0, 1, 1, 0.8]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear", // Linear es más eficiente que easeInOut
            times: [0, 0.1, 0.8, 1],
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>,
    document.body
  );
};

export default FloatingHearts;