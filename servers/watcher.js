var sys         = require('sys')
,   http        = require('http')
,   posix       = require('posix')
,   config      = {}
,   callbacks   = []
,   connections = 0;

// Start By Loading Config and Directories
posix.cat('./configure/watcher.json.js').addCallback(function(config) {
    config = JSON.parse(config);

    http.createServer(function (req, res) {
        callbacks.push(function(wait) {
            res.sendHeader( 200, {"Content-Type": "text/plain"} );
            res.sendBody(wait);
            res.finish();
        });

        sys.puts('\nCallback Length: ' + callbacks.length);
        sys.puts('\nConnections: '     + connections++);
    }).listen(config.port);

    recdirectory( config.watch, config.ignore, function( file, stats ) {
        sys.puts(file);

        process.watchFile( file, function(curr, prev) {
            // if ( curr.size == prev.size ) return;

            sys.puts('\nfile: ' + file + ' length: ' + callbacks.length);
            while (callbacks.length > 0) {
                callbacks.shift()(content + ' length: ' + callbacks.length);
            }
        } );
    } );
});

// Non Blocking Recursive Directory
var recdirectory = function( start, ignore, callback ) {
    posix.readdir(start).addCallback(function(files) {
        files.forEach(function(file) {
            // Ignored Files/Directories
            if (ignore.filter(function(item) {
                return (new RegExp(item)).test(file)
            }).length) return;

            recdirectory( start + '/' + file, ignore, callback );
            callback(start + '/' + file);
        });
    });
};
