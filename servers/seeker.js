var sys      = require('sys')
,   http     = require('http')
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = process.ARGV[5]
,   utility  = require(njdir + '/library/utility')
,   config   = utility.ignite()
,   clients  = []
,   seeking  = {}
,   seeker   = false;

if (!devmode) process.exit();

http.createServer(function ( req, res ) {

    // Deliver Client JS
    if (typeof req.uri.params.unique === 'undefined') {
        setTimeout( function() { res.finish() }, 4000 );
        if (seeker) seeker( req, res );
        
        else {
            utility.noble( njdir + '/library/seeker.min.js',
            function( type, js, encoding ) {
                seeker = function( req, res ) {
                    var headers = { "Content-Type" : type }
                    ,   host    = req.headers.host.split(':')[0] +
                               ':' + config.seeker.port;
                    js = utility.supplant( js, {
                        host : host,
                        wait : config.seeker.wait
                    } );

                    headers['Content-Length'] = js.length;

                    res.sendHeader( 200, headers );
                    res.sendBody( js, "utf8" );
                    res.finish();
                };
                seeker( req, res );
            } );
        }
    }

    // Deliver Update Notice
    else clients.push({ already : utility.earliest(), vow : function(ready) {
        res.sendHeader( 200, {"Content-Type" : "application/javascript"} );
        res.sendBody(utility.vigilant(
            ready ? 'success' : '', req.uri.params.unique
        ));
        res.finish();
    } });
}).listen( config.seeker.port, config.seeker.host );

sys.puts("\nSeeker Server("+process.pid+")");
utility.inform(config.seeker);

function update( file ) {
    utility.inform({ file: file, connections: clients.length });
    while (clients.length > 0) clients.shift().vow(1);
}

function seek( radical ) {
    utility.recurse( appdir, config.seeker.ignore, function( file ) {
        if (seeking[file]) return;
        else if (radical) update(file);

        seeking[file] = 1;
        process.watchFile( file, function() {
            seek(true);
            update(file);
        } );
    } );
}

seek();

setInterval( function() {
    var instant = utility.earliest();
    while (clients.length > 0 && (instant - clients[0].already > 25000))
        clients.shift().vow(0)
}, 1000 );
