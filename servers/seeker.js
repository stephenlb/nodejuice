var sys         = require('sys')
,   http        = require('http')
,   appdir      = process.ARGV[2]
,   njdir       = process.ARGV[3]
,   devmode     = !process.ARGV[4]
,   config      = require(appdir + '/configure/seeker').seeker
,   utility     = require(njdir + '/library/utility')
,   clients     = []
,   connections = 0;

if (!devmode) process.exit();

http.createServer(function (req, res) {
    clients.push(function() {
        res.sendHeader( 200, {"Content-Type": "text/plain"} );
        res.sendBody("\n");
        res.finish();
    });
}).listen( config.port, config.host );
sys.puts("Seeker Server("+process.pid+"): " + JSON.stringify(config));

utility.recurse( appdir, config.ignore, function( file, stats ) {
    process.watchFile( file, function(curr, prev) {
        sys.puts(JSON.stringify({file: file, connections: clients.length}));

        while (clients.length > 0) clients.shift()();
    } );
} );
