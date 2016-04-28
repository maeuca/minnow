'use strict';

var fs = require("fs"),
    url = require("url"),
    httputils = require('../httpUtils'),
    querystring = require("querystring");

var navbarhtml = '[<a href=/create>Create</a>] &nbsp; [<a href=/display>Display</a>]</hr>';

// pagination properties
var size_show = 2;
var current_ndx = 0;

/**
 * This is only an example.
 *
 * In most cases we would only want to return data. For breviety and not wanting to implement
 * a complete front-end demo, I have added html to the backend.
 *
 * @type {{save, delete, create, view, modify, display}}
 */
var DataService = (() => {

    /**
     *
     * @param configs
     * @param sortby
     * @returns {Array.<T>}
     */
    var configSort = (configs, sortby) => {
        console.log('configSort:' + sortby);
        function compare(a, b) {
            a = a[sortby];
            b = b[sortby];
            var type = (typeof(a) === 'string' || typeof(b) === 'string') ? 'string' : 'number';
            var result;

            if (a !== undefined) {
                if (sortby == 'port') result = a - b
                else result = a.localeCompare(b);
                return result;
            }

        }

        return configs.sort(compare);
    }

    /**
     *
     * @param configname
     * @param callback
     */
    var getConfig = (configname, callback) => {
        fs.readFile("../etc/configurations", (err, data) => {

            if (data === undefined) {
                callback(null);
            }
            else {
                var configs = JSON.parse(data);
                console.log('configs=' + configs);
                if (configs.configurations === undefined) {
                    callback(null);
                }
                else {
                    var config = {};
                    for (var i = 0; i < configs.configurations.length; i++) {
                        config = configs.configurations[i];
                        console.log('looking up config for ' + configname + ' at ' + config.name);
                        if (config.name === configname) {
                            break;
                        }
                    }
                    callback(config);
                }
            }


        })

    }
    /**
     *
     * @param configdata
     * @param callback
     */
    var updateConfig = (configdata, callback) => {
        fs.readFile("../etc/configurations", (err, data) => {

            if (data === undefined) {
                callback(null);
            }
            else {
                var configs = JSON.parse(data);
                console.log('configs=' + configs);
                if (configs.configurations === undefined) {
                    callback(null);
                }
                else {
                    var removeIndex = -1;
                    for (var i = 0; i < configs.configurations.length; i++) {
                        var config = configs.configurations[i];
                        console.log('check config for ' + config.name + '!=' + configdata.name);
                        if (config.name === configdata.name) {
                            removeIndex = i;
                        }
                    }

                    console.log('removeIndex found ' + removeIndex);
                    if (removeIndex > -1) {
                        configs.configurations.splice(removeIndex, 1);
                    }
                    configs.configurations.push(configdata);
                    fs.writeFile("../etc/configurations", JSON.stringify(configs), (err) => {
                        if (err) {
                            console.log(err);
                            callback(null);
                        }

                        callback("configurations saved");

                    });
                }
            }
        })

    }
    /**
     *
     * @param configdata
     * @param callback
     */
    var deleteConfig = (configdata, callback) => {
        fs.readFile("../etc/configurations",  (err, data) => {

            if (data === undefined) {
                callback(null);
            }
            else {
                var configs = JSON.parse(data);
                console.log('configs=' + configs);
                if (configs.configurations === undefined) {
                    callback(null);
                }
                else {
                    var removeIndex = -1;
                    for (var i = 0; i < configs.configurations.length; i++) {
                        var config = configs.configurations[i];
                        console.log('check config for ' + config.name + '!=' + configdata.name);
                        if (config.name === configdata.name) {
                            removeIndex = i;
                        }
                    }

                    console.log('removeIndex found ' + removeIndex);
                    if (removeIndex > -1) {
                        configs.configurations.splice(removeIndex, 1);
                    }

                    fs.writeFile("../etc/configurations", JSON.stringify(configs), (err) => {
                        if (err) {
                            console.log(err);
                            callback(null);
                        }

                        callback("configurations saved");

                    });
                }
            }
        })

    }
    /**
     *
     * @param callback
     */
    var loadConfigs = (callback) => {
        fs.readFile("../etc/configurations", (err, data) => {

            if (data === undefined) {
                callback(null);
            }
            else {
                var configs = JSON.parse(data);
                console.log('configs=' + configs);
                if (configs.configurations === undefined) {
                    callback(null);
                }
                else {
                    callback(configs.configurations);
                }
            }


        })

    }
    return {
        save: (request, response) => {
            httputils.getParameterMap(request, (pmap)=>  {
                console.log('ConfigService save start');


                console.log('save configdata');
                var configdata = {};
                configdata.username = pmap.username;
                configdata.hostname = pmap.hostname;
                configdata.port = pmap.port;
                configdata.name = pmap.hostkey;

                console.log('save config for ' + configdata.name + '/' + configdata.port + '/' + configdata.username + '/' + configdata.hostname);

                updateConfig(configdata,  () => {
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write('save completed ... <a href="/display">Return</a>');
                    response.end();
                })

            });


        },
        delete: (request, response) => {
            httputils.getParameterMap(request,  (pmap) => {
                response.writeHead(200, {"Content-Type": "text/html"});
                console.log('delete ' + pmap.host);
                var config = getConfig(pmap.host, (config) => {
                    deleteConfig(config,  () => {

                        console.log('delete completed');
                        response.write('delete completed ... <a href="/display">Return</a>');
                        response.end();
                    })
                });
            });

        },
        create: (request, response) => {
            response.writeHead(200, {"Content-Type": "text/html"});
            var formhtml = 'Create New Host Entry<hr><form action="/save" method="post">';
            formhtml += '<Div>Hostname:<input type="text" name="hostname" maxlength="40" length="25" value=""></Div>';
            formhtml += '<Div>Username:<input type="text" name="username" maxlength="40" length="25" value=""></Div>';
            formhtml += '<Div>Port:<input type="text" name="port" maxlength="40" length="25" value=""></Div>';
            formhtml += '<Div>Hostkey:<input type="text" name="hostkey" value="">';
            formhtml += '<input type="submit" value="Save" />';
            formhtml += '</form>'
            response.write(formhtml);
            response.end();
        },
        view: (request, response) => {
            httputils.getParameterMap(request, (pmap) => {
                response.writeHead(200, {"Content-Type": "text/html"});
                var config = getConfig(pmap.host,(config) => {
                    var formhtml = 'Modify -- ' + pmap.host + '<hr><form action="/modify" method="post">';
                    formhtml += '<Div>Hostname:<input type="text" name="hostname" maxlength="40" length="25" value="' + config.hostname + '"></Div>';
                    formhtml += '<Div>Username:<input type="text" name="username" maxlength="40" length="25" value="' + config.username + '"></Div>';
                    formhtml += '<Div>Port:<input type="text" name="port" maxlength="40" length="25" value="' + config.port + '"></Div>';
                    formhtml += '<input type="hidden" name="host" value="' + pmap.host + '">';
                    formhtml += '<input type="submit" value="Modify" />';
                    formhtml += '</form>'
                    console.log('view config for ' + JSON.stringify(config));
                    response.write(formhtml);
                    response.end();
                })
            })


        },
        modify: (request, response) => {
            httputils.getParameterMap(request, (pmap) =>  {
                console.log(JSON.stringify(pmap));
                var configdata = {};
                configdata.username = pmap.username;
                configdata.hostname = pmap.hostname;
                configdata.port = pmap.port;
                configdata.name = pmap.host;
                console.log('modify config for ' + configdata.name + '/' + configdata.port + '/' + configdata.username + '/' + configdata.hostname);
                updateConfig(configdata, () => {

                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(navbarhtml);
                    response.write('modify completed ...');
                    response.end();
                })
            })

        },
        display: (request, response) =>  {
            httputils.getParameterMap(request, (pmap) => {
                console.log('pmap=' + JSON.stringify(pmap));

                var sortby = pmap.sort;// name, hostname, port, username
                if (sortby === undefined) {
                    sortby = 'name';
                }
                if (pmap.ndx === undefined) {
                    current_ndx = 0;
                }
                else {
                    current_ndx = pmap.ndx;
                }
                console.log('sortby=' + sortby);

                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(navbarhtml);

                loadConfigs((configurations) => {
                    if (configurations === null) {
                        response.write('no configurations have been defined');
                        response.end();
                    }
                    else {

                        var configurations = configSort(configurations, sortby);
                        var row_cnt = 1;
                        var next_ndx = 0;
                        var prev_ndx = 0;
                        console.log('configurations=' + configurations.length);
                        for (var i = current_ndx; i < configurations.length; i++) {
                            current_ndx = i;

                            var config = configurations[i];
                            var confightml = '<div>';
                            confightml += config.name + '&nbsp;' + config.hostname + '&nbsp;' + config.port + '&nbsp;' + config.username;
                            confightml += '[<a href=/view?host=' + config.name + '>View</a>]';
                            confightml += '&nbsp;&nbsp;&nbsp;&nbsp;';
                            confightml += '[<a href=/delete?host=' + config.name + '>Delete</a>]';
                            confightml += '</div>';
                            response.write(confightml);
                            if (row_cnt === size_show) {
                                break;
                            }
                            row_cnt++;
                            next_ndx = parseInt(current_ndx) + parseInt(row_cnt);
                            prev_ndx = parseInt(current_ndx) - parseInt(row_cnt);

                        }

                        console.log('next_ndx=' + next_ndx + '/prev_ndx=' + prev_ndx + '/current_ndx=' + current_ndx + '/row_cnt=' + row_cnt);

                        if (prev_ndx >= 0) {
                            response.write(' <span>[<a href=/display?sort=' + sortby + '&ndx=' + prev_ndx + '>Previous</a>]</span>');
                        }

                        if (next_ndx < configurations.length) {
                            response.write(' <span>[<a href=/display?sort=' + sortby + '&ndx=' + next_ndx + '>Next</a>]</span>');
                        }
                        response.end();
                    }
                })

            })


        }
    }
})();

module.exports = DataService;
