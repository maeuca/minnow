var fs = require("fs"),
    bcrypt = require('bcrypt-nodejs'),
    querystring = require("querystring");

/**
 *
 * @type {{isauthorized, authenticate, register, invalidate}}
 */
var AuthService = ( () =>  {


    var passwordDB = {};
    var sessionDB  = {};

    /**
     *
     * @returns {string}
     */
    var getUuid = () => {
        var d = new Date().getTime();

        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    return {
        /**
         *
         * @param username
         * @param uuid
         * @param callback
         */
        isauthorized: (username, uuid, callback) => {

           if ( username in sessionDB && (sessionuuid = sessionDB[username])) {
                   callback(true);
           }
           else{
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
                var passwordhash = passwordDB[username];
                if ( bcrypt.compareSync(password, passwordhash)  ) {

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
