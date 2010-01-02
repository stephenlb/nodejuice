var http     = require("http")
,   posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = !process.ARGV[5]
,   config   = require(njconfig)
,   utility  = require(njdir  + "/library/utility")
,   wsgi     = exports
,   requests = {}
,   rxnojs   = /\.js$/
,   rxhtml   = /html/;

http.createServer(function ( req, res ) {
    if (devmode) utility.noble( njconfig+'.js',
    function( type, data, encoding ) {
        try { config = eval('(function(){'+data+'return exports})()') }
        catch(e) { error500( req, res, njconfig+'.js', e ) }
    } );
    if (!config.wsgi.url[0]) return;

    var action = config.wsgi.url.filter(function(url) {
        return req.uri.path.match(url[0])
    })[0];

    res.utility = utility;
    res.appdir  = appdir;

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

    if (rxnojs.test(action[1])) send_script( req, res, action );
    else                        send_file( req, res, action );

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
    ,   syspath = appdir + path + (path.slice(-1) === '/' ? config.wsgi.root : '');

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
        catch(e) { error500( req, res, action[1], e ) }
    }, function() { error404( req, res, appdir + action[1] ) } );
}
