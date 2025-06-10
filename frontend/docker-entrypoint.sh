#!/bin/sh

# Reemplazar variables de entorno en la configuración de nginx
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Iniciar nginx
nginx -g 'daemon off;'