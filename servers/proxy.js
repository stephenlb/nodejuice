var sys      = require('sys')
,   http     = require('http')
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = process.ARGV[5]
,   utility  = require(njdir + '/library/utility')
,   config   = utility.ignite()
,   rxml     = /<[^>]*>/g
,   rxhtml   = /html/;

if (!devmode) process.exit();

http.createServer(function (req, res) {
    var error = false;

    utility.fetch(
        config.proxy.fetch.port, config.proxy.fetch.host,
        req.method, req.uri.full, req.headers,
    function( response ) {
    }, function( chunk, response, encoding ) {
    }, function( chunk, response, encoding ) {
        error = true;
    }, function( data, response, encoding ) {
        if (error) {
            utility.impress( njdir + '/provision/proxy.htm', {
                url      : req.uri.full,
                code     : response.statusCode,
                response : data.replace( rxml, '' ),
                headers  : sys.inspect(response.headers)
            }, function( type, data ) {
                data = utility.amuse( data, req );
                response.headers['content-length'] = data.length;
                res.sendHeader( response.statusCode, response.headers );
                res.sendBody( data, encoding );
                res.finish();
            } )
        }
        else {
            if (rxhtml.test(response.headers['content-type']))
                data = utility.amuse( data, req );
            response.headers['content-length'] = data.length;
            res.sendHeader( response.statusCode, response.headers );
            res.sendBody( data, encoding );
            res.finish();
        }
    } );

}).listen( config.proxy.port, config.proxy.host );

sys.puts("\nProxy Server("+process.pid+")");
utility.inform(config.proxy);
