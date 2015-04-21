'use strict';

module.exports = {
    "dataFolder": "/opt/soajs/node_modules/soajs.utilities/data/",
    "imagesFolder": "/opt/soajs/node_modules/soajs.utilities/deployment/",
    "repositoryPrefix": "soajsorg/",
    "port": {"maintenanceInc" : 1000},
    "dockerfile_tpl": {
        "from": 'FROM soajsorg/soajs',
        "maintainer": 'MAINTAINER SOAJS Team <team@soajs.com>',
        "body": [
            'ADD ./FILES /opt/soajs/FILES/',
            'RUN cd /opt/soajs/FILES && mv ./#SERVICEFOLDERNAME# /opt/soajs/node_modules/',
            'ENV SOAJS_ENV="dev" SOAJS_PRJ="default/" SOAJS_REGDIR="/opt/soajs/FILES/"',
            'EXPOSE #SERVICEPORT#',
            'CMD ["node /opt/soajs/node_modules/#SERVICEFOLDERNAME#/index.js"]']
    },
    "soajs_dockerfile_tpl" : {
        "from": 'FROM ubuntu:14.04',
        "maintainer": 'MAINTAINER SOAJS Team <team@soajs.com>',
        "body": ['RUN apt-get update && apt-get install -y nodejs npm && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES && mkdir /opt/node_modules',
            'ADD ./FILES /opt/soajs/FILES/',
            'RUN cd /opt/soajs/FILES && mv ./#SERVICEFOLDERNAME# /opt/soajs/node_modules/',
            'RUN cd /opt/node_modules && npm install async bcrypt body-parser bunyan bunyan-prettystream connect cookie-parser express express-session jsonschema lodash method-override moment mongoskin morgan netmask nodemailer nodemailer-direct-transport nodemailer-sendmail-transport nodemailer-smtp-transport oauth2-server request swig useragent validator',
            'ENV SOAJS_ENV="dev" SOAJS_PRJ="default/" SOAJS_REGDIR="/opt/soajs/FILES/"',
            'CMD ["/bin/bash"]']
    }
};

