'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
  autoPlayInterval?: number;
}

export default function PhotoCarousel({ photos, autoPlayInterval = 5000 }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goToPhoto = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || photos.length <= 1) return;

    const interval = setInterval(nextPhoto, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextPhoto, autoPlayInterval, photos.length]);

  // Pausar auto-play al hacer hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (photos.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No hay fotos para mostrar</p>
      </div>
    );
  }

  return (
    <div 
      className="relative max-w-4xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Contenedor principal del carrusel */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={photos[currentIndex].src}
              alt={photos[currentIndex].alt}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            
            {/* Overlay con gradient para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Siguiente foto"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Indicadores de posición */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPhoto(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a foto ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Corazón flotante animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="absolute top-4 right-4 text-red-500"
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>
      </div>

      {/* Caption de la foto actual */}
      {photos[currentIndex].caption && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-lg text-gray-700 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg">
            {photos[currentIndex].caption}
          </p>
        </motion.div>
      )}

      {/* Contador de fotos */}
      {photos.length > 1 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
            {currentIndex + 1} de {photos.length}
          </span>
        </div>
      )}
    </div>
  );
}
