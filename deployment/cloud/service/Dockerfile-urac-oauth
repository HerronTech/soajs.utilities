FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs npm supervisor && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES
ADD ./FILES /opt/soajs/FILES/
RUN cd /opt/soajs/FILES && cp urac_oauth/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN cd /opt/soajs/node_modules && npm install soajs.urac soajs.oauth
EXPOSE 4001 4002 5001 5002
CMD ["/usr/bin/supervisord"]