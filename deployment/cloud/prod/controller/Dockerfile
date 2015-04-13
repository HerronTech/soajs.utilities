FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs npm supervisor haproxy && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES && touch /opt/soajs/log/haproxy_errors_400.http && touch /opt/soajs/log/haproxy_errors_403.http && touch /opt/soajs/log/haproxy_errors_408.http && touch /opt/soajs/log/haproxy_errors_500.http && touch /opt/soajs/log/haproxy_errors_502.http && touch /opt/soajs/log/haproxy_errors_503.http && touch /opt/soajs/log/haproxy_errors_504.http && chmod 777 -R /opt/soajs/log
ADD ./FILES /opt/soajs/FILES/
VOLUME ["/opt/soajs/log/"]
RUN cd /opt/soajs/FILES && cp supervisord.conf /etc/supervisor/conf.d/supervisord.conf && cp haproxy.conf /etc/haproxy/haproxy.conf
RUN cd /opt/soajs/node_modules && npm install soajs.controller
EXPOSE 4000 5000
CMD ["/usr/bin/supervisord"]