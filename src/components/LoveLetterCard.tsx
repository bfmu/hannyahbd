'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Download, Heart } from 'lucide-react';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { generateLoveLetterPDF, generateCompleteBirthdayPDF } from '@/utils/pdfGenerator';
import { notifyLetterOpened } from '@/utils/notifications';
import { getTrackingData, logTracking, type TrackingData } from '@/utils/tracking';
import { birthdayConfig, samplePhotos } from '@/data/sampleData';
import ConfettiEffect from './ConfettiEffect';

interface LoveLetterCardProps {
  title?: string;
  content: string;
  authorName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  showConfetti?: boolean;
}

export default function LoveLetterCard({ 
  title = "Una Carta Especial Para Ti",
  content,
  authorName = "Con amor",
  onOpen,
  onClose,
  showConfetti = true
}: LoveLetterCardProps) {
  const { isLetterOpen, toggleLetter, markAsVisited, isPlaying, toggleMusic } = useBirthdayStore();
  const letterRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null); // Referencia para el confeti
  const [showLetterConfetti, setShowLetterConfetti] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleToggleLetter = async () => {
    if (!isLetterOpen) {
      markAsVisited(); // Marcar como visitado cuando se abre
      
      // Activar confeti al abrir la carta
      if (showConfetti) {
        setShowLetterConfetti(true);
      }
      
      // Activar música al abrir la carta (SIEMPRE, para forzar sincronización)
      // Iniciando música
      if (!isPlaying) {
        toggleMusic();
        // Activando música
      } else {
        // Si ya está "activo" pero quizás no se escucha, reiniciar
        // Reiniciando música
        toggleMusic(); // Pausar
        setTimeout(() => {
          toggleMusic(); // Reactivar
          // Música reiniciada
        }, 100);
      }
      
      // Obtener información de tracking y enviar notificación
      try {
        // Obteniendo tracking
        const trackingData: TrackingData = await getTrackingData();
        
        // Log silencioso (no guardamos nada localmente por seguridad)
        logTracking(trackingData);
        
        // Enviar notificación con información de tracking
        await notifyLetterOpened(birthdayConfig.recipientName, birthdayConfig.notifications, trackingData);
        // Notificación enviada
        
        
      } catch {
        // Error en notificación
        
        // Fallback: enviar notificación sin tracking
        try {
          await notifyLetterOpened(birthdayConfig.recipientName, birthdayConfig.notifications);
          // Notificación fallback
        } catch {
          // Error en fallback
        }
      }
      
      onOpen?.();
    } else {
      onClose?.();
    }
    toggleLetter();
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return; // Evitar dobles clics
    
    setIsDownloading(true);
    
    try {
      // Generando PDF
      
      // Generar PDF completo con carta y fotos
      await generateCompleteBirthdayPDF(
        title,
        content,
        authorName,
        samplePhotos,
        'feliz-cumpleanos-especial.pdf'
      );
      
      // PDF generado
      
      // Mostrar mensaje de éxito brevemente
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
      
    } catch {
      // Error PDF completo
      
      // Fallback: PDF simple solo con texto
      try {
        // PDF respaldo
        generateLoveLetterPDF(title, content, authorName, 'mi-carta-de-cumpleanos.pdf');
        
        setTimeout(() => {
          setIsDownloading(false);
        }, 2000);
        
      } catch {
        // Error PDF respaldo
        alert('No se pudo generar el PDF. Por favor, intenta de nuevo.');
        setIsDownloading(false);
      }
    }
  };


  return (
    <div ref={cardRef} className="max-w-4xl mx-auto px-4">
      <ConfettiEffect 
        trigger={showLetterConfetti} 
        onComplete={() => setShowLetterConfetti(false)}
      />
      <AnimatePresence mode="wait">
        {!isLetterOpen ? (
          // Carta cerrada
          <motion.div
            key="closed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full"
            style={{ perspective: '1000px' }}
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleLetter}
              className="cursor-pointer bg-gradient-to-br from-pink-100 to-purple-100 p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-pink-200 relative overflow-hidden w-full"
            >
              {/* Decoración de sobre */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-50" />
              
              {/* Contenido del sobre cerrado */}
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Mail size={80} className="text-pink-500 mx-auto mb-6" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {title}
                </h3>
                
                <p className="text-lg text-gray-600 mb-6">
                  Haz clic para abrir tu carta especial 💕
                </p>
                
                {/* Decoraciones flotantes */}
                <div className="absolute top-4 left-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart size={24} className="text-red-400" fill="currentColor" />
                  </motion.div>
                </div>
                
                <div className="absolute top-8 right-8">
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ✨
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Carta abierta
          <motion.div
            key="open"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="relative w-full"
          >
            <div 
              ref={letterRef}
              className="bg-gradient-to-br from-yellow-50 to-pink-50 p-6 md:p-8 lg:p-12 rounded-3xl shadow-2xl border-4 border-yellow-200 relative w-full min-h-[400px]"
            >
              {/* Papel de carta con textura */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkMTQ5Njc4IiBmaWxsLW9wYWNpdHk9IjAuNCIgZmlsbC1ydWxlPSJub256ZXJvIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] repeat" />
              </div>
              
              {/* Botón de cerrar */}
              <button
                onClick={handleToggleLetter}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Cerrar carta"
              >
                <MailOpen size={24} />
              </button>
              
              {/* Contenido de la carta */}
              <div className="relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-serif">
                    {title}
                  </h2>
                </motion.div>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-serif"
                >
                  {content.split('\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className="mb-6 text-lg leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 text-right"
                >
                  <p className="text-xl font-semibold text-gray-800 font-serif">
                    {authorName} 💕
                  </p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <Heart size={20} className="text-red-500" fill="currentColor" />
                    <Heart size={16} className="text-pink-500" fill="currentColor" />
                    <Heart size={20} className="text-red-500" fill="currentColor" />
                  </div>
                </motion.div>
              </div>
              
              {/* Botones de acción */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex justify-center mt-8 relative z-20"
              >
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={`
                    flex items-center justify-center space-x-3 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium z-10 relative text-lg
                    ${isDownloading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 hover:from-blue-600 hover:to-blue-700 cursor-pointer'
                    }
                  `}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Generando PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={24} />
                      <span>Descargar PDF Completo</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
