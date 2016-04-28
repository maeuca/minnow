'use strict';

const webport = 3000,
    webroot = './html';

let http = require('http'),
    io = require('socket.io'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime-types'),
    url = require('url');


class MinnowServer {

    constructor(route, handler, channels) {

        this.content404 = fs.readFileSync(`${webroot}/notfound.html`);
        this.minnow = http.createServer(function onRequest(request, response) {
            let pathname = url.parse(request.url).pathname,
                ext = path.extname(pathname);


            if (ext == null || ext === undefined || ext.length == 0) {
                try {
                    route(handler, pathname, request, response);
                } catch  (err) {
                    console.log(err.message);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(this.content404, 'utf-8');
                }

            } else {
                console.log(`this is a static route ${pathname} `);
                try {
                    let pathname = url.parse(request.url).pathname,
                        ext = path.extname(pathname),
                        content = fs.readFileSync(`${webroot}${pathname}`),
                        contentType = mime.lookup(ext);

                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                } catch (err) {
                    console.log(`static error:${err.name} ${err.message}`);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(this.content404, 'utf-8');
                }
            }


        });
        this.minnow.listen(webport);
        this.minnow.on('listening', function () {
            console.log(`Http Server is Listening on port ${webport}`);
        });

        this.listener = io.listen(this.minnow);
        for (let channel in channels) {
            this.listener.of(channel, channels[channel]);
            console.log(`channel ready for ${channel} events`);
        }
    }
}

module.exports = MinnowServer;
