var http = require("http"),
    io = require('socket.io'),
    path = require("path"),
    fs = require("fs"),
    mime = require('mime-types'),
    url = require("url");

var MinnowServer = (function () {

    /**
     *
     * @param response
     */
    var send404 = function(response) {
        var pathname = config.notfound;
        var ext = path.extname(pathname);
        var content = fs.readFileSync(config.webroot + pathname);
        var contentType = mime.lookup(ext);

        response.writeHead(200, {"Content-Type": contentType});
        response.end(content, 'utf-8');
    }
    /**
     *
     * @param request
     * @param response
     */
    var staticHandler = function (request, response) {

        try {
            var pathname = url.parse(request.url).pathname;
            var ext = path.extname(pathname);
            var content = fs.readFileSync(config.webroot + pathname);
            var contentType = mime.lookup(ext);

            response.writeHead(200, {"Content-Type": contentType});
            response.end(content, 'utf-8');

        } catch (err) {
            throw {name: "StaticHandlerError", message: err};
        }
    }

    return {
        start: function (webport, route, handler, channels) {
            function onRequest(request, response) {
                var pathname = url.parse(request.url).pathname;
                var ext = path.extname(pathname);
                if (ext == null || ext === undefined || ext.length == 0) {
                    route(handler, pathname, request, response);
                }
                else {
                    console.log(' this is a static route ' + pathname);
                    try {
                        staticHandler(request, response);
                    } catch (err) {
                        console.log('static error:' + err.name + '...' + err.message);
                        send404(response);
                    }
                }
            }


            var minnow = http.createServer(onRequest);
            minnow.listen(webport);
            console.log("Http Server Listening on " + webport);

            var listener = io.listen(minnow);
            for (var channel in channels) {
                listener.of(channel, channels[channel])
                console.log("channel ready for " + channel + " events");
            }
        }
    }

})();

module.exports = MinnowServer;
