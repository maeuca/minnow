var url = require("url"),
    querystring = require("querystring");

var HttpProcessor = (function () {

    return {

        /**
         *
         * @param request
         * @param callback
         */
        getParameterMap: (request, callback) => {
            var parameterMap = {};
            if ( request.method == 'POST')  {
                var postData = "";
                request.setEncoding("utf8");
                request.addListener("data", function (postDataChunk) {
                    postData += postDataChunk;
                });
                request.addListener("end", function () {
                    for ( key in querystring.parse(postData) )
                    {
                        parameterMap[key] = querystring.parse(postData)[key];
                    }

                    callback(parameterMap);
                });
            }
            else if ( request.method == 'GET')  {
                var queryObject = url.parse(request.url, true).query;
                for ( key in queryObject ) {
                    parameterMap[key] = queryObject[key];
                }
                callback(parameterMap);
            }

        }
    }

})();

module.exports = HttpProcessor;
