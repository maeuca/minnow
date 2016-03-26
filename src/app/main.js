var httpHandler = require('./demo/HttpHandler');
var eventHandler = require('./demo/EventHandler');
var requestRouter = require('./RequestRouter');
var minnowServer = require('./MinnowServer');
var mb = require('./MessageBus');

GLOBAL.config = require("../config");
GLOBAL.httpprocessor = require('./HttpProcessor');

GLOBAL.bus = new mb.newInstance();

var handlers = {};
handlers["/register"] = httpHandler.register;
handlers["/authenticate"] = httpHandler.authenticate;
handlers["/invalidate"] = httpHandler.invalidate;
handlers["/display"] = httpHandler.display;  // localhost/display
handlers["/create"] = httpHandler.create;  // localhost/create
handlers["/save"] = httpHandler.save;
handlers["/view"] = httpHandler.view;        // localhost/view?host=
handlers["/modify"] = httpHandler.modify;    // localhost post modify
handlers["/delete"] = httpHandler.delete;    // localhost/delete?host=


var channels = {};
channels["/session"] = eventHandler.session;
channels["/data"] = eventHandler.data;

minnowServer.start(config.port, requestRouter.route, handlers, channels);