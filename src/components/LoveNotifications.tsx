'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Music, Camera } from 'lucide-react';
import { createPortal } from 'react-dom';

interface LoveMessage {
  id: number;
  text: string;
  icon: React.ReactNode;
  delay: number;
  category: 'memory' | 'quality' | 'future' | 'moment';
}

const LoveNotifications = ({ isVisible = true }: { isVisible?: boolean }) => {
  const [currentMessage, setCurrentMessage] = useState<LoveMessage | null>(null);
  const [usedMessages, setUsedMessages] = useState<number[]>([]);
  const [shuffledMessages, setShuffledMessages] = useState<(Omit<LoveMessage, 'id' | 'delay'> & { originalIndex: number })[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 100 mensajes de amor cortos y únicos siguiendo el estilo de la carta
  const loveMessages: Omit<LoveMessage, 'id' | 'delay'>[] = [
    // Recuerdos especiales (25 mensajes)
    { text: "Ese día en casa de cupos cambió mi vida", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "8 años y aún me sorprendes cada día", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Recuerdo a esa niña traviesa que conocí", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "Cada foto cuenta nuestra historia de amor", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "Nuestras aventuras son mis tesoros más preciados", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "El tiempo vuela cuando estoy contigo", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Desde el primer día supe que eras especial", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "Cada momento juntos es historia perfecta", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "Me enamoré de tu manera de ver el mundo", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Tu primer abrazo me dio paz infinita", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "Recuerdo cada detalle de nuestro primer encuentro", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "Años de recuerdos hermosos por crear", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "Tu sonrisa del primer día aún me derrite", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Cada historia juntos es mi favorita", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "El pasado contigo fue solo el comienzo", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "Nos conocimos y el universo sonrió", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Tu risa llenó mi corazón desde el inicio", icon: <Music className="h-4 w-4" />, category: 'memory' },
    { text: "Cada recuerdo contigo es un regalo", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "8 años de momentos únicos e irrepetibles", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "Tu esencia traviesa siempre me encanta", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Creciste ante mis ojos como una flor", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "Cada año juntos ha sido perfecto", icon: <Camera className="h-4 w-4" />, category: 'memory' },
    { text: "Tu forma de madurar me inspira", icon: <Sparkles className="h-4 w-4" />, category: 'memory' },
    { text: "Desde niña traviesa hasta mujer increíble", icon: <Heart className="h-4 w-4" />, category: 'memory' },
    { text: "Nuestra historia es la más hermosa", icon: <Camera className="h-4 w-4" />, category: 'memory' },

    // Cualidades especiales (25 mensajes)
    { text: "Tu amor por los animales me conmueve", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Eres tierna, dulce y suave siempre", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Tu espíritu espontáneo es contagioso", icon: <Music className="h-4 w-4" />, category: 'quality' },
    { text: "Bailas y cantas como si fuera magia", icon: <Music className="h-4 w-4" />, category: 'quality' },
    { text: "Tu pasión por la vida me inspira", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Amas el rock con todo tu corazón", icon: <Music className="h-4 w-4" />, category: 'quality' },
    { text: "Tu forma de ser amiguera es hermosa", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Mantienes a tus amigos cerca del alma", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Tu curiosidad por el mundo fascina", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Conoces gente y culturas con pasión", icon: <Camera className="h-4 w-4" />, category: 'quality' },
    { text: "Tu corazón hermoso refleja en todo", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Eres mi persona favorita siempre", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Tu pureza se ve en cada gesto", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Conviertes lo ordinario en extraordinario", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Tu forma de amar es única en el mundo", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Eres auténtica en cada respiración", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Tu energía ilumina cualquier lugar", icon: <Music className="h-4 w-4" />, category: 'quality' },
    { text: "Tienes el don de hacer feliz", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Tu manera de ser me llena de paz", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Eres la definición perfecta de amor", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Tu espíritu libre me enamora", icon: <Music className="h-4 w-4" />, category: 'quality' },
    { text: "Cada cualidad tuya es perfecta", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },
    { text: "Tu forma de cuidar es tierna", icon: <Heart className="h-4 w-4" />, category: 'quality' },
    { text: "Eres aventura y tranquilidad a la vez", icon: <Camera className="h-4 w-4" />, category: 'quality' },
    { text: "Tu esencia es pura magia", icon: <Sparkles className="h-4 w-4" />, category: 'quality' },

    // Momentos presentes (25 mensajes)
    { text: "Hoy celebro la mujer increíble que eres", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Tu risa es mi canción favorita", icon: <Music className="h-4 w-4" />, category: 'moment' },
    { text: "Este momento es perfecto contigo", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Tu sonrisa ilumina mi universo", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Cada día contigo es un regalo", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Tu abrazo es mi lugar seguro", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Contigo cada instante es especial", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Tu presencia hace todo mejor", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Eres mi definición de felicidad", icon: <Music className="h-4 w-4" />, category: 'moment' },
    { text: "Tu mirada dice más que mil palabras", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Contigo el tiempo se detiene", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Tu voz es música para mis oídos", icon: <Music className="h-4 w-4" />, category: 'moment' },
    { text: "Eres mi razón de sonreír", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Tu amor me da fuerzas cada día", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Contigo siento que puedo volar", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Tu manera de amar es perfecta", icon: <Music className="h-4 w-4" />, category: 'moment' },
    { text: "Eres mi estrella más brillante", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Tu corazón es mi hogar", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Contigo cada día tiene color", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Eres mi inspiración diaria", icon: <Music className="h-4 w-4" />, category: 'moment' },
    { text: "Tu amor hace que todo valga la pena", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Eres la razón de mi sonrisa", icon: <Sparkles className="h-4 w-4" />, category: 'moment' },
    { text: "Tu felicidad es mi prioridad", icon: <Heart className="h-4 w-4" />, category: 'moment' },
    { text: "Contigo cada momento es único", icon: <Camera className="h-4 w-4" />, category: 'moment' },
    { text: "Tu amor me hace sentir completo", icon: <Heart className="h-4 w-4" />, category: 'moment' },

    // Futuro y promesas (25 mensajes)
    { text: "Siempre estaré aquí para ti", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Que todos tus sueños se cumplan", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Te llevaré en mi corazón siempre", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Celebraré cada uno de tus logros", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Este nuevo año será increíble", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Que la vida te llene de alegría", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Tus sueños merecen hacerse realidad", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Te apoyaré en cada paso", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Que la felicidad te acompañe siempre", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Este cumpleaños es solo el comienzo", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Mereces todo lo hermoso de la vida", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Que cada día sea mejor que el anterior", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Tu futuro será tan bello como tú", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Siempre tendrás mi amor incondicional", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Que la vida te dé lo que mereces", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Estaré celebrando contigo cada triunfo", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Tu camino estará lleno de bendiciones", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Que cada deseo tuyo se haga realidad", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "El mejor capítulo de tu vida comienza hoy", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Serás feliz porque lo mereces todo", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Tu luz brillará cada vez más fuerte", icon: <Sparkles className="h-4 w-4" />, category: 'future' },
    { text: "Que la magia te acompañe siempre", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Tu historia apenas está comenzando", icon: <Camera className="h-4 w-4" />, category: 'future' },
    { text: "Siempre serás mi persona especial", icon: <Heart className="h-4 w-4" />, category: 'future' },
    { text: "Que este año te traiga todo lo bueno", icon: <Sparkles className="h-4 w-4" />, category: 'future' }
  ];

  // Colores para cada categoría
  const categoryColors = {
    memory: 'from-pink-500 to-rose-500',
    quality: 'from-purple-500 to-violet-500',
    future: 'from-blue-500 to-indigo-500',
    moment: 'from-amber-500 to-orange-500'
  };

  // Mezclar mensajes al inicio
  useEffect(() => {
    const shuffled = loveMessages
      .map((msg, index) => ({ ...msg, originalIndex: index }))
      .sort(() => Math.random() - 0.5);
    setShuffledMessages(shuffled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Función para obtener el próximo mensaje disponible
  const getNextMessage = useCallback(() => {
    if (shuffledMessages.length === 0) return null;

    // Buscar mensajes no usados
    const availableMessages = shuffledMessages.filter(
      (_, index) => !usedMessages.includes(index)
    );

    // Si no hay mensajes disponibles, resetear y usar todos de nuevo
    if (availableMessages.length === 0) {
      setUsedMessages([]);
      return shuffledMessages[0]; // Usar el primer mensaje del array mezclado
    }

    // Seleccionar mensaje aleatorio de los disponibles
    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selectedMessage = availableMessages[randomIndex];
    const shuffledIndex = shuffledMessages.indexOf(selectedMessage);

    // Marcar este mensaje como usado
    setUsedMessages(prev => [...prev, shuffledIndex]);

    return selectedMessage;
  }, [shuffledMessages, usedMessages]);

  // Función para mostrar un mensaje
  const showMessage = useCallback(() => {
    // Si ya hay un mensaje visible, no mostrar otro (evitar superposición)
    if (currentMessage) {
      return;
    }

    const messageData = getNextMessage();
    if (!messageData) return;

    // Limpiar timer anterior si existe
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    const newMessage: LoveMessage = {
      ...messageData,
      id: Date.now(),
      delay: 0
    };

    setCurrentMessage(newMessage);

    // Crear nuevo timer para ocultar mensaje después de 8 segundos exactos
    const newHideTimer = setTimeout(() => {
      setCurrentMessage(null);
      setHideTimer(null);
    }, 8000);

    setHideTimer(newHideTimer);
  }, [getNextMessage, hideTimer, currentMessage]);

  // Sistema de mensajes secuenciales (no solapados)
  useEffect(() => {
    if (!isVisible || !isInitialized) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextMessage = () => {
      timeoutId = setTimeout(() => {
        showMessage();
        // Programar el siguiente mensaje después de 10 segundos (8s visible + 2s gap)
        scheduleNextMessage();
      }, 10000);
    };

    // Primer mensaje después de 1 segundo
    const initialTimer = setTimeout(() => {
      showMessage();
      // Iniciar el ciclo de mensajes subsecuentes
      scheduleNextMessage();
    }, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
      
      // También limpiar hideTimer si existe
      if (hideTimer) {
        clearTimeout(hideTimer);
        setHideTimer(null);
      }
    };
  }, [isVisible, isInitialized, showMessage, hideTimer]);

  // Inicializar cuando tenemos mensajes mezclados
  useEffect(() => {
    if (shuffledMessages.length > 0 && !isInitialized) {
      setIsInitialized(true);
    }
  }, [shuffledMessages, isInitialized]);

  // Inicializar inmediatamente cuando el componente se monte
  useEffect(() => {
    if (isMounted && shuffledMessages.length > 0) {
      setIsInitialized(true);
    }
  }, [isMounted, shuffledMessages]);

  // Reset cuando se oculta - NO resetear isInitialized para mantener funcionando
  useEffect(() => {
    if (!isVisible) {
      // Limpiar timer de ocultación si existe
      if (hideTimer) {
        clearTimeout(hideTimer);
        setHideTimer(null);
      }
      setCurrentMessage(null);
    }
  }, [isVisible, hideTimer]);

  if (!isVisible || !isMounted) return null;

  return createPortal(
    <div 
      ref={(el) => {
        if (el) {
          // Crear un estilo inline que sobrescriba selectores globales como *, *::before, *::after
          const styleElement = document.createElement('style');
          const uniqueId = `love-notifications-${Date.now()}`;
          el.setAttribute('id', uniqueId);
          
          styleElement.textContent = `
            #${uniqueId} {
              position: fixed !important;
              top: 24px !important;
              left: ${isMobile ? '16px' : '50%'} !important;
              ${isMobile ? 'right: 16px !important;' : ''}
              margin-left: ${isMobile ? '0' : '-192px'} !important;
              z-index: 999999 !important;
              pointer-events: none !important;
              max-width: ${isMobile ? 'none' : '384px'} !important;
              width: ${isMobile ? 'auto' : '100%'} !important;
              transform-style: flat !important;
              transform: none !important;
              backface-visibility: visible !important;
              perspective: none !important;
              will-change: auto !important;
              isolation: isolate !important;
            }
            #${uniqueId}, #${uniqueId}::before, #${uniqueId}::after {
              transform-style: flat !important;
              transform: none !important;
              backface-visibility: visible !important;
              perspective: none !important;
            }
          `;
          
          document.head.appendChild(styleElement);
          
          // Guardar referencia para limpieza posterior si es necesario
          el.setAttribute('data-style-id', styleElement.id || uniqueId);
        }
      }}
    >
      <AnimatePresence>
        {currentMessage && (
          <motion.div
            key={currentMessage.id}
            initial={isMobile ? { 
              y: -60,
              opacity: 0, 
              scale: 0.95
            } : { 
              x: 300,
              y: -20,
              opacity: 0, 
              scale: 0.9
            }}
            animate={{ 
              x: 0,
              y: 0,
              opacity: 1, 
              scale: 1
            }}
            exit={isMobile ? { 
              y: -60,
              opacity: 0, 
              scale: 0.95
            } : { 
              x: 300,
              y: -20,
              opacity: 0, 
              scale: 0.9
            }}
            transition={isMobile ? {
              type: "spring",
              stiffness: 350,
              damping: 30,
              duration: 0.5
            } : {
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.4
            }}
            className={`
              relative p-3 md:p-4 rounded-2xl shadow-xl backdrop-blur-sm border border-white/30
              bg-gradient-to-r ${categoryColors[currentMessage.category]} text-white
              max-w-xs md:max-w-sm mx-auto md:mx-0
            `}
          >
            {/* Icono flotante */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-2 -left-2 p-2 rounded-full bg-white/30 backdrop-blur"
            >
              <div className="text-white">
                {currentMessage.icon}
              </div>
            </motion.div>

            {/* Contenido del mensaje */}
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="ml-4 pr-6"
            >
              <p className="text-xs md:text-sm font-medium leading-relaxed text-white/95">
                {currentMessage.text}
              </p>
            </motion.div>

            {/* Efecto de brillo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-2 right-2 text-white/50"
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>

            {/* Barra de progreso sutil */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ 
                duration: 8, 
                ease: "linear"
              }}
              className="absolute bottom-0 left-0 h-0.5 bg-white/40 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default LoveNotifications;