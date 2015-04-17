'use strict';

module.exports = {
    "dataFolder": "/opt/soajs/node_modules/soajs.utilities/data/",
    "imagesFolder": "/opt/soajs/node_modules/soajs.utilities/deployment/",
    "repositoryPrefix": "soajsorg/",
    "dockerfile_tpl": {
        "from": 'FROM ubuntu:14.04',
        "maintainer": 'MAINTAINER SOAJS Team <team@soajs.com>',
        "body": ['RUN apt-get update && apt-get install -y nodejs npm && ln -s /usr/bin/nodejs /usr/bin/node && mkdir -p /opt/soajs/node_modules && mkdir -p /opt/soajs/log && mkdir -p /opt/soajs/FILES',
            'ADD ./FILES /opt/soajs/FILES/',
            'VOLUME ["/opt/soajs/log/"]',
            'RUN cd /opt/soajs/FILES && mv ./#SERVICEFOLDERNAME# /opt/soajs/node_modules/',
            'RUN cd /opt/soajs/node_modules && npm install soajs',
            'EXPOSE #SERVICEPORT#',
            'CMD ["node", "/opt/soajs/node_modules/#SERVICEFOLDERNAME#/index.js"]']
    }
};
