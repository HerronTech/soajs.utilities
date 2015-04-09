FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs npm mongodb nginx supervisor && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/allinone
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
ADD ./* /opt/soajs/allinone/
RUN cd /opt/soajs/allinone && cat ./hosts >> /etc/hosts && cp ./nginx/upstream.conf /etc/nginx/conf.d/ &&  cp ./nginx/conf/*.conf /etc/nginx/sites-enabled/ && cp supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN cd /opt/soajs/node_modules && npm install soajs.controller soajs.urac soajs.oauth soajs.dashboard soajs.examples
EXPOSE 80 5000 5001 5002 5003 5010 5011 5012 5013
CMD ["/usr/bin/supervisord"]