'use client';

import { useState, useEffect } from 'react';
import { calculateTimeRemaining, TimeRemaining } from '@/utils/dateUtils';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  onUnlock?: () => void;
}

export default function CountdownTimer({ onUnlock }: CountdownTimerProps) {
  const { birthdayDate, checkUnlockStatus, isUnlocked } = useBirthdayStore();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(birthdayDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(birthdayDate);
      setTimeRemaining(newTimeRemaining);
      
      // Verificar si se debe desbloquear el contenido
      if (newTimeRemaining.isExpired && !isUnlocked) {
        checkUnlockStatus();
        onUnlock?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [birthdayDate, isUnlocked, checkUnlockStatus, onUnlock]);

  if (timeRemaining.isExpired) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-pink-500 mb-4">
          🎉 ¡Feliz Cumpleaños! 🎂
        </h1>
        <p className="text-xl text-gray-600">
          ¡Tu día especial ha llegado!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center">
      <motion.h2 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Faltan para tu día especial:
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {[
          { value: timeRemaining.days, label: 'Días', color: 'bg-pink-500' },
          { value: timeRemaining.hours, label: 'Horas', color: 'bg-purple-500' },
          { value: timeRemaining.minutes, label: 'Minutos', color: 'bg-blue-500' },
          { value: timeRemaining.seconds, label: 'Segundos', color: 'bg-green-500' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200 
            }}
            className={`${item.color} text-white p-4 sm:p-6 rounded-2xl shadow-lg`}
          >
            <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
              {item.value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm uppercase tracking-wide">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-gray-600 text-lg"
      >
        Algo muy especial está esperándote... ✨
      </motion.p>
    </div>
  );
}
