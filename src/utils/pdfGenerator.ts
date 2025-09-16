import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  filename?: string;
  quality?: number;
  width?: number;
  height?: number;
}

/**
 * Genera un PDF desde un elemento HTML
 */
export const generatePDFFromElement = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'carta-de-cumpleanos.pdf',
    quality = 1,
    width = 210, // A4 width in mm
    height = 297 // A4 height in mm
  } = options;

  try {
    // Configurar opciones para html2canvas
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Crear PDF
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Calcular dimensiones para mantener la proporción
    const imgWidth = width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Si la imagen es más alta que una página, ajustar
    if (imgHeight > height) {
      const ratio = height / imgHeight;
      const adjustedWidth = imgWidth * ratio;
      const adjustedHeight = height;
      const x = (width - adjustedWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', x, 0, adjustedWidth, adjustedHeight);
    } else {
      const y = (height - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
    }

    // Descargar el PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw new Error('No se pudo generar el PDF');
  }
};

/**
 * Carga una imagen y la convierte a base64 con sus dimensiones originales
 */
const loadImageAsBase64 = (src: string): Promise<{dataURL: string, width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve({
          dataURL,
          width: img.width,
          height: img.height
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
    img.src = src;
  });
};

/**
 * Genera un PDF completo con la carta y las fotos
 */
export const generateCompleteBirthdayPDF = async (
  title: string,
  content: string,
  authorName: string,
  photos: Array<{src: string, alt: string, caption?: string}>,
  filename: string = 'feliz-cumpleanos-especial.pdf'
): Promise<void> => {
  try {
    console.log('🎁 Generando PDF completo con carta y fotos...');
    
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;
    
    // === PÁGINA 1: PORTADA ===
    pdf.setFillColor(255, 192, 203); // Rosa suave
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Título principal
    pdf.setTextColor(139, 0, 139); // Violeta oscuro
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    const titleY = pageHeight / 3;
    pdf.text(title, pageWidth / 2, titleY, { align: 'center' });
    
    // Decoración
    pdf.setFontSize(40);
    pdf.text('🎉', pageWidth / 2 - 20, titleY - 20, { align: 'center' });
    pdf.text('🎂', pageWidth / 2 + 20, titleY - 20, { align: 'center' });
    pdf.text('💕', pageWidth / 2, titleY + 20, { align: 'center' });
    
    // Fecha
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'italic');
    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`${today}`, pageWidth / 2, titleY + 40, { align: 'center' });
    
    // === PÁGINA 2: CARTA ===
    pdf.addPage();
    pdf.setFillColor(255, 255, 255); // Fondo blanco
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    currentY = margin + 10;
    
    // Título de la carta
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('💌 Tu Carta Especial', pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;
    
    // Contenido de la carta
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    paragraphs.forEach((paragraph) => {
      const lines = pdf.splitTextToSize(paragraph, contentWidth);
      
      // Verificar si necesitamos una nueva página
      if (currentY + (lines.length * 7) > pageHeight - margin - 20) {
        pdf.addPage();
        currentY = margin + 10;
      }
      
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 7 + 8;
    });
    
    // Firma
    currentY += 10;
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = margin + 20;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'italic');
    pdf.text(authorName, pageWidth - margin, currentY, { align: 'right' });
    
    // === PÁGINAS DE FOTOS ===
    for (let i = 0; i < Math.min(photos.length, 5); i++) { // Máximo 5 fotos
      const photo = photos[i];
      
      try {
        console.log(`📸 Cargando foto ${i + 1}: ${photo.src}`);
        
        pdf.addPage();
        currentY = margin;
        
        // Título de la foto
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(139, 0, 139);
        pdf.text(`Recuerdo ${i + 1}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 20;
        
        // Cargar imagen con dimensiones originales
        const imageData = await loadImageAsBase64(photo.src);
        
        // Calcular dimensiones manteniendo proporción original
        const maxImageWidth = contentWidth - 20;
        const maxImageHeight = 140;
        
        // Calcular aspect ratio
        const aspectRatio = imageData.width / imageData.height;
        
        let finalWidth, finalHeight, imageX, imageY = currentY;
        
        if (aspectRatio > maxImageWidth / maxImageHeight) {
          // Imagen más ancha - ajustar por ancho
          finalWidth = maxImageWidth;
          finalHeight = maxImageWidth / aspectRatio;
        } else {
          // Imagen más alta - ajustar por altura
          finalHeight = maxImageHeight;
          finalWidth = maxImageHeight * aspectRatio;
        }
        
        // Centrar la imagen horizontalmente
        imageX = margin + 10 + (maxImageWidth - finalWidth) / 2;
        
        pdf.addImage(imageData.dataURL, 'JPEG', imageX, imageY, finalWidth, finalHeight);
        currentY += Math.max(finalHeight, maxImageHeight) + 15;
        
        // Caption de la foto
        if (photo.caption) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(60, 60, 60);
          
          const captionLines = pdf.splitTextToSize(photo.caption, contentWidth);
          pdf.text(captionLines, margin, currentY);
          currentY += captionLines.length * 6;
        }
        
        console.log(`✅ Foto ${i + 1} agregada al PDF`);
        
      } catch (error) {
        console.warn(`⚠️ No se pudo cargar la foto ${i + 1}:`, error);
        
        // Agregar placeholder si la foto no carga
        const placeholderWidth = contentWidth - 20;
        const placeholderHeight = 100;
        const placeholderX = margin + 10;
        
        pdf.setFillColor(240, 240, 240);
        pdf.rect(placeholderX, currentY, placeholderWidth, placeholderHeight, 'F');
        
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(12);
        pdf.text('📷 Imagen no disponible', pageWidth / 2, currentY + placeholderHeight / 2, { align: 'center' });
        currentY += placeholderHeight + 15;
        
        if (photo.caption) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(60, 60, 60);
          
          const captionLines = pdf.splitTextToSize(photo.caption, contentWidth);
          pdf.text(captionLines, margin, currentY);
        }
      }
    }
    
    console.log('💾 Guardando PDF...');
    pdf.save(filename);
    console.log('🎉 PDF generado exitosamente');
    
  } catch (error) {
    console.error('❌ Error generando PDF completo:', error);
    throw new Error('No se pudo generar el PDF completo');
  }
};

/**
 * Genera un PDF personalizado con el contenido de la carta (versión simple)
 */
export const generateLoveLetterPDF = (
  title: string,
  content: string,
  authorName: string,
  filename: string = 'mi-carta-de-amor.pdf'
): void => {
  try {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Configuración de márgenes y dimensiones
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin + 10;
    
    // Título
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(title, contentWidth);
    pdf.text(titleLines, margin, currentY);
    currentY += titleLines.length * 12 + 20;
    
    // Decoración
    pdf.setFontSize(16);
    pdf.text('💕 ✨ 💕', pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;
    
    // Contenido
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Dividir contenido en párrafos
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    paragraphs.forEach((paragraph) => {
      const lines = pdf.splitTextToSize(paragraph, contentWidth);
      
      // Verificar si necesitamos una nueva página
      if (currentY + (lines.length * 7) > pageHeight - margin) {
        pdf.addPage();
        currentY = margin + 10;
      }
      
      pdf.text(lines, margin, currentY);
      currentY += lines.length * 7 + 10;
    });
    
    // Firma
    currentY += 20;
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = margin + 30;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'italic');
    pdf.text(authorName, pageWidth - margin, currentY, { align: 'right' });
    
    // Decoración final
    currentY += 15;
    pdf.setFontSize(12);
    pdf.text('💕 Con todo mi amor 💕', pageWidth / 2, currentY, { align: 'center' });
    
    // Fecha
    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.setFontSize(10);
    pdf.text(today, pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Descargar
    pdf.save(filename);
  } catch (error) {
    console.error('Error generando PDF personalizado:', error);
    throw new Error('No se pudo generar el PDF');
  }
};
