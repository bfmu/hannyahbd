'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { Volume2, VolumeX } from 'lucide-react';


export default function MusicPlayer() {
  const { isPlaying, toggleMusic } = useBirthdayStore();
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Crear instancia de Howl con música
    soundRef.current = new Howl({
      src: [
        '/assets/music/happy-birthday.mp3', // Archivo local (si existe)
        'https://www.kozco.com/tech/LRMonoPhase4.wav', // URL temporal de prueba
        'https://file-examples.com/storage/fe68c8fa45d2b66d77c8fbc/2017/11/file_example_MP3_700KB.mp3' // Fallback 2
      ],
      autoplay: false, // No auto-reproducir para evitar problemas de políticas del navegador
      loop: true,
      volume: 0.3, // Volumen normal
      
      html5: true, // Usar HTML5 Audio para mejor compatibilidad
      onload: () => {
        // Música cargada
      },
      onloaderror: (soundId, error) => {
        // Error cargando música
        // Intentando siguiente fuente
      },
      onplay: () => {
        // Música iniciada
      },
      onpause: () => {
        // Música pausada
      },
      onstop: () => {
        // Música detenida
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    // Estado de música cambió
    if (!soundRef.current) {
      // soundRef es null
      return;
    }

    if (isPlaying) {
      // Reproduciendo música
      try {
        const playResult = soundRef.current.play();
        if (typeof playResult !== 'number') {
          // Error reproduciendo
        }
      } catch (error) {
        // Error al reproducir
      }
    } else {
      // Pausando música
      soundRef.current.pause();
    }
  }, [isPlaying]);

  const handleToggle = () => {
    if (!soundRef.current) return;

    try {
      // Toggle manual
      // Solo cambiar el estado del store, el useEffect se encargará de la reproducción
      toggleMusic();
    } catch (error) {
      // Error controlando música
    }
  };

  // La música ahora se activa cuando se abre la carta, no necesitamos autoplay

  return (
    <button
      onClick={handleToggle}
      className={`
        fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300
        ${isPlaying 
          ? 'bg-pink-500 text-white hover:bg-pink-600' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }
      `}
      aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
    >
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </button>
  );
}
