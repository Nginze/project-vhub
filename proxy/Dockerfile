FROM nginx:latest

WORKDIR /etc/nginx/templates

COPY proxy/default.conf.template /etc/nginx/templates/

COPY proxy/.ssl/api_holoverse_me_chain.crt /etc/ssl/
COPY proxy/.ssl/api_holoverse_private_key.pem /etc/ssl/