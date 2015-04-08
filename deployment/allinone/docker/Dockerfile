FROM ubuntu:14.04
MAINTAINER SOAJS Team <team@soajs.com>
RUN apt-get update && apt-get install -y nodejs mongodb nginx upstart
RUN mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/profiles && mkdir -p /opt/soajs/nginx
RUN pushd /opt/soajs/node_modules && npm install soajs.controller soajs.urac soajs.oauth soajs.dashboard soajs.dashboard soajs.utilities
RUN