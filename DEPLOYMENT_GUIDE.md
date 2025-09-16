# 🎂 Guía de Deployment con Docker

## 🚀 Despliegue Rápido

### Opción 1: Docker Compose (Recomendado)
```bash
# Construir y ejecutar
docker-compose up --build -d

# Ver en: http://localhost:3000
```

### Opción 2: Docker Manual
```bash
# 1. Construir imagen
docker build -t feliz-cumpleanos-mi-nina .

# 2. Ejecutar contenedor
docker run -p 3000:3000 -d --name mi-web-cumpleanos feliz-cumpleanos-mi-nina
```

### Opción 3: Scripts Automáticos
**Windows:**
```cmd
.\build-docker.bat
```

**Linux/Mac:**
```bash
chmod +x build-docker.sh
./build-docker.sh
```

## 📋 Comandos Útiles

### Gestión del Contenedor
```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs
docker logs feliz-cumpleanos-mi-nina

# Detener contenedor
docker stop feliz-cumpleanos-mi-nina

# Reiniciar contenedor
docker restart feliz-cumpleanos-mi-nina

# Eliminar contenedor
docker rm feliz-cumpleanos-mi-nina
```

### Con Docker Compose
```bash
# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs

# Detener servicios
docker-compose down

# Reconstruir imagen
docker-compose up --build
```

## 🌐 Deployment en Producción

### 1. VPS/Servidor Cloud
1. **Sube los archivos** al servidor
2. **Ejecuta docker-compose**:
   ```bash
   docker-compose up -d
   ```
3. **Configura proxy reverso** (Nginx/Apache):
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### 2. Docker Hub
```bash
# Tag de la imagen
docker tag feliz-cumpleanos-mi-nina tu-usuario/feliz-cumpleanos-mi-nina:latest

# Subir a Docker Hub
docker push tu-usuario/feliz-cumpleanos-mi-nina:latest
```

### 3. Plataformas Cloud
- **Railway**: Conectar GitHub → Deploy automático
- **DigitalOcean App Platform**: Desde Docker Hub
- **AWS ECS/Fargate**: Contenedor administrado
- **Google Cloud Run**: Serverless containers

## 🔧 Variables de Entorno

Crear archivo `.env.local` (no incluido en Docker por seguridad):
```env
# Si usas notificaciones
TELEGRAM_BOT_TOKEN=tu_token_aqui
EMAILJS_SERVICE_ID=tu_service_id
```

Para usarlas en Docker:
```bash
docker run -p 3000:3000 --env-file .env.local feliz-cumpleanos-mi-nina
```

## 🎯 URLs Después del Deployment

- **Local**: http://localhost:3000
- **VPS**: http://tu-ip-servidor:3000
- **Con dominio**: http://tu-dominio.com

## 🛡️ Seguridad

1. **Cambiar puerto por defecto**:
   ```bash
   docker run -p 8080:3000 feliz-cumpleanos-mi-nina
   ```

2. **Usar HTTPS** con Let's Encrypt (Certbot)

3. **Firewall**: Solo permitir puertos necesarios

## 🔄 Actualizaciones

Para actualizar la web:
```bash
# 1. Detener contenedor actual
docker-compose down

# 2. Hacer cambios al código

# 3. Reconstruir y ejecutar
docker-compose up --build -d
```

## 📊 Monitoreo

Ver uso de recursos:
```bash
docker stats feliz-cumpleanos-mi-nina
```

## 🆘 Solución de Problemas

### Error: Puerto ocupado
```bash
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Usar otro puerto
docker run -p 8080:3000 feliz-cumpleanos-mi-nina
```

### Error: Imagen no encontrada
```bash
# Verificar imágenes disponibles
docker images

# Reconstruir imagen
docker build -t feliz-cumpleanos-mi-nina . --no-cache
```

### Logs para debugging
```bash
# Ver logs detallados
docker logs --follow feliz-cumpleanos-mi-nina
```

## 💡 Tips

1. **Optimización**: La imagen usa multi-stage build para ser más pequeña
2. **Seguridad**: Ejecuta como usuario no-root (nextjs)
3. **Performance**: Configurado para producción
4. **Escalabilidad**: Fácil de replicar en múltiples contenedores

¡Tu web de cumpleaños estará lista para el mundo! 🎉✨
