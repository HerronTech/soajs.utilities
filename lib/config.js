'use strict';

module.exports = {
    "dataFolder": "/opt/soajs/node_modules/soajs.utilities/data/",
    "imagesFolder": "/opt/soajs/node_modules/soajs.utilities/deployment/",
    "repositoryPrefix": "soajsorg/",
    "port": {"maintenanceInc": 1000},
    "dockerfile_tpl": {
        "from": 'FROM soajsorg/soajs',
        "maintainer": 'MAINTAINER SOAJS Team <team@soajs.com>',
        "body": [
            'ADD ./FILES /opt/soajs/FILES/',
            'RUN cd /opt/soajs/FILES && mv ./#SERVICEFOLDERNAME# /opt/soajs/node_modules/',
            'EXPOSE #SERVICEPORT#',
            'WORKDIR /opt/soajs/node_modules/#SERVICEFOLDERNAME#/',
            'CMD ["node", "."]']
    },
    "soajs_dockerfile_tpl": {
        "from": 'FROM ubuntu:14.04',
        //"from": 'FROM node:0.10-onbuild',
        "maintainer": 'MAINTAINER SOAJS Team <team@soajs.com>',
        "body": [
            'RUN apt-get update && apt-get install -y nodejs npm supervisor && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/FILES && mkdir /opt/node_modules',
            //'RUN mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES && mkdir /opt/node_modules',
            //'RUN apt-get update && apt-get install -y nodejs npm && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/FILES && mkdir /opt/node_modules',
            'RUN cd /opt/node_modules && npm install async bcrypt body-parser bunyan bunyan-prettystream connect cookie-parser express express-session jsonschema lodash method-override moment mongoskin morgan netmask nodemailer nodemailer-direct-transport nodemailer-sendmail-transport nodemailer-smtp-transport oauth2-server request swig useragent validator',
            'ADD ./FILES /opt/soajs/FILES/',
            'RUN cd /opt/soajs/FILES && mv ./#SERVICEFOLDERNAME# /opt/soajs/node_modules/',
            'ENV SOAJS_ENV="dev" SOAJS_REGDIR="/opt/soajs/FILES/"',
            'CMD ["/bin/bash"]']
    },
    "supervisor_service_tpl": {
        //"from": 'FROM ubuntu:14.04',
        "from": 'FROM soajsorg/soajs',
        "maintainer": 'MAINTAINER SOAJS Team <team@soajs.com>',
        "body": [
            //'RUN apt-get update && apt-get install -y nodejs npm supervisor && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/FILES',
            'ADD ./FILES /opt/soajs/FILES/',
            'RUN cd /opt/soajs/FILES && cp supervisord.conf /etc/supervisor/conf.d/supervisord.conf && mv ./#SERVICEFOLDERNAME# /opt/soajs/node_modules/',
            'ENV SOAJS_ENV="dev" SOAJS_REGDIR="/opt/soajs/FILES/"',
            'EXPOSE #SERVICEPORT#',
            'CMD ["/usr/bin/supervisord"]']
    },
    "supervisor_file_tpl": {
        "body": [
            '[supervisord]',
            'nodaemon=true',
            '[program:#SERVICEFOLDERNAME#]',
            'command=/usr/bin/node /opt/soajs/node_modules/#SERVICEFOLDERNAME#/index.js',
            'autostart=true',
            'autorestart=true',
            'stderr_logfile=/dev/stderr',
            'stderr_logfile_maxbytes=0',
            'stdout_logfile=/dev/stdout',
            'stdout_logfile_maxbytes=0']
    }
};

