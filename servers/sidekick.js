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
        config.sidekick.fetch.port, config.sidekick.fetch.host,
        req.method, req.uri.full, req.headers,
    function( response ) {
    }, function( chunk, response, encoding ) {
    }, function( chunk, response, encoding ) {
        error = true;
    }, function( data, response, encoding ) {
        if (error) {
            utility.impress( njdir + '/provision/sidekick.htm', {
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

}).listen( config.sidekick.port, config.sidekick.host );

sys.puts("\nSidekick Server("+process.pid+")");
utility.inform(config.sidekick);
