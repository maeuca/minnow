/**
 *
 * @type {{session, data}}
 */
var EventHandler = (() =>  {

    return {
        session: (websocket) => {
            websocket.on('session-start', function (data) {
                console.log('session starting do something', data);
            });

            websocket.on('session-end', function (data) {
                console.log('session ending do something', data);
            });
        },

        data: (websocket) => {
            websocket.on('data', function (data) {
                console.log('data received do something');
                websocket.emit('message', data);
            });

            GLOBAL.bus.on('authenticate', function (data) {
                websocket.emit('message', data);
            });
            GLOBAL.bus.on('register', function (data) {
                websocket.emit('message', data);
            });
            GLOBAL.bus.on('invalidate', function (data) {
                websocket.emit('message', data);
            });
        }
    };

})();

module.exports = EventHandler;
