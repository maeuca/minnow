var url = require("url"),
    querystring = require("querystring"),
    path = require("path"),
    fs = require('fs'),
    authservice = require('./AuthService'),
    dataservice = require('./DataService');

/**
 *
 * @type {{view, delete, modify, create, save, display, authenticate, register, invalidate}}
 */
var HttpHandler = (function () {


    return {
        view: function( request, response ) {
            dataservice.view(request,response);
        },
        delete: function( request, response ) {
            dataservice.delete(request,response);
        },
        modify: function( request, response ) {
            dataservice.modify(request,response);
        },
        create: function( request, response ) {
            dataservice.create(request,response);
        },
        save: function( request, response ) {
            dataservice.save(request,response);
        },
        display: function( request, response ) {
            dataservice.display(request,response);
        },

        authenticate: function( request,response ) {
            httpprocessor.getParameterMap(request, function (pmap) {
                var username = pmap.username;
                var password = pmap.password;
                if (username===undefined || password===undefined ||
                    username.length<3 || password.length < 3)  {
                    response.write('Invalid username or password detected');
                    response.end();
                }
                else  {
                    authservice.authenticate(username,password, function(token){
                        if ( token===null) {
                            response.write('authenticate failed for ' + username);
                        }
                        else{
                            response.write('authenticate completed  ' + username + ' ' + token);
                        }
                        response.end();
                    })
                }
            })
        },
        register: function( request,response ) {
            httpprocessor.getParameterMap(request, function (pmap) {
                var username = pmap.username;
                var password = pmap.password;
                if (username===undefined || password===undefined ||
                    username.length<3 || password.length < 3)  {
                    // We normally do a lot more to validate the input
                    // but this is a time sensitive exercise for an interview
                    // so please forgive me
                    response.write('Invalid username or password detected');
                    response.end();
                }
                else  {
                    authservice.register(username,password, function(){
                        response.write('registration completed  ' + username);
                        response.end();
                    })
                }
            })
        },
        invalidate: function( request,response ) {
            httpprocessor.getParameterMap(request, function (pmap) {
                var username = pmap.username;
                var uuid = pmap.uuid;
                if (username===undefined || uuid===undefined ||
                    username.length<3 || uuid.length < 3)  {
                    // We normally do a lot more to validate the input
                    // but this is a time sensitive exercise for an interview
                    // so please forgive me
                    response.write('Invalid username or token detected');
                    response.end();
                }
                else {
                    console.log('handle invalidate for token ' + uuid);
                    authservice.invalidate(username,uuid, function(){
                        response.write('invalidate completed');
                        response.end();
                    })
                }
            })


        }

    }
})();

module.exports = HttpHandler;
