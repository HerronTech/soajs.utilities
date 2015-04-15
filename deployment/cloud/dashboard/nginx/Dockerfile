FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs nginx npm && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
ADD ./FILES /opt/soajs/FILES/
RUN cd /opt/soajs/FILES && cp ./nginx/upstream.conf /etc/nginx/conf.d/ &&  cp ./nginx/conf/*.conf /etc/nginx/sites-enabled/
RUN cd /opt/soajs/node_modules && npm install soajs.dashboard
EXPOSE 80
CMD service nginx start