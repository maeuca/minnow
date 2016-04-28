'use strict';

let url = require('url'),
    querystring = require('querystring');

module.exports.getParameterMap = function (request, callback) {
    let parameterMap = {},
        postData = [];
    if ( request.method == 'POST')  {

        request.setEncoding('utf8');
        request.addListener('data', function (postDataChunk) {
            postData.push(new Buffer(postDataChunk,'utf8'));
        });
        request.addListener('end', function () {
            let postBody = Buffer.concat(postData).toString();
            for ( let key in querystring.parse(postBody) ) {
                parameterMap[key] = querystring.parse(postBody)[key];
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


