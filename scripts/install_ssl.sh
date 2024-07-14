#!/bin/bash

# Define the path to the SSL certificate files
SSL_CERT_PATH="/etc/ssl"
SSL_CERT_FILE="${SSL_CERT_PATH}/api_holoverse_me_chain.crt"
SSL_KEY_FILE="${SSL_CERT_PATH}/api_holoverse_private_key.pem"

# Define the path to the Nginx configuration file
NGINX_CONF_PATH="proxy"
NGINX_CONF_FILE="${NGINX_CONF_PATH}/default.conf.template"

# Define the server name
SERVER_NAME="api.holoverse.me"

# Add the server block for HTTPS
echo "server {
    listen 443 ssl;
    server_name ${SERVER_NAME};

    ssl_certificate ${SSL_CERT_FILE};
    ssl_certificate_key ${SSL_KEY_FILE};

    location / {
        proxy_pass http://${SERVER_HOST}:${SERVER_PORT}; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}" >> ${NGINX_CONF_FILE}

# Add the server block for HTTP to HTTPS redirect
echo "server {
    listen 80;
    server_name ${SERVER_NAME};
    return 301 https://\$server_name\$request_uri;
}" >> ${NGINX_CONF_FILE}