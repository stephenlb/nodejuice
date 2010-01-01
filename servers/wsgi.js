var http     = require("http")
,   posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   devmode  = !process.ARGV[4]
,   config   = require(appdir + "/configure/wsgi").wsgi
,   seeker   = require(appdir + "/configure/seeker").seeker
,   utility  = require(njdir  + "/library/utility")
,   wsgi     = exports
,   requests = {}
,   rxstatic = /\/$/
,   rxnojs   = /\.js$/
,   rxhtml   = /html/;

http.createServer(function ( req, res ) {
    var action = config.url.filter(function(url) {
        return url[0].test(req.uri.path) ? url[1] : 0
    })[0];

    res.utility = utility;

    res.attack = function( response, code, type, headers, encoding ) {
        code    = code || 200;
        type    = type || 'text/html';
        headers = [ ["Content-Type", type] ].concat( headers || [] );

        if (devmode) {
            headers.push(["Cache-Control", 'no-cache']);
            headers.push(["Expires", new Date]);

            if (rxhtml.test(type)) response = utility.amuse( response, req );
        }

        headers.push(["Content-Length", response.length]);
            
        utility.inform({ code: code, type: type, uri: req.uri.full });

        res.sendHeader( code, headers );

        res.sendBody( response, encoding || 'utf8' );
        res.finish();
    };

    res.impress = function( file, args ) {
        utility.impress( appdir + file, args,
        function( type, data, encoding ) {
            res.attack( data, 200, type, [], encoding )
        }, function() { error404( req, res, appdir + file ) } )
    };

    if (!action) return error404( req, res, appdir + file );

    if (rxstatic.test(action[1])) send_file( req, res, action );
    else                          send_script( req, res, action );

}).listen( config.port, config.host );
sys.puts("WSGI Server("+process.pid+"): " + JSON.stringify(config));

function error404( req, res, file ) {
    utility.impress( njdir + '/provision/404.htm', {
        request : sys.inspect(req.uri), file : file
    }, function( type, data ) { res.attack( data, 404 ) } )
}

function send_file( req, res, action, retries ) {
    var path    = req.uri.path.replace( action[0], action[1] )
    ,   syspath = appdir + path + (path.slice(-1) === '/' ? config.root : '');

    utility.noble( syspath, function( type, data, encoding ) {
        res.attack( data, 200, type, [], encoding )
    }, function() { error404( req, res, syspath ) } );
}

function send_script( req, res, action ) {
    if (!devmode) return require(appdir + req.uri.path
        .replace( action[0], action[1] )
        .replace( rxnojs, '' )
    ).journey( req, res );

    utility.noble( appdir + action[1], function( type, data, encoding ) {
        try { eval(data).journey( req, res ) }
        catch(e) {
            utility.impress( njdir + '/provision/500.htm', {
                file : action[1], message : e.message,
                path : appdir,    stack   : e.stack
            }, function( type, data ) { res.attack( data, 500 ) } )
        }
    }, function() { error404( req, res, appdir + action[1] ) } );
}
