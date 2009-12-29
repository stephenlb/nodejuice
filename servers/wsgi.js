var http     = require("http")
,   posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   devmode  = !process.ARGV[4]
,   config   = require(appdir + "/configure/wsgi").wsgi
,   mime     = require(njdir  + "/library/mime").mime
,   utility  = require(njdir  + "/library/utility")
,   wsgi     = exports
,   requests = {}
,   rxstatic = /\/$/
,   rxnojs   = /\.js$/;

http.createServer(function ( req, res ) {
    var action = config.url.filter(function(url) {
        return url[0].test(req.uri.path) ? url[1] : 0
    })[0];

    res.attack = function( code, type, response, headers, encoding ) {
        headers = headers || [];
        log({ code: code, type: type, uri: req.uri});
        res.sendHeader( code, [
            ["Content-Type", type],
            ["Content-Length", response.length]
        ].concat(headers) );
        res.sendBody( response, encoding || 'utf8' );
        res.finish();
    };

    // Leave if we don't know what to do.
    if (!action) return error404( req, res );

    // Is this a static directory?
    if (rxstatic.test(action[1]))
        send_file( req, res, action );
    else
        send_script( req, res, action  );

}).listen( config.port, config.host );
sys.puts("Server WSGI("+process.pid+"): " + JSON.stringify(config));

function error404( req, res ) {
    var response = "Non-configured pathname: " + JSON.stringify(req.uri);
    res.attack( 404, "text/plain", response );
}

function log( obj ) {
    sys.puts(JSON.stringify(obj));
}

function send_file( req, res, action, retries ) {
    var path     = req.uri.path.replace( action[0], action[1] )
    ,   syspath  = appdir + path + (path.slice(-1) === '/' ? config.root : '')
    ,   type     = mime.get(syspath)
    ,   encoding = (type.slice(0,4) === "text" ? "utf8" : "binary")
    ,   file     = posix.cat( syspath, encoding );

    log({syspath: syspath, path: path, encoding: encoding })

    function retry() {
        retries = retries || 0;

        log({ retry : retries, syspath: syspath });

        if ( retries < config.retry.max ) setTimeout( function() {
            send_file( req, res, action, retries + 1 )
        }, config.retry.wait );
        else return error404( req, res );
    }

    file.addCallback(function(data) {
        if (!data) return retry();
        res.attack( 200, type, data, [], encoding );
    });

    file.addErrback(function() { retry() });
}

function send_script( req, res, action ) {
    if (!devmode) return require(appdir + req.uri.path
        .replace( action[0], action[1] )
        .replace( rxnojs, '' )
    ).journey( req, res );

    var path   = appdir + action[1]
    ,   script = posix.cat(path);

    script.addCallback(function(code) {
        if (!code) return error404( req, res );
        eval(code).journey( req, res );
    });

    script.addErrback(function() {
        return error404( req, res );
    });
}

