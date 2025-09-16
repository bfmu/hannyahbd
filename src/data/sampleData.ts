// Datos de ejemplo para el proyecto
// Reemplaza con tus fotos reales y contenido personalizado

export const samplePhotos = [
  {
    src: '/assets/photos/2017.jpg',
    alt: 'Nuestra foto especial',
    caption: 'Esta imagen captura la felicidad genuina de estar juntos. Me encanta tu sonrisa y la forma en que me miras. Me recuerda la alegría pura y simple de nuestros primeros días. ¡Feliz cumpleaños a quien me hace sonreír!'
  },
  {
    src: '/assets/photos/2018.jpg',
    alt: 'Caminando juntos',
    caption: 'Esta foto me lleva de vuelta al principio, a cuando estábamos construyendo nuestra pequeña familia. Es un dulce recuerdo de cuánto hemos crecido juntos. Estoy muy agradecido por cada paso de nuestro viaje. ¡Feliz cumpleaños!'
  },
  {
    src: '/assets/photos/2023.jpg',
    alt: 'Atardecer romántico',
    caption: 'Al igual que las montañas en esta vista, nuestro amor es fuerte y hermoso. Me encanta aventurar contigo y crear recuerdos como este. Brindo por muchos más viajes y momentos hermosos juntos. ¡Feliz cumpleaños!'
  },
  {
    src: '/assets/photos/20231.jpg',
    alt: 'Riendo juntos',
    caption: '¡Esta foto es un brindis por ti! Estoy tan feliz de que podamos celebrarte a ti y todas las cosas increíbles que eres. Que tu día especial sea tan asombroso y brillante como este momento. ¡Feliz cumpleaños!'
  },
  {
    src: '/assets/photos/20232.jpg',
    alt: 'Momento tierno',
    caption: 'En tus brazos, siempre me siento en casa. Esta foto es un recordatorio perfecto de la comodidad y felicidad que compartimos. Que tu cumpleaños esté lleno de tanta calidez y alegría como la que tú traes a mi vida.'
  },
  {
    src: '/assets/photos/20233.jpg',
    alt: 'Momento tierno',
    caption: 'Esta foto captura perfectamente nuestro lado divertido y juguetón. Eres mi persona favorita para ser completamente yo mismo, y eso es una de las cosas que más amo de ti. ¡Feliz cumpleaños a quien siempre me hace reír!'
  },
  {
    src: '/assets/photos/2025.jpeg',
    alt: 'Momento tierno',
    caption: 'Me encanta cómo iluminas cada momento, igual que las luces en esta foto. Tienes una forma de hacer todo más brillante. ¡Feliz cumpleaños a mi persona favorita para compartir estos momentos!'
  }
];

export const loveLetterContent = `Mi amor,

¡Feliz cumpleaños! Hoy es tu día especial, y no quería dejar pasar la oportunidad de decirte lo mucho que te aprecio. Deseo de todo corazón que cumplas muchísimos años más y que Dios te siga bendiciendo con oportunidades maravillosas.

Es impresionante ver lo rápido que pasa el tiempo. Parece que fue ayer cuando nos conocimos, hace casi 10 años, en esa casa de cupos. Recuerdo a la niña traviesa que eras y cómo, año tras año, has ido madurando, convirtiéndote en la increíble persona que eres hoy.

Siempre te recordaré como esa persona tierna, dulce y suave que me llenó de paz. Admiro tu amor por los animales y tu espíritu espontáneo. Tu pasión por disfrutar la vida, bailar, cantar y el rock es contagiosa. Valoro mucho que seas tan amiguera y que mantengas a tus amigos cerca; es un reflejo de tu hermoso corazón. Tu curiosidad por conocer gente y culturas me inspira, y me siento afortunado de haber compartido tantas aventuras y momentos inolvidables contigo, como los que capturamos en cada una de esas fotos.

Hoy celebro tu vida y la persona extraordinaria que eres. Que este nuevo año esté lleno de alegría, éxitos y que todos tus sueños se hagan realidad. Siempre estaré aquí para ti, celebrando tus logros y apoyándote en todo lo que necesites.

¡Feliz cumpleaños! Siempre te llevaré en mi corazón.`;

export const birthdayConfig = {
  // Configura aquí la fecha del cumpleaños
  // Formato: año, mes (0-11), día, hora, minuto
  birthdayDate: new Date(2025, 8, 16, 0, 0), // 25 de diciembre de 2024 a las 00:00
  
  // Nombres y títulos personalizables
  recipientName: "Hannya Andrea Correa Parra",
  senderName: "Bryan Felipe Muñoz Molina",
  
  // Configuración de música
  musicFile: "/assets/music/happy-birthday.mp3",
  
  // Configuración de notificaciones
  notifications: {
    telegram: {
      botToken: "8390195406:AAGht-cAEM1d-Bm8Dx5ApeCvXfGzrnijyLV", // Tu bot token de Telegram
      chatId: "1127694552" // Tu chat ID
    }
  }
};
