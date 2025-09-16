'use client';

import { useEffect, useState } from 'react';
import { useBirthdayStore } from '@/stores/birthdayStore';
import CountdownTimer from '@/components/CountdownTimer';
import ConfettiEffect from '@/components/ConfettiEffect';
import MusicPlayer from '@/components/MusicPlayer';
import PhotoCarousel from '@/components/PhotoCarousel';
import LoveLetterCard from '@/components/LoveLetterCard';
import { samplePhotos, loveLetterContent, birthdayConfig } from '@/data/sampleData';
import { motion } from 'framer-motion';

export default function Home() {
  const { isUnlocked, checkUnlockStatus, setBirthdayDate } = useBirthdayStore();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Configurar la fecha del cumpleaños desde la configuración
    setBirthdayDate(birthdayConfig.birthdayDate);
    // Verificar estado de desbloqueo al cargar la página
    checkUnlockStatus();
  }, [checkUnlockStatus, setBirthdayDate]);


  const handleUnlock = () => {
    setShowConfetti(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <MusicPlayer />
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-8">
          
          {!isUnlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl"
            >
              {/* Header romántico */}
              <div className="mb-12">
                <motion.h1 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4"
                >
                  Para Alguien Muy Especial
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
                >
                  Una sorpresa especial está esperándote para tu día más importante... 💝
                </motion.p>
              </div>

              {/* Contador */}
              <CountdownTimer onUnlock={handleUnlock} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center max-w-6xl w-full"
            >
              {/* Contenido desbloqueado */}
              <motion.h1
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-8"
              >
                🎉 ¡Feliz Cumpleaños! 🎂
              </motion.h1>

              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl text-gray-700 mb-12"
              >
                ¡Tu día especial finalmente llegó! 🥳✨
              </motion.p>

              {/* Componentes de fotos y carta */}
              <div className="grid gap-12 pb-16">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    📸 Nuestros Momentos Especiales
                  </h2>
                  <PhotoCarousel photos={samplePhotos} />
                </motion.div>

                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-16"
                >
                  <LoveLetterCard 
                    content={loveLetterContent}
                    authorName={birthdayConfig.senderName}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
