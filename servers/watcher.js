var sys         = require('sys')
,   http        = require('http')
,   config      = require('/opt/nodejuice/configure/watcher').watcher
,   utility     = require('/opt/nodejuice/library/utility')
,   clients     = []
,   connections = 0;

http.createServer(function (req, res) {
    clients.push(function(wait) {
        res.sendHeader( 200, {"Content-Type": "text/plain"} );
        res.sendBody(wait);
        res.finish();
    });
}).listen(config.port);

utility.recurse( config.watch, config.ignore, function( file, stats ) {
    sys.puts(file);

    process.watchFile( file, function(curr, prev) {
        sys.puts(file + ' connections: ' + clients.length);
        while (clients.length > 0) {
            clients.shift()(content + ' length: ' + clients.length);
        }
    } );
} );
