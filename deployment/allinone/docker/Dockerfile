FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs mongodb nginx upstart
RUN mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log
RUN cd /opt/soajs/node_modules && npm install soajs.controller soajs.urac soajs.oauth soajs.dashboard soajs.dashboard soajs.utilities
RUN cd /opt/soajs/node_modules/soajs.utilities/deployment/allinone && cat ./hosts >> /etc/hosts && cp ./nginx/upstream.conf /etc/nginx/conf.d/ &&  cp ./nginx/conf/*.conf /etc/nginx/sites-enabled/ && nginx -s stop && nginx && cp ./upstart/*.conf /etc/init/

