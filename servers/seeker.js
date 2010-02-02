var sys        = require('sys')
,   http       = require('http')
,   appdir     = process.ARGV[2]
,   njdir      = process.ARGV[3]
,   njconfig   = process.ARGV[4]
,   devmode    = process.ARGV[5]
,   utility    = require(njdir + '/library/utility')
,   config     = utility.ignite()
,   clients    = []
,   seeking    = {}
,   seeker     = false
,   antecedent = utility.earliest();

process.addListener( "unhandledException", function(msg) { inform(msg) } );

if (!devmode) process.exit();

setTimeout( function() { seek() }, 1 );

http.createServer(function ( req, res ) {
    var unique = req.url.split('?unique=')[1];

    // Deliver Client JS
    if (typeof unique === 'undefined') {

        if (seeker) return seeker( req, res );

        utility.noble( njdir + '/library/seeker.min.js',
        function( type, js, encoding ) {
            seeker = function( request, response ) {
                var headers = { "Content-Type" : type }
                ,   host    = request.headers.host.split(':')[0] +
                           ':' + config.seeker.port;

                js = utility.supplant( js, {
                    host : host,
                    wait : config.seeker.wait
                } );

                headers['Content-Length'] = js.length;

                response.sendHeader( 200, headers );
                response.sendBody( js, "utf8" );
                response.finish();

                antup();
            };
            seeker( req, res );
        }, function() {
            utility.inform({
                fail: 'unabled to load seeker.min.js',
                file: njdir + '/library/seeker.min.js'
            });
        } );
    }

    // Deliver Update Notice
    else clients.push({ already : utility.earliest(), vow : function(ready) {
        res.sendHeader( 200, {"Content-Type" : "application/javascript"} );
        res.sendBody(utility.vigilant(
            ready ? 'success' : '', unique
        ));
        res.finish();
    } });
}).listen( config.seeker.port, config.seeker.host );

sys.puts("\nSeeker Server("+process.pid+")");
utility.inform(config.seeker);

function update( file, curr, prev, stat ) {
    var atime = curr &&
        JSON.stringify(curr.atime) != JSON.stringify(prev.atime);

    var mtime = curr &&
        JSON.stringify(curr.mtime) != JSON.stringify(prev.mtime);

    var ctime = curr &&
        JSON.stringify(curr.ctime) != JSON.stringify(prev.ctime);

    var removed = curr &&
        JSON.stringify(curr.nlink) != JSON.stringify(prev.nlink);

    var added   = !seeking[file];
    var touched = atime && mtime && ctime;
    var saved   = mtime;

    // File Removed?
    if ( removed ) seeking[file] = 0;

    if (utility.earliest() - antecedent < config.seeker.wait) return;
    if ( !(added || removed || saved) ) return;
    if (!config.seeker.touch && touched) return;

    antup();
    utility.inform({ pushing_update : file });

    setTimeout( function() {
        while (clients.length > 0) clients.shift().vow(1);
        seek();
    }, config.seeker.delay );
}

function antup() {
    antecedent = utility.earliest();
}

function seek() {
    utility.recurse( appdir, config.seeker.ignore, function( file, stat ) {
        if (seeking[file]) return;
        update( file );
        process.watchFile( file, function( curr, prev ) {
            update( file, curr, prev, stat )
        } );
        seeking[file] = 1;
    } );
}

setInterval( function() {
    var instant = utility.earliest();
    while (clients.length > 0 && (instant - clients[0].already > 25000))
        clients.shift().vow(0)
}, 1000 );
