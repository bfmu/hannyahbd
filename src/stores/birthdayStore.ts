import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BirthdayState {
  // Configuración
  birthdayDate: Date;
  isUnlocked: boolean;
  hasVisited: boolean;
  
  // Estados de la aplicación
  isLetterOpen: boolean;
  isPlaying: boolean;
  currentPhotoIndex: number;
  
  // Acciones
  setBirthdayDate: (date: Date) => void;
  checkUnlockStatus: () => void;
  toggleLetter: () => void;
  toggleMusic: () => void;
  setCurrentPhoto: (index: number) => void;
  markAsVisited: () => void;
}

export const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set, get) => ({
      // Estados iniciales
      birthdayDate: new Date('2024-12-31'), // Fecha por defecto - 31 de diciembre para testing
      isUnlocked: false,
      hasVisited: false,
      isLetterOpen: false,
      isPlaying: false,
      currentPhotoIndex: 0,
      
      // Acciones
      setBirthdayDate: (date: Date) => 
        set({ birthdayDate: date }),
        
      checkUnlockStatus: () => {
        const now = new Date();
        const { birthdayDate } = get();
        const isUnlocked = now >= birthdayDate;
        set({ isUnlocked });
      },
      
      toggleLetter: () => 
        set((state) => ({ isLetterOpen: !state.isLetterOpen })),
        
      toggleMusic: () => 
        set((state) => {
          console.log('🔄 Store toggleMusic: de', state.isPlaying, 'a', !state.isPlaying); // Debug
          return { isPlaying: !state.isPlaying };
        }),
        
      setCurrentPhoto: (index: number) => 
        set({ currentPhotoIndex: index }),
        
      markAsVisited: () => 
        set({ hasVisited: true }),
    }),
    {
      name: 'birthday-storage',
    }
  )
);
