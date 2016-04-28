'use strict';

let url = require('url'),
    querystring = require('querystring');

module.exports.getParameterMap = function (request, callback) {
    let parameterMap = {};
    if ( request.method == 'POST')  {
        let postData = '';
        request.setEncoding('utf8');
        request.addListener('data', function (postDataChunk) {
            postData += postDataChunk;
        });
        request.addListener('end', function () {
            for ( let key in querystring.parse(postData) ) {
                parameterMap[key] = querystring.parse(postData)[key];
            }

            callback(parameterMap);
        });
    } else if ( request.method == 'GET')  {
        let queryObject = url.parse(request.url, true).query;
        for ( let key in queryObject ) {
            parameterMap[key] = queryObject[key];
        }
        callback(parameterMap);
    }
};


