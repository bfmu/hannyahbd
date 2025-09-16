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
    console.warn('Configuración de Telegram incompleta');
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
      console.log('Notificación de Telegram enviada exitosamente');
      return true;
    } else {
      console.error('Error enviando notificación de Telegram:', result);
      return false;
    }
  } catch (error) {
    console.error('Error en notificación de Telegram:', error);
    return false;
  }
};

/**
 * Envía notificación por email usando EmailJS
 */
export const sendEmailNotification = async (
  templateParams: Record<string, any>,
  config: NotificationConfig['email']
): Promise<boolean> => {
  if (!config?.serviceId || !config?.templateId || !config?.publicKey) {
    console.warn('Configuración de email incompleta');
    return false;
  }

  try {
    await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams,
      config.publicKey
    );
    
    console.log('Email de notificación enviado exitosamente');
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};

/**
 * Envía notificaciones cuando se abre la carta
 */
export const notifyLetterOpened = async (
  recipientName: string,
  config: NotificationConfig
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
    const telegramMessage = `🎉 <b>¡Carta de cumpleaños abierta!</b> 🎂\n\n` +
      `💕 ${recipientName} acaba de abrir su carta especial\n\n` +
      `📅 Fecha y hora: ${timestamp}\n\n` +
      `¡La sorpresa ha sido revelada! ✨`;
    
    promises.push(sendTelegramNotification(telegramMessage, config.telegram));
  }

  // Email notification
  if (config.email) {
    const emailParams = {
      to_name: 'Tu nombre', // Cambiar por tu nombre
      recipient_name: recipientName,
      opened_at: timestamp,
      message: `${recipientName} ha abierto su carta de cumpleaños especial. ¡La sorpresa ha sido revelada!`
    };
    
    promises.push(sendEmailNotification(emailParams, config.email));
  }

  // Ejecutar todas las notificaciones
  try {
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`${successful}/${results.length} notificaciones enviadas exitosamente`);
  } catch (error) {
    console.error('Error en notificaciones:', error);
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
