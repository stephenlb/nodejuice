var http     = require("http")
,   posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = process.ARGV[5]
,   utility  = require(njdir  + "/library/utility")
,   rad      = require(njdir  + "/library/rad").rad
,   config   = utility.ignite()
,   wsgi     = exports
,   rxnojs   = /\.js$/;

http.createServer(function ( req, res ) {

    if (devmode) utility.bolt( njconfig + '.js', function( obj ) {
        var old = config;
        try { config = obj }
        catch(e) {
            config = old;
            error500( req, res, njconfig + '.js', e );
        }
    } );

    var action = config.wsgi.url.filter(function(url) {
        return req.uri.path.match(url[0])
    })[0];

    res.utility = utility;
    res.appdir  = appdir;
    res['404']  = error404;
    res['500']  = error500;

    res.attack  = function( body, code, type, headers, encoding ) {
        code    = code    || 200;
        type    = type    || 'text/html';
        headers = headers || {};

        headers["Content-Type"] = type;

        if (devmode) {
            headers["Cache-Control"] = 'no-cache';
            headers["Expires"]       = 'Thu, 01 Dec 1994 16:00:00 GMT';

            if (
                encoding != 'binary' &&
                !req.headers['x-requested-with'] &&
                (req.headers['content-type'] || '').indexOf('html') !== -1
            ) body = utility.amuse( body, req );
        }

        headers["Content-Length"] = body.length;

        utility.inform({
            code: code, type: type, uri: req.uri.full, time: Date()
        });

        res.sendHeader( code, headers );
        res.sendBody( body, encoding || 'utf8' );
        res.finish();
        res.finished = true;
    };

    res.impress = function( file, args ) {
        utility.impress( appdir + file, args,
        function( type, data, encoding ) {
            res.attack( data, 200, type, [], encoding )
        }, function() { error404( req, res, appdir + file ) } )
    };

    if (!action) error404( req, res, appdir + file );
    else if (rxnojs.test(action[1])) send_script( req, res, action );
    else                             send_file( req, res, action );

}).listen( config.wsgi.port, config.wsgi.host );
sys.puts("\nWSGI Server("+process.pid+")");
utility.inform(config.wsgi);

function error404( req, res, file ) {
    utility.impress( njdir + '/provision/404.htm', {
        request : sys.inspect(req.uri), file : file
    }, function( type, data ) { res.attack( data, 404 ) } )
}

function error500( req, res, file, e ) {
    utility.impress( njdir + '/provision/500.htm', {
        file : file,   message : e.message,
        path : appdir, stack   : e.stack
    }, function( type, data ) { res.attack( data, 500 ) } )
}

function send_file( req, res, action, retries ) {
    var path    = req.uri.path.replace( action[0], action[1] )
    ,   syspath = appdir + path +
                  (path.slice(-1) === '/' ? config.wsgi.root : '');

    utility.noble( syspath, function( type, data, encoding ) {
        res.attack( data, 200, type, devmode ? {} : {
            "Expires" : "Thu, 01 Dec 2030 16:00:00 GMT"
        }, encoding )
    }, function() { error404( req, res, syspath ) } );
}

function send_script( req, res, action ) {
    utility.bolt( appdir + action[1], function( app, rad ) {
        try {
            (app.journey && (app.journey( req, res ) || 1)) || (rad.ran ||
                error500( req, res, action[1], {
                    message : 'No journey() or rad() matched.',
                    stack   : 'You must use journey() or rad().\n' +
                              'There is a problem in your script.\n' +
                              'Make sure to have catch all if using rad\n\n' +
                              'rad( /.*/, "catch all" )'
                } ));
        }
        catch(e) { error500( req, res, action[1], e ) }
    }, function(e) {
        if (e) error500( req, res, appdir + action[1], e )
        else   error404( req, res, appdir + action[1] );
    }, rad( req, res ) );
}
