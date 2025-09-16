'use client';

import { useEffect, useState } from 'react';
import { useBirthdayStore } from '@/stores/birthdayStore';
import CountdownTimer from '@/components/CountdownTimer';
import ConfettiEffect from '@/components/ConfettiEffect';
import MusicPlayer from '@/components/MusicPlayer';
import PhotoCarousel from '@/components/PhotoCarousel';
import LoveLetterCard from '@/components/LoveLetterCard';
import FloatingHearts from '@/components/FloatingHearts';
import LoveNotifications from '@/components/LoveNotifications';
import { samplePhotos, loveLetterContent, birthdayConfig } from '@/data/sampleData';
import { notifyPageVisit } from '@/utils/notifications';
import { getTrackingData, logTracking, TrackingData } from '@/utils/tracking';
import { motion } from 'framer-motion';

export default function Home() {
  const { isUnlocked, checkUnlockStatus, setBirthdayDate, resetPageState } = useBirthdayStore();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Resetear estados de página (carta cerrada, música pausada)
    resetPageState();
    // Configurar la fecha del cumpleaños desde la configuración
    setBirthdayDate(birthdayConfig.birthdayDate);
    // Verificar estado de desbloqueo al cargar la página
    checkUnlockStatus();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  useEffect(() => {
    // Notificar sobre la visita a la página con contador de visitas
    const handlePageVisit = async () => {
      const visitCountKey = 'birthday_visit_count';
      const lastVisitKey = 'birthday_last_visit';
      
      // Obtener contador actual (o inicializar en 0)
      const currentCount = parseInt(localStorage.getItem(visitCountKey) || '0');
      const newVisitCount = currentCount + 1;
      
      // Obtener fecha de la última visita
      const lastVisit = localStorage.getItem(lastVisitKey);
      const currentTime = new Date().toISOString();
      
      // Actualizar contador y última visita
      localStorage.setItem(visitCountKey, newVisitCount.toString());
      localStorage.setItem(lastVisitKey, currentTime);

      try {
        const trackingData: TrackingData = await getTrackingData();

        // Log silencioso
        logTracking(trackingData);

        // Enviar notificación con información de tracking y contador
        await notifyPageVisit(birthdayConfig.notifications, trackingData, {
          visitCount: newVisitCount,
          lastVisit: lastVisit ? new Date(lastVisit) : null,
          isFirstVisit: newVisitCount === 1
        });

      } catch {
        // Fallback: enviar notificación sin tracking pero con contador
        try {
          await notifyPageVisit(birthdayConfig.notifications, undefined, {
            visitCount: newVisitCount,
            lastVisit: lastVisit ? new Date(lastVisit) : null,
            isFirstVisit: newVisitCount === 1
          });
        } catch {
          // Error manejado silenciosamente
        }
      }
    };

    // Ejecutar la notificación después de un pequeño delay para asegurar que la página cargó
    const timer = setTimeout(handlePageVisit, 1000);

    return () => clearTimeout(timer);
  }, []); // Solo ejecutar una vez al montar el componente


  const handleUnlock = () => {
    setShowConfetti(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative">
      {/* Elementos flotantes - FUERA del contenedor principal */}
      <FloatingHearts />
      <LoveNotifications isVisible={true} />
      
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
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-16 w-full"
                >
                  <LoveLetterCard 
                    content={loveLetterContent}
                    authorName={birthdayConfig.senderName}
                  />
                </motion.div>
                
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

                
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
