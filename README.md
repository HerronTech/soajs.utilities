# soajs.utilities

# nginx

## Mac Users

### Nginx configuration

Add in the nginx config file: `/usr/local/etc/nginx/nginx.conf`

* the following: `include /opt/soajs/node_modules/soajs.nginx/conf/*.conf;`

### Hosts configuration

Add in the etc hosts file: `/etc/hosts`

* the following for api: `127.0.0.1 api.soajs.org`
* the following for dashboard: `127.0.0.1 dashboard.soajs.org`

