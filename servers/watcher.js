var sys         = require('sys')
,   http        = require('http')
,   posix       = require('posix')
,   config      = {}
,   callbacks   = []
,   connections = 0;

// Start By Loading Config and Directories
posix.cat('./configure/watcher.json.js').addCallback(function(config) {
    config = JSON.parse(config);
    sys.print(sys.inspect(config));

    // Recurse through all directories.
    posix.readdir(config.watch).addCallback(function(dirs) {
        
    });
});

// Recursive Directory File Gathering
var redirect = function( start, ignore ) {
    posix.readdir(start).addCallback(function(files) {
        // Get Status of Each File
        files.forEach(function(file) {
            posix.stat().addCallback(function (stats) {
                sys.puts("stats: " + JSON.stringify(stats));
            });
        });
        //redirect
    });
};


// Start Watcher Server
http.createServer(function (req, res) {
    callbacks.push(function(wait) {
        res.sendHeader( 200, {"Content-Type": "text/plain"} );
        res.sendBody(wait);
        res.finish();
    });

    sys.puts('\nCallback Length: ' + callbacks.length);
    sys.puts('\nConnections: '     + connections++);
}).listen(8002);



/*

posix.readdir('/opt/nodejuice/').addCallback( function(dirs) {
    sys.print(sys.inspect(dirs));
} );
*/

/*
http.createServer(function (req, res) {
    res.sendHeader(200, {"Content-Type": "text/plain"});
    res.sendBody("Hello World\n");
    res.finish();
}).listen(8000);
*/

/*
    plan:
    ------
    load json files

    recursive dir to get all files and watch them.
        attache them all to same event listenter

+posix.readdir(path)+ ::
+posix.cat(filename, encoding="utf8")+::
*/

/*

*/

/*
process.watchFile( file, function(curr, prev) {
    if ( curr.size == prev.size ) return;

    while (callbacks.length > 0) {
        sys.puts('\nlength: ' + callbacks.length);
        callbacks.shift()(content + ' length: ' + callbacks.length);
    }
} );
sys.puts("Server running at http://127.0.0.1:8000/");

*/
