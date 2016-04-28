'use strict';
try {
    require('look').start();//http://[yourhost]:5959
} catch (e) {
    console.log('performance monitor failed to start');
}

var log = require('winston'),
    httpHandler = require('./demo/HttpHandler'),
    eventHandler = require('./demo/EventHandler'),
    requestRouter = require('./RequestRouter'),
    MinnowServer = require('./MinnowServer'),
    mb = require('./MessageBus'),
    handlers = {},
    channels = {};

log.add(log.transports.File, {filename: 'minnow.log'});

GLOBAL.bus = new mb.newInstance();

handlers['/register'] = httpHandler.register;
handlers['/authenticate'] = httpHandler.authenticate;
handlers['/invalidate'] = httpHandler.invalidate;
handlers['/display'] = httpHandler.display;  // localhost/display
handlers['/create'] = httpHandler.create;  // localhost/create
handlers['/save'] = httpHandler.save;
handlers['/view'] = httpHandler.view;        // localhost/view?host=
handlers['/modify'] = httpHandler.modify;    // localhost post modify
handlers['/delete'] = httpHandler.delete;    // localhost/delete?host=


channels['/session'] = eventHandler.session;
channels['/data'] = eventHandler.data;

new MinnowServer(requestRouter.route, handlers, channels);