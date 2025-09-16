import emailjs from '@emailjs/browser';

export interface NotificationConfig {
  telegram?: {
    botToken: string;
    chatId: string;
  };
  email?: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
}

/**
 * Envía notificación por Telegram
 */
export const sendTelegramNotification = async (
  message: string,
  config: NotificationConfig['telegram']
): Promise<boolean> => {
  if (!config?.botToken || !config?.chatId) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    
    if (response.ok && result.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Envía notificación por email usando EmailJS
 */
export const sendEmailNotification = async (
  templateParams: Record<string, string | number>,
  config: NotificationConfig['email']
): Promise<boolean> => {
  if (!config?.serviceId || !config?.templateId || !config?.publicKey) {
    return false;
  }

  try {
    await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams,
      config.publicKey
    );
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Notifica cuando alguien visita la página
 */
export const notifyPageVisit = async (
  config: NotificationConfig,
  trackingData?: {
    ip: string;
    country?: string;
    city?: string;
    region?: string;
    device: string;
    os: string;
    browser: string;
    timezone: string;
  },
  visitInfo?: {
    visitCount: number;
    lastVisit: Date | null;
    isFirstVisit: boolean;
  }
): Promise<void> => {
  const timestamp = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City'
  });

  const promises: Promise<boolean>[] = [];

  // Telegram notification
  if (config.telegram) {
    // Determinar si es primera visita o reincidente
    const isFirstVisit = visitInfo?.isFirstVisit ?? true;
    const visitCount = visitInfo?.visitCount ?? 1;
    const lastVisit = visitInfo?.lastVisit;

    let telegramMessage = isFirstVisit 
      ? `🎉 <b>¡Primera visita a la página!</b> 🎂\n\n` +
        `🌟 ¡Alguien ha descubierto la página de cumpleaños!\n\n`
      : `🔄 <b>¡Visita #${visitCount} a la página!</b> 🎂\n\n` +
        `👀 El mismo visitante ha regresado\n\n`;

    telegramMessage += `📅 Fecha y hora: ${timestamp}\n\n`;

    // Información del contador de visitas
    if (visitInfo && !isFirstVisit && lastVisit) {
      const timeDiff = Math.abs(new Date().getTime() - lastVisit.getTime());
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeString = '';
      if (hoursDiff > 0) {
        timeString = `${hoursDiff}h ${minutesDiff}m`;
      } else {
        timeString = `${minutesDiff} minutos`;
      }

      telegramMessage += `📊 <b>Contador de visitas:</b>\n` +
        `• Total de visitas: <b>${visitCount}</b>\n` +
        `• Última visita: hace ${timeString}\n\n`;
    }

    // Agregar información de tracking si está disponible
    if (trackingData) {
      telegramMessage += `📍 <b>Información del visitante:</b>\n\n` +
        `🌍 <b>Ubicación:</b>\n` +
        `• IP: <code>${trackingData.ip}</code>\n` +
        `• País: ${trackingData.country}\n` +
        `• Ciudad: ${trackingData.city}, ${trackingData.region}\n\n` +
        `📱 <b>Dispositivo:</b>\n` +
        `• Tipo: ${trackingData.device}\n` +
        `• SO: ${trackingData.os}\n` +
        `• Navegador: ${trackingData.browser}\n\n` +
        `⏰ <b>Zona horaria:</b> ${trackingData.timezone}\n\n`;
    }

    telegramMessage += isFirstVisit 
      ? `¡La página está siendo visitada por primera vez! ✨`
      : `¡Visitante recurrente detectado! 🔄`;

    promises.push(sendTelegramNotification(telegramMessage, config.telegram));
  }

  // Ejecutar todas las notificaciones
  try {
    const results = await Promise.allSettled(promises);
  } catch (error) {
    // Error manejado silenciosamente
  }
};

/**
 * Envía notificaciones cuando se abre la carta
 */
export const notifyLetterOpened = async (
  recipientName: string,
  config: NotificationConfig,
  trackingData?: {
    ip: string;
    country?: string;
    city?: string;
    region?: string;
    device: string;
    os: string;
    browser: string;
    timezone: string;
  }
): Promise<void> => {
  const timestamp = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City'
  });

  const promises: Promise<boolean>[] = [];

  // Telegram notification
  if (config.telegram) {
    let telegramMessage = `🎉 <b>¡Carta de cumpleaños abierta!</b> 🎂\n\n` +
      `💕 ${recipientName} acaba de abrir su carta especial\n\n` +
      `📅 Fecha y hora: ${timestamp}\n\n`;
    
    // Agregar información de tracking si está disponible
    if (trackingData) {
      telegramMessage += `📍 <b>Información de acceso:</b>\n\n` +
        `🌍 <b>Ubicación:</b>\n` +
        `• IP: <code>${trackingData.ip}</code>\n` +
        `• País: ${trackingData.country}\n` +
        `• Ciudad: ${trackingData.city}, ${trackingData.region}\n\n` +
        `📱 <b>Dispositivo:</b>\n` +
        `• Tipo: ${trackingData.device}\n` +
        `• SO: ${trackingData.os}\n` +
        `• Navegador: ${trackingData.browser}\n\n` +
        `⏰ <b>Zona horaria:</b> ${trackingData.timezone}\n\n`;
    }
    
    telegramMessage += `¡La sorpresa ha sido revelada! ✨`;
    
    promises.push(sendTelegramNotification(telegramMessage, config.telegram));
  }


  // Ejecutar todas las notificaciones
  try {
    const results = await Promise.allSettled(promises);
  } catch (error) {
    // Error manejado silenciosamente
  }
};

/**
 * Configuración de ejemplo para EmailJS template
 * 
 * Template HTML sugerido:
 * 
 * <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
 *   <div style="text-align: center; margin-bottom: 30px;">
 *     <h1 style="color: #e91e63;">🎉 ¡Carta de Cumpleaños Abierta! 🎂</h1>
 *   </div>
 *   
 *   <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
 *     <p style="margin: 0; font-size: 16px; line-height: 1.5;">
 *       Hola {{to_name}},
 *     </p>
 *     <br>
 *     <p style="margin: 0; font-size: 16px; line-height: 1.5;">
 *       ¡Tenemos buenas noticias! 💕
 *     </p>
 *     <br>
 *     <p style="margin: 0; font-size: 16px; line-height: 1.5; font-weight: bold; color: #e91e63;">
 *       {{recipient_name}} acaba de abrir su carta de cumpleaños especial
 *     </p>
 *     <br>
 *     <p style="margin: 0; font-size: 14px; color: #666;">
 *       Fecha y hora: {{opened_at}}
 *     </p>
 *   </div>
 *   
 *   <div style="text-align: center; margin-top: 30px;">
 *     <p style="color: #666; font-size: 14px;">
 *       ¡La sorpresa ha sido revelada! ✨
 *     </p>
 *   </div>
 * </div>
 */
