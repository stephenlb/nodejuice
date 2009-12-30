var http     = require("http")
,   posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   devmode  = !process.ARGV[4]
,   config   = require(appdir + "/configure/wsgi").wsgi
,   utility  = require(njdir  + "/library/utility")
,   wsgi     = exports
,   requests = {}
,   rxstatic = /\/$/
,   rxnojs   = /\.js$/
,   rxmagic  = /{{([\w\-]+)}}/g;

http.createServer(function ( req, res ) {
    var action = config.url.filter(function(url) {
        return url[0].test(req.uri.path) ? url[1] : 0
    })[0];

    res.utility = utility;

    res.attack = function( code, type, response, headers, encoding ) {
        headers = headers || [];

        if (devmode) {
            headers.push(["Cache-Control", 'no-cache']);
            headers.push(["Expires", new Date]);
        }

        utility.inform({ code: code, type: type, uri: req.uri.full});

        res.sendHeader( code, [
            ["Content-Type", type],
            ["Content-Length", response.length]
        ].concat(headers) );

        res.sendBody( response, encoding || 'utf8' );
        res.finish();
    };

    res.impress = function( file, args ) {
        utility.noble( appdir + file, function( type, data, encoding ) {
            res.attack( 200, type, data.replace( rxmagic, function( _, key ) {
                return args[key] || ''
            } ), [], encoding )
        }, function() { error404( req, res ) } );
    };

    if (!action) return error404( req, res );

    if (rxstatic.test(action[1])) send_file( req, res, action );
    else                          send_script( req, res, action  );

}).listen( config.port, config.host );
sys.puts("WSGI Server("+process.pid+"): " + JSON.stringify(config));

function error404( req, res ) {
    var response = "locked or missing: " + JSON.stringify(req.uri);
    res.attack( 404, "text/plain", response );
}

function send_file( req, res, action, retries ) {
    var path    = req.uri.path.replace( action[0], action[1] )
    ,   syspath = appdir + path + (path.slice(-1) === '/' ? config.root : '');

    utility.noble( syspath, function( type, data, encoding ) {
        res.attack( 200, type, data, [], encoding )
    }, function() { error404( req, res ) } );
}

function send_script( req, res, action ) {
    if (!devmode) return require(appdir + req.uri.path
        .replace( action[0], action[1] )
        .replace( rxnojs, '' )
    ).journey( req, res );

    utility.noble( appdir + action[1], function( type, data, encoding ) {
        eval(data).journey( req, res )
    }, function() { error404( req, res ) } );
}
