FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs npm && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules
ENV SOAJS_ENV="dev" SOAJS_PRJ="default/" SOAJS_REGDIR="/opt/soajs/FILES/"
RUN cd /opt/soajs/node_modules && npm install soajs.controller
EXPOSE 4000 5000
'CMD ["node", "/opt/soajs/node_modules/soajs.controller/index.js"]']