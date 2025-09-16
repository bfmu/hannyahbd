#!/bin/bash

echo "🎂 Construyendo imagen Docker para 'Feliz Cumpleanos Mi Nina'..."
echo

# Construir la imagen
docker build -t feliz-cumpleanos-mi-nina .

echo
echo "✅ Imagen construida exitosamente!"
echo
echo "📋 Para ejecutar el contenedor:"
echo "   docker run -p 3000:3000 feliz-cumpleanos-mi-nina"
echo
echo "📋 O usar docker-compose:"
echo "   docker-compose up -d"
echo
