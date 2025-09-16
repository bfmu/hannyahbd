import { 
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes, 
  differenceInSeconds, 
  isAfter 
} from 'date-fns';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Calcula el tiempo restante hasta una fecha específica
 */
export const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
  const now = new Date();
  
  if (isAfter(now, targetDate)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }
  
  const totalSeconds = differenceInSeconds(targetDate, now);
  const totalMinutes = differenceInMinutes(targetDate, now);
  const totalHours = differenceInHours(targetDate, now);
  const totalDays = differenceInDays(targetDate, now);
  
  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  
  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Formatea la fecha para mostrar de manera bonita
 */
export const formatBirthdayDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * Verifica si hoy es el día del cumpleaños
 */
export const isBirthdayToday = (birthdayDate: Date): boolean => {
  const now = new Date();
  return now >= birthdayDate;
};
