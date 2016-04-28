'use strict';

var events = require('events');


/**
 * Allows internal objects and services to exchange messages.
 *
 * @constructor
 */
class MessageBus extends events.EventEmitter {


    emitMessage(eventName, eventData) {
        eventData.eventName = eventName;
        this.emit( [eventName], eventData );
    }
}

module.exports = {newInstance: MessageBus};