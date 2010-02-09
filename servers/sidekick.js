var sys      = require('sys')
,   http     = require('http')
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = process.ARGV[5]
,   utility  = require(njdir + '/library/utility')
,   config   = utility.ignite()
,   rxml     = /<[^>]*>/g;

if (!devmode) process.exit();

http.createServer(function (req, res) {
    var error    = false
    ,   body     = ''
    ,   host     = ((req.headers||{}).host||{}).split(':')[0] || 'localhost'
    ,   method   = req.method || 'GET'
    ,   encoding = (req.headers['content-type'] || 'text')
                   .slice( 0, 4 ) === "text" ? "utf8" : "binary";

    req.addListener( "body", function(chunk) { body += chunk } );
    req.addListener( "complete", function() {
        req.headers['content-length'] = body.length;

        utility.fetch({
            port     : config.sidekick.fetch.port,
            host     : config.sidekick.fetch.host,
            type     : body ? 'POST' : method,
            path     : req.url,
            headers  : req.headers,
            body     : body,
            encoding : encoding,
            fail     : function( chunk, response, encoding ) { error = true },
            finished : function( data, response, encoding ) {
                if (error) return utility.impress(
                    njdir + '/provision/sidekick.htm', {
                        url      : req.url,
                        code     : response.statusCode,
                        response : data.replace( rxml, '' ),
                        headers  : sys.inspect(response.headers)
                    }, function( type, data ) {
                        data = utility.amuse( data, host );
                        response.headers['content-length'] = data.length;
                        res.sendHeader( response.statusCode, response.headers);
                        res.sendBody( data, encoding );
                        res.finish();
                    } )

                if (
                    encoding != 'binary' &&
                    !req.headers['x-requested-with'] && (
                        response.headers['content-type'] || ''
                    ).indexOf('html') !== -1
                ) data = utility.amuse( data, host );

                response.headers['content-length'] = data.length;
                res.sendHeader( response.statusCode, response.headers );
                res.sendBody( data, encoding );
                res.finish();
        } });
    } );

}).listen( config.sidekick.port, config.sidekick.host );

sys.puts("\nSidekick Server("+process.pid+")");
utility.inform(config.sidekick);
