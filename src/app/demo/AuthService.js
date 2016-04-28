'use strict';

var bcrypt = require('bcrypt-nodejs');


/**
 *
 * @type {{isauthorized, authenticate, register, invalidate}}
 */
var AuthService = ( function()  {

    var passwordDB = {},
        sessionDB  = {};
    /**
     *
     * @returns {string}
     */
    var getUuid = function ()  {
        var d = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d/16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    return {
        /**
         *
         * @param username
         * @param uuid
         * @param callback
         */
        isauthorized: function (username, uuid, callback) {

            if ( username in sessionDB && (uuid = sessionDB[username])) {
                callback(true);
            } else {
                callback(false);
            }

        },
        /**
         *
         * @param username
         * @param password
         * @param callback
         */
        authenticate: (username,password,callback) => {

            if ( username in passwordDB)  {
                if ( bcrypt.compareSync(password, passwordDB[username])  ) {

                    var uuid = getUuid();
                    sessionDB[username] = uuid;
                    bus.emitMessage('authenticate', { "username" : username, "authenticated": true, "uuid": uuid});
                    callback(uuid);
                }
                else{
                    callback(null);
                }
            }
            else{
                callback(null);
            }

        },
        /**
         *
         * @param username
         * @param password
         * @param callback
         */
        register: (username,password,callback) => {
            if ( !(username in passwordDB)) {
                passwordDB[username] = bcrypt.hashSync(password);
                bus.emitMessage('register', { "username" : username })
            }
            callback();
        },
        /**
         *
         * @param username
         * @param uuid
         * @param callback
         */
        invalidate: (username,uuid,callback)  => {
            if ( username in sessionDB) {
                delete passwordDB[username];
                bus.emitMessage('invalidate', { "username" : username})
            }

            callback();
        }
    }

})();

module.exports = AuthService;
