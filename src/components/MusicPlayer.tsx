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
        console.log('🎵 Música cargada correctamente');
      },
      onloaderror: (soundId, error) => {
        console.error('❌ Error cargando música:', error);
        console.log('🔍 Intentando siguiente fuente...');
      },
      onplay: () => {
        console.log('▶️ Música iniciada');
      },
      onpause: () => {
        console.log('⏸️ Música pausada');
      },
      onstop: () => {
        console.log('⏹️ Música detenida');
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    console.log('🔄 MusicPlayer useEffect - isPlaying cambió a:', isPlaying); // Debug
    if (!soundRef.current) {
      console.log('❌ soundRef.current es null'); // Debug
      return;
    }

    if (isPlaying) {
      console.log('🎵 Reproduciendo música desde el store'); // Debug
      try {
        const playResult = soundRef.current.play();
        if (playResult === false) {
          console.log('⚠️ Howler.js no pudo reproducir - posible problema de carga'); // Debug
        }
      } catch (error) {
        console.error('Error al reproducir música:', error);
      }
    } else {
      console.log('🎵 Pausando música desde el store'); // Debug
      soundRef.current.pause();
    }
  }, [isPlaying]);

  const handleToggle = () => {
    if (!soundRef.current) return;

    try {
      console.log('🎵 Toggle manual de música'); // Debug
      // Solo cambiar el estado del store, el useEffect se encargará de la reproducción
      toggleMusic();
    } catch (error) {
      console.error('Error controlando música:', error);
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
