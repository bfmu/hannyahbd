# 🎯 Guía Rápida de Personalización

## ⚡ Pasos Esenciales (5 minutos)

### 1. 📅 Configurar Fecha del Cumpleaños
Archivo: `src/data/sampleData.ts`

```javascript
birthdayDate: new Date(2024, 11, 25, 0, 0) // Año, mes (0-11), día, hora, minuto
```

**¡IMPORTANTE!** Los meses van de 0-11:
- Enero = 0
- Febrero = 1  
- Marzo = 2
- ...
- Diciembre = 11

### 2. 💌 Escribir tu Mensaje Personal
En el mismo archivo, edita:

```javascript
export const loveLetterContent = `
Mi querida [Nombre],

Escribe aquí tu mensaje desde el corazón...
Cada párrafo debe estar separado por una línea vacía.

Con amor,
[Tu nombre]
`;
```

### 3. 📸 Subir tus Fotos
1. Guarda tus fotos en: `public/assets/photos/`
2. Actualiza el array `samplePhotos`:

```javascript
export const samplePhotos = [
  {
    src: '/assets/photos/foto1.jpg',
    alt: 'Nuestra primera cita',
    caption: 'El día que cambió nuestras vidas 💕'
  },
  // Agrega más fotos...
];
```

### 4. ✏️ Personalizar Nombres
```javascript
recipientName: "Hannya Andrea Correa Parra",
senderName: "Bryan Felipe Muñoz Molina",
```

## 🔧 Configuración Avanzada (Opcional)

### 🎵 Música
- Sube tu archivo MP3 a: `public/assets/music/happy-birthday.mp3`
- Debe ser menor a 5MB para mejor rendimiento

### 📧 Notificaciones Telegram
1. Busca @BotFather en Telegram
2. Envía `/newbot` y sigue las instrucciones
3. Copia el token y tu chat ID

### ✉️ Notificaciones Email
1. Registrate en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio y template
3. Copia las credenciales

## 🚀 Comandos Básicos

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Ver en: http://localhost:3000

# Para producción
npm run build
npm start
```

## 🌟 Tips Importantes

1. **Probar primero**: Cambia la fecha a hoy para probar todo
2. **Fotos optimizadas**: Máximo 1MB cada una
3. **Mensaje personal**: Es lo más importante, escribe con el corazón
4. **Backup**: Guarda una copia de tus cambios

## 🎁 ¡Listo para Sorprender!

Una vez configurado, simplemente comparte el enlace de tu web el día del cumpleaños. ¡La magia sucederá automáticamente! ✨
