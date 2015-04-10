FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs npm supervisor && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES
ADD ./FILES /opt/soajs/FILES/
VOLUME ["/opt/soajs/log/"]
RUN cd /opt/soajs/FILES && cp supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN cd /opt/soajs/node_modules && npm install soajs.controller soajs.urac soajs.oauth soajs.dashboard soajs.examples
EXPOSE 4000 5000 4001 5001 4002 5002 4003 5003 4010 5010 4011 5011 4012 5012 4013 5013
CMD ["/usr/bin/supervisord"]