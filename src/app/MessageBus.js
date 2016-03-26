var events = require('events'),
    util = require('util');

/**
 * Allows internal objects and services to exchange messages.
 *
 * @constructor
 */
var MessageBus = function() {

    this.emitMessage = function (eventName, eventData) {
        eventData.eventName = eventName;
        self.emit( [eventName],eventData );
    }


    var self = this;
};

util.inherits(MessageBus, events.EventEmitter);
module.exports = { newInstance:MessageBus }