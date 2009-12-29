var sys         = require('sys')
,   http        = require('http')
,   appdir      = process.ARGV[2]
,   njdir       = process.ARGV[3]
,   config      = require(appdir + '/configure/watcher').watcher
,   utility     = require(njdir + '/library/utility')
,   clients     = []
,   connections = 0;

http.createServer(function (req, res) {
    clients.push(function(wait) {
        res.sendHeader( 200, {"Content-Type": "text/plain"} );
        res.sendBody(wait);
        res.finish();
    });
}).listen( config.port, config.host );
sys.puts("Server Watcher("+process.pid+"): " + JSON.stringify(config));

utility.recurse( appdir, config.ignore, function( file, stats ) {
    process.watchFile( file, function(curr, prev) {
        sys.puts(JSON.stringify({file: file, connections: clients.length}));

        while (clients.length > 0) {
            clients.shift()(content + ' length: ' + clients.length);
        }
        /*
        if (!config.restart.on.filter(function(item) {
            return (new RegExp(item)).test(file)
        }).length) return;

        var startup = process.ARGV.join(' ');

        sys.puts('Restarting nodejuce.');
        sys.exec(startup).addCallback(function (stdout, stderr) {
            sys.puts(stdout);
            sys.puts(stderr);
        });

        process.ChildProcess().exit();
        process.exit();
        return;
        */
    } );
} );
