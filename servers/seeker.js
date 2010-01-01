var sys      = require('sys')
,   http     = require('http')
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = !process.ARGV[5]
,   config   = require(njconfig)
,   utility  = require(njdir + '/library/utility')
,   clients  = []
,   rxhost   = /!host!/;

if (!devmode) process.exit();

http.createServer(function (req, res) {
    // Deliver Client JS
    if (!req.uri.params.unique) {
        return utility.noble( njdir + '/library/seeker.min.js',
        function( type, js ) {
            var host = req.headers.host.split(':')[0] +
                       ':' + config.seeker.port;
            res.sendHeader( 200, {"Content-Type" : type} );
            res.sendBody(js.replace( rxhost, host ));
            res.finish();
        } );
    }

    // Deliver Update Notice
    clients.push({ already : utility.earliest(), vow : function(ready) {
        res.sendHeader( 200, {"Content-Type" : "application/javascript"} );
        res.sendBody(utility.vigilant(
            ready ? 'success' : '', req.uri.params.unique
        ));
        res.finish();
    } });
}).listen( config.seeker.port, config.seeker.host );

sys.puts("\nSeeker Server("+process.pid+")");
utility.inform(config.seeker);

utility.recurse( appdir, config.seeker.ignore, function( file, stats ) {
    process.watchFile( file, function(curr, prev) {
        utility.inform({ file: file, connections: clients.length });
        while (clients.length > 0) clients.shift().vow(1);
    } );
} );

setInterval( function() {
    var instant = utility.earliest();
    while (clients.length > 0 && (instant - clients[0].already > 25000))
        clients.shift().vow(0)
}, 1000 );
