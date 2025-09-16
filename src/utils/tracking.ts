export interface TrackingData {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  timestamp: string;
  timezone: string;
}

/**
 * Obtiene información detallada sobre la ubicación y dispositivo del usuario
 */
export const getTrackingData = async (): Promise<TrackingData> => {
  try {
    console.log('🔍 Obteniendo información de tracking...');
    
    // 1. Obtener IP y geolocalización
    const ipResponse = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const ipData = await ipResponse.json();
    
    // 2. Analizar User Agent
    const userAgent = navigator.userAgent;
    const deviceInfo = analyzeUserAgent(userAgent);
    
    // 3. Información de tiempo
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const trackingData: TrackingData = {
      ip: ipData.ip || 'Desconocida',
      country: ipData.country_name || 'Desconocido',
      city: ipData.city || 'Desconocida',
      region: ipData.region || 'Desconocida',
      userAgent: userAgent,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      timestamp: now.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone
      }),
      timezone: timezone
    };
    
    console.log('✅ Información de tracking obtenida:', trackingData);
    return trackingData;
    
  } catch (error) {
    console.error('❌ Error obteniendo información de tracking:', error);
    
    // Fallback con información básica
    const userAgent = navigator.userAgent;
    const deviceInfo = analyzeUserAgent(userAgent);
    const now = new Date();
    
    return {
      ip: 'No disponible',
      country: 'No disponible',
      city: 'No disponible',
      region: 'No disponible',
      userAgent: userAgent,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      timestamp: now.toLocaleString('es-ES'),
      timezone: 'No disponible'
    };
  }
};

/**
 * Analiza el User Agent para extraer información del dispositivo
 */
const analyzeUserAgent = (userAgent: string) => {
  // Detectar dispositivo
  let device = 'Desktop';
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    device = 'Móvil';
    if (/iPad/i.test(userAgent)) {
      device = 'Tablet';
    }
  }
  
  // Detectar navegador
  let browser = 'Desconocido';
  if (userAgent.includes('Chrome')) {
    browser = 'Google Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Mozilla Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Microsoft Edge';
  } else if (userAgent.includes('Opera')) {
    browser = 'Opera';
  }
  
  // Detectar sistema operativo
  let os = 'Desconocido';
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }
  
  return { device, browser, os };
};


/**
 * Log silencioso del tracking (solo para debug, no guarda nada)
 */
export const logTracking = (data: TrackingData): void => {
  // Solo log para debugging, no guardar nada localmente por seguridad
  console.log('🕵️ Tracking capturado (enviado solo por Telegram):', {
    location: `${data.city}, ${data.country}`,
    device: `${data.device} - ${data.os}`,
    ip: data.ip.substring(0, 3) + '...' // IP parcialmente oculta en logs
  });
};
