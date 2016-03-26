/**
 *
 * @type {{session, data}}
 */
var EventHandler = (function () {

    return {
        session: function (websocket) {
            websocket.on('session-start', function (data) {
                console.log('session starting do something');
            })

            websocket.on('session-end', function (data) {
                console.log('session ending do something');
            })
        },

        data: function (websocket) {
            websocket.on('data', function (data) {
                console.log('data received do something');
                websocket.emit('message', data);
            })


            bus.on('authenticate', function(data){
                websocket.emit('message', data);
            });
            bus.on('register', function(data){
                websocket.emit('message', data);
            });
            bus.on('invalidate', function(data){
                websocket.emit('message', data);
            });
        }
    }

})();

module.exports = EventHandler;
