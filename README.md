# 🎉 Web de Cumpleaños Especial

Una hermosa aplicación web interactiva para celebrar el cumpleaños de alguien especial, con contador regresivo, carrusel de fotos, carta personal, música y efectos especiales.

## ✨ Características

- 🕐 **Contador regresivo** hasta la fecha del cumpleaños
- 🔐 **Sistema de desbloqueo** - el contenido se revela solo el día especial
- 📸 **Carrusel de fotos** con transiciones suaves
- 💌 **Carta digital** con animación de apertura/cierre
- 🎵 **Reproductor de música** automático
- 🎊 **Efectos de confeti** al desbloquear
- 📱 **Diseño responsive** optimizado para móvil
- 📄 **Descarga PDF** de la carta
- 📱 **Compartir WhatsApp** directo
- 📧 **Notificaciones** por Telegram/email cuando se ve la carta

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar tu información personal

Edita el archivo `src/data/sampleData.ts`:

```typescript
export const birthdayConfig = {
  // ¡IMPORTANTE! Configura la fecha del cumpleaños aquí
  birthdayDate: new Date(2024, 11, 25, 0, 0), // Año, mes (0-11), día, hora, minuto
  
  recipientName: "Tu Amor",
  senderName: "Con todo mi corazón",
  
  // Configuración de notificaciones (opcional)
  notifications: {
    telegram: {
      botToken: "TU_BOT_TOKEN", // Ver instrucciones abajo
      chatId: "TU_CHAT_ID"
    },
    email: {
      serviceId: "TU_SERVICE_ID", // EmailJS
      templateId: "TU_TEMPLATE_ID",
      publicKey: "TU_PUBLIC_KEY"
    }
  }
};
```

### 3. Agregar tus fotos

1. Sube tus fotos a `public/assets/photos/`
2. Actualiza el array `samplePhotos` en `src/data/sampleData.ts`:

```typescript
export const samplePhotos = [
  {
    src: '/assets/photos/foto1.jpg',
    alt: 'Descripción de la foto',
    caption: 'Un mensaje bonito sobre esta foto 💕'
  },
  // Agrega más fotos...
];
```

### 4. Personalizar la carta

Edita `loveLetterContent` en `src/data/sampleData.ts` con tu mensaje personal.

### 5. Agregar música (opcional)

- Coloca tu archivo de música en `public/assets/music/happy-birthday.mp3`
- O actualiza la ruta en `birthdayConfig.musicFile`

## 🎵 Configuración de Música

Para agregar tu propia música:

1. Convierte tu archivo a MP3
2. Nómbralo `happy-birthday.mp3`
3. Colócalo en `public/assets/music/`

**Formatos soportados:** MP3, WAV, OGG

## 📧 Configuración de Notificaciones

### Telegram Bot (opcional)

1. Habla con [@BotFather](https://t.me/botfather) en Telegram
2. Crea un nuevo bot con `/newbot`
3. Copia el token que te da
4. Para obtener tu chat ID:
   - Envía un mensaje a tu bot
   - Visita: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
   - Copia el `chat.id` del resultado

### EmailJS (opcional)

1. Crea cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email
3. Crea un template con estas variables:
   - `{{to_name}}` - Tu nombre
   - `{{recipient_name}}` - Nombre de quien abre la carta
   - `{{opened_at}}` - Fecha y hora
   - `{{message}}` - Mensaje automático

## 🛠️ Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar linting
npm run lint
```

## 🌐 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. La configuración es automática
3. Tu sitio estará disponible en pocos minutos

### Netlify

1. Conecta tu repositorio a [Netlify](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `.next`

## 📱 Uso

1. **Antes del cumpleaños**: Muestra el contador regresivo y un preview de lo que viene
2. **El día del cumpleaños**: Se desbloquea automáticamente todo el contenido
3. **Interacción**: La persona puede abrir la carta, ver fotos, descargar PDF y compartir
4. **Notificaciones**: Recibirás una notificación cuando abra la carta (si configuraste las notificaciones)

## 🎨 Personalización Avanzada

### Colores y Estilos

Los colores principales están en Tailwind CSS. Para cambiar el tema:

- Rosa/Púrpura: `from-pink-500 to-purple-600`
- Azul/Verde: `from-blue-500 to-green-600` 
- Dorado/Naranja: `from-yellow-500 to-orange-600`

### Animaciones

Las animaciones usan Framer Motion. Puedes ajustar:

- Velocidad: `duration: 0.8`
- Tipo: `type: "spring"`
- Retraso: `delay: 0.5`

## 🐛 Solución de Problemas

### La música no se reproduce
- Asegúrate de que el archivo existe en `public/assets/music/`
- Los navegadores modernos requieren interacción del usuario para reproducir audio
- Haz clic en el botón de música manualmente

### Las notificaciones no funcionan
- Verifica que las credenciales estén correctas
- Para Telegram, asegúrate de haber enviado al menos un mensaje al bot
- Para EmailJS, verifica que el template esté configurado correctamente

### El contador no se actualiza
- Verifica que la fecha esté en el formato correcto: `new Date(año, mes-1, día)`
- Recuerda que los meses van de 0-11 (enero=0, diciembre=11)

## 💝 Consejos para la Mejor Experiencia

1. **Prueba antes del día especial** - Cambia temporalmente la fecha para probar
2. **Optimiza las fotos** - Usa fotos de máximo 1MB para mejor rendimiento
3. **Música de fondo** - Elige una canción que tenga significado especial
4. **Mensaje personal** - Escribe desde el corazón, será lo más importante
5. **Compartir el enlace** - Envía el link justo antes de la medianoche del cumpleaños

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. ¡Úsalo libremente para crear momentos especiales!

## ❤️ Créditos

Hecho con amor usando:
- Next.js 14
- React
- Tailwind CSS
- Framer Motion
- Canvas Confetti
- jsPDF
- Howler.js

---

¡Que tengas una celebración increíble! 🎉✨