'use strict';

var http = require('http'),
    io = require('socket.io'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime-types'),
    url = require('url'),
    log = require('winston');


const webport = 3000,
    webroot = './html',
    content404 = fs.readFileSync(`${webroot}/notfound.html`);


class MinnowServer {

    constructor(route, handler, channels) {


        this.minnow = http.createServer(function onRequest(request, response) {
            let pathname = url.parse(request.url).pathname,
                ext = path.extname(pathname);


            if (ext == null || ext === undefined || ext.length == 0) {
                try {
                    route(handler, pathname, request, response);
                } catch  (err) {
                    log.info(err.message);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(content404, 'utf-8');
                }

            } else {
                log.info(`this is a static route ${pathname} `);
                try {
                    let pathname = url.parse(request.url).pathname,
                        ext = path.extname(pathname),
                        content = fs.readFileSync(`${webroot}${pathname}`),
                        contentType = mime.lookup(ext);

                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                } catch (err) {
                    log.info(`static error:${err.name} ${err.message}`);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(content404, 'utf-8');
                }
            }


        });
        this.minnow.listen(webport);
        this.minnow.on('listening', function () {
            log.info(`Http Server is Listening on port ${webport}`);
        });

        this.listener = io.listen(this.minnow);
        for (let channel in channels) {
            this.listener.of(channel, channels[channel]);
            log.info(`channel ready for ${channel} events`);
        }
    }
}

module.exports = MinnowServer;
